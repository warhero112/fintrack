import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Plus,
  Home,
  PieChart as PieIcon,
  Wallet,
  User,
  Bell,
  Menu,
  ChevronLeft,
  Trash2,
  Edit3,
  X,
  Check,
  Settings,
  Tags,
  Target,
  Download,
  Upload,
  HelpCircle,
  Info,
  Moon,
  Sun,
  Monitor,
  Brain,
  Camera,
  Scan,
} from "lucide-react";
import { AIFinancialAdvisor } from './components/ai/AIFinancialAdvisor'
import { SmartCategorizer } from './components/ai/SmartCategorizer'
import { Sidebar } from './components/Sidebar'
import { BillScanner } from './components/scanning/BillScanner'
import { FinancialData } from './lib/ai/deepseek'

// --- Utilities ---
const fmt = (n, currency) => {
  try {
    if (!currency || typeof currency !== "string") {
      currency = "USD";
    }
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(Number(n) || 0);
  } catch (error) {
    console.error("Currency formatting error:", error);
    return `${currency} ${Number(n) || 0}`;
  }
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

// --- Design Tokens ---
const COLORS = [
  "#6366F1", "#22C55E", "#F97316", "#06B6D4", "#EF4444", 
  "#A855F7", "#84CC16", "#E11D48", "#0EA5E9", "#14B8A6",
];
const BG = "bg-background";
const CARD = "rounded-2xl shadow-sm border border-border bg-card";
const BTN = "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 font-medium shadow-sm hover:shadow transition active:scale-[.98]";
const textLight = "text-foreground";
const textSub = "text-muted-foreground";

// --- Seed Data ---
const DEFAULT_ACCOUNTS = [
  { id: "acc1", name: "Main Wallet", balance: 152340.12, currency: "JPY" },
  { id: "acc2", name: "Savings", balance: 540000, currency: "JPY" },
];

const DEFAULT_TX = [
  { id: uid(), date: todayISO(), label: "Salary", amount: 300000, type: "income", category: "Salary", accountId: "acc1" },
  { id: uid(), date: todayISO(), label: "Groceries", amount: 5800, type: "expense", category: "Food", accountId: "acc1" },
  { id: uid(), date: todayISO(), label: "Train Pass", amount: 12000, type: "expense", category: "Transport", accountId: "acc1" },
  { id: uid(), date: todayISO(), label: "Coffee", amount: 480, type: "expense", category: "Food", accountId: "acc1" },
  { id: uid(), date: todayISO(), label: "Electricity", amount: 7600, type: "expense", category: "Utilities", accountId: "acc1" },
];

const DEFAULT_SETTINGS = {
  currency: "JPY",
  theme: "light",
  name: "Fin Track User",
  locale: "en",
  language: "English",
};

const DEFAULT_CATEGORIES = [
  "Food", "Transport", "Shopping", "Bills", "Utilities", 
  "Health", "Entertainment", "Travel", "Education", "Other", 
  "Salary", "Bonus"
];

const DEFAULT_BUDGETS = [
  { id: uid(), category: "Food", limit: 50000, spent: 6280, period: "monthly" },
  { id: uid(), category: "Transport", limit: 20000, spent: 12000, period: "monthly" },
];

// --- Main App ---
export default function App() {
  const [tab, setTab] = useState(0); // 0 Home, 1 Stats, 2 Add, 3 Wallets, 4 Profile, 5 AI Advisor
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showAICategorizer, setShowAICategorizer] = useState(false);
  const [showBillScanner, setShowBillScanner] = useState(false);
  const [categorizerData, setCategorizerData] = useState({ description: '', amount: 0 });
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  
  // Core data
  const [accounts, setAccounts] = useState(() => load("fintrack.accounts", DEFAULT_ACCOUNTS));
  const [tx, setTx] = useState(() => load("fintrack.tx", DEFAULT_TX));
  const [settings, setSettings] = useState(() => load("fintrack.settings", DEFAULT_SETTINGS));
  
  // Extended data
  const [categories, setCategories] = useState(() => load("fintrack.categories", DEFAULT_CATEGORIES));
  const [budgets, setBudgets] = useState(() => load("fintrack.budgets", DEFAULT_BUDGETS));
  
  // UI state
  const [showAdd, setShowAdd] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editingBudget, setEditingBudget] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  
  // Editing state
  const [editingAccountData, setEditingAccountData] = useState({});
  const [editingBudgetData, setEditingBudgetData] = useState({});
  
  const [draft, setDraft] = useState(() => ({
    id: null, amount: "", label: "", category: categories[0] || "Food", 
    type: "expense", date: todayISO(), accountId: accounts[0]?.id || "acc1"
  }));

  // Prepare financial data for AI
  const financialData: FinancialData = useMemo(() => {
    const income = tx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
    const expenses = tx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
    const balance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0) + income - expenses;
    
    return {
      transactions: tx.map(t => ({
        id: t.id,
        amount: Number(t.amount),
        category: t.category,
        type: t.type,
        date: t.date,
        description: t.label
      })),
      accounts: accounts.map(a => ({
        id: a.id,
        name: a.name,
        balance: Number(a.balance),
        currency: a.currency
      })),
      budgets: budgets.map(b => ({
        category: b.category,
        limit: Number(b.limit),
        spent: Number(b.spent)
      })),
      totalIncome: income,
      totalExpenses: expenses,
      netWorth: balance
    };
  }, [tx, accounts, budgets]);

  // Save data when it changes
  useEffect(() => {
    if (!editingAccount) {
      save("fintrack.accounts", accounts);
    }
  }, [accounts, editingAccount]);

  useEffect(() => {
    save("fintrack.tx", tx);
  }, [tx]);

  useEffect(() => {
    save("fintrack.settings", settings);
  }, [settings]);

  useEffect(() => {
    save("fintrack.categories", categories);
  }, [categories]);

  useEffect(() => {
    if (!editingBudget) {
      save("fintrack.budgets", budgets);
    }
  }, [budgets, editingBudget]);

  // Theme handling
  useEffect(() => {
    const applyTheme = () => {
      if (settings.theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', isDark);
      } else {
        document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      }
    };
    
    applyTheme();
    
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [settings.theme]);

  // Update draft accountId if accounts change
  useEffect(() => {
    if (!draft.accountId || !accounts.find(acc => acc.id === draft.accountId)) {
      setDraft(prev => ({ ...prev, accountId: accounts[0]?.id || "acc1" }));
    }
  }, [accounts, draft.accountId]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.hamburger-btn')) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen]);

  // --- Computed Data ---
  const totals = useMemo(() => {
    const income = tx.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount || 0), 0);
    const expenses = tx.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount || 0), 0);
    const balance = accounts.reduce((s, a) => s + Number(a.balance || 0), 0) + income - expenses;
    return { income, expenses, balance };
  }, [tx, accounts]);

  const txByCategory = useMemo(() => {
    const map = {};
    tx.filter(t => t.type === "expense").forEach(t => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
    });
    return Object.entries(map).map(([name, value], i) => ({
      name, value, fill: COLORS[i % COLORS.length]
    }));
  }, [tx]);

  const monthlySeries = useMemo(() => {
    const map = {};
    tx.forEach(t => {
      const d = t.date?.slice(8, 10) || "01";
      map[d] = map[d] || { day: d, income: 0, expense: 0 };
      const amount = Number(t.amount || 0);
      if (t.type === "income") map[d].income += amount;
      else map[d].expense += amount;
    });
    return Object.values(map).sort((a, b) => a.day.localeCompare(b.day));
  }, [tx]);

  // --- Helper Functions ---
  const resetDraft = () => {
    setDraft({
      id: null, amount: "", label: "", category: categories[0] || "Food",
      type: "expense", date: todayISO(), accountId: accounts[0]?.id || "acc1"
    });
  };

  const openAdd = (existing) => {
    if (existing) {
      setDraft({ ...existing, amount: String(existing.amount || "") });
    } else {
      resetDraft();
    }
    setShowAdd(true);
  };

  const saveTx = () => {
    const amt = Number(draft.amount);
    if (!amt || !draft.label || !draft.category || !draft.accountId) {
      return alert("Please fill all required fields.");
    }

    if (draft.id) {
      setTx(prev => prev.map(t => t.id === draft.id ? { ...draft, amount: amt } : t));
    } else {
      setTx(prev => [{ id: uid(), ...draft, amount: amt }, ...prev]);
    }
    setShowAdd(false);
    resetDraft();
  };

  const deleteTx = (id) => setTx(prev => prev.filter(t => t.id !== id));

  const handleAICategorization = () => {
    if (!draft.label || !draft.amount) {
      alert("Please enter description and amount first.");
      return;
    }
    setCategorizerData({
      description: draft.label,
      amount: Number(draft.amount)
    });
    setShowAICategorizer(true);
  };

  const handleCategorySelected = (category) => {
    setDraft(prev => ({ ...prev, category }));
    setShowAICategorizer(false);
  };

  const handleBillScanComplete = (scannedData) => {
    // Pre-fill the form with scanned data
    setDraft(prev => ({
      ...prev,
      amount: scannedData.amount ? String(scannedData.amount) : prev.amount,
      label: scannedData.merchant || prev.label,
      category: scannedData.category || prev.category,
      date: scannedData.date || prev.date,
      type: "expense" // Scanned bills are typically expenses
    }));
    setShowBillScanner(false);
    setShowAdd(true);
  };

  // --- UI Components ---
  const TopBar = ({ title }) => (
    <div className={`sticky top-0 z-10 ${BG} ${CARD} px-4 py-3 mb-3 flex items-center justify-between`}>
      <button
        className="hamburger-btn p-2 rounded-xl hover:bg-muted"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={18} />
      </button>
      <h1 className={`text-lg font-semibold ${textLight}`}>{title}</h1>
      <button className="p-2 rounded-xl hover:bg-muted">
        <Bell size={18} />
      </button>
    </div>
  );

  const BottomNav = () => (
    <div className={`fixed bottom-0 left-0 right-0 ${BG}/95 backdrop-blur border-t border-border`}>
      <div className="mx-auto max-w-md grid grid-cols-6 py-2">
        {[
          { i: <Home size={20} />, l: "Home" },
          { i: <PieIcon size={20} />, l: "Stats" },
          { i: <Plus size={20} />, l: "Add" },
          { i: <Wallet size={20} />, l: "Wallets" },
          { i: <Brain size={20} />, l: "AI" },
          { i: <User size={20} />, l: "Profile" },
        ].map((t, idx) => (
          <button
            key={idx}
            onClick={() => idx === 2 ? setShowAdd(true) : setTab(idx)}
            className={`flex flex-col items-center gap-1 py-1 ${tab === idx ? "text-primary" : textSub}`}
          >
            <div className={`p-2 rounded-2xl ${idx === 2 ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
              {t.i}
            </div>
            <div className="text-[11px]">{t.l}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // --- Screens ---
  const HomeScreen = () => (
    <div className="pb-28">
      <TopBar title="Fin Track" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3">
          <div className={`${CARD} p-4 w-full`}>
            <div className={`text-sm ${textSub}`}>Balance</div>
            <div className={`text-2xl font-semibold mt-1 ${textLight}`}>
              {fmt(totals.balance, settings.currency)}
            </div>
          </div>
          <div className={`${CARD} p-4 w-full`}>
            <div className={`text-sm ${textSub}`}>Income</div>
            <div className={`text-2xl font-semibold mt-1 ${textLight}`}>
              {fmt(totals.income, settings.currency)}
            </div>
          </div>
          <div className={`${CARD} p-4 w-full`}>
            <div className={`text-sm ${textSub}`}>Expenses</div>
            <div className={`text-2xl font-semibold mt-1 ${textLight}`}>
              {fmt(-totals.expenses, settings.currency)}
            </div>
          </div>
        </div>

        <div className={`${CARD} p-4`}>
          <div className={`text-sm ${textSub} mb-2`}>This Month</div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySeries}>
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22C55E" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${CARD} p-4`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`text-sm ${textSub}`}>Recent Transactions</div>
            <div className="flex space-x-2">
              <button 
                className={`${BTN} text-xs bg-blue-600 text-white`} 
                onClick={() => setShowBillScanner(true)}
                title="Scan Bill/Receipt"
              >
                <Camera size={16} /> Scan
              </button>
              <button className={`${BTN} text-xs bg-muted ${textLight}`} onClick={() => setShowAdd(true)}>
                <Plus size={16} /> New
              </button>
            </div>
          </div>
          <div className="divide-y divide-border">
            {tx.length === 0 && <div className={`text-sm ${textSub}`}>No transactions yet.</div>}
            {tx.slice(0, 5).map(t => (
              <div key={t.id} className="py-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  t.type === "income" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                }`}>
                  <span className={t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {t.type === "income" ? "+" : "-"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-medium ${textLight}`}>{t.label}</div>
                  <div className={`text-xs ${textSub}`}>{t.category} • {t.date}</div>
                </div>
                <div className={`text-sm font-semibold ${
                  t.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {t.type === "income" ? "+" : "-"}{fmt(t.amount, settings.currency)}
                </div>
                <button className="ml-2 p-2 rounded-xl hover:bg-muted" onClick={() => openAdd(t)}>
                  <Edit3 size={16} />
                </button>
                <button className="p-2 rounded-xl hover:bg-muted" onClick={() => deleteTx(t.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AIAdvisorScreen = () => (
    <div className="pb-28">
      <TopBar title="AI Financial Advisor" />
      <div className="px-4 max-w-4xl mx-auto">
        <AIFinancialAdvisor financialData={financialData} />
      </div>
    </div>
  );

  const AddSheet = () => (
    <div
      className={`fixed inset-0 bg-black/30 z-50 ${showAdd ? "" : "pointer-events-none opacity-0"} transition-opacity`}
      onClick={() => setShowAdd(false)}
    >
      <div
        className={`fixed bottom-0 left-0 right-0 ${BG} rounded-t-2xl shadow-xl transition-transform duration-300 ease-out mx-auto max-w-md ${
          showAdd ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              className="p-2 rounded-xl hover:bg-muted"
              onClick={() => setShowAdd(false)}
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className={`font-semibold ${textLight}`}>
              {draft.id ? "Edit Transaction" : "Add Transaction"}
            </h3>
            <button
              onClick={() => setShowBillScanner(true)}
              className="ml-auto p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              title="Scan Bill/Receipt"
            >
              <Camera size={16} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm ${textSub} mb-1`}>Amount</label>
                <input
                  className="w-full border rounded-xl px-3 py-2 bg-input-background"
                  placeholder="0.00"
                  value={draft.amount}
                  onChange={(e) => setDraft(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div>
                <label className={`block text-sm ${textSub} mb-1`}>Type</label>
                <select
                  className="w-full border rounded-xl px-3 py-2 bg-input-background"
                  value={draft.type}
                  onChange={(e) => setDraft(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Description</label>
              <input
                type="text"
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                placeholder="e.g., Groceries"
                value={draft.label}
                onChange={(e) => setDraft(prev => ({ ...prev, label: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-sm ${textSub} mb-1`}>Category</label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 border rounded-xl px-3 py-2 bg-input-background"
                    value={draft.category}
                    onChange={(e) => setDraft(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button
                    onClick={handleAICategorization}
                    className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    title="AI Category Suggestion"
                  >
                    <Brain size={16} />
                  </button>
                </div>
              </div>
              <div>
                <label className={`block text-sm ${textSub} mb-1`}>Date</label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-3 py-2 bg-input-background"
                  value={draft.date}
                  onChange={(e) => setDraft(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Account</label>
              <select
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                value={draft.accountId}
                onChange={(e) => setDraft(prev => ({ ...prev, accountId: e.target.value }))}
              >
                {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                className={`${BTN} bg-primary text-primary-foreground flex-1`}
                onClick={saveTx}
              >
                Save Transaction
              </button>
              <button
                className={`${BTN} bg-muted ${textLight}`}
                onClick={() => { setShowAdd(false); resetDraft(); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${BG} ${textLight}`}>
      <div className="mx-auto max-w-md pb-24">
        {tab === 0 && <HomeScreen />}
        {tab === 1 && <div className="pb-28"><TopBar title="Statistics" /></div>}
        {tab === 3 && <div className="pb-28"><TopBar title="Wallets" /></div>}
        {tab === 4 && <div className="pb-28"><TopBar title="Profile" /></div>}
        {tab === 5 && <AIAdvisorScreen />}
      </div>
      <AddSheet />
      <BottomNav />
      
      {showAICategorizer && (
        <SmartCategorizer
          description={categorizerData.description}
          amount={categorizerData.amount}
          onCategorySelected={handleCategorySelected}
          onClose={() => setShowAICategorizer(false)}
        />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      {showBillScanner && (
        <BillScanner
          onScanComplete={handleBillScanComplete}
          onClose={() => setShowBillScanner(false)}
        />
      )}
    </div>
  );
}
