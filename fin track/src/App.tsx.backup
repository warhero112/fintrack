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
} from "lucide-react";

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
  const [tab, setTab] = useState(0); // 0 Home, 1 Stats, 2 Add, 3 Wallets, 4 Profile
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // categories, budgets, export, help
  
  // Core data - NO MORE DEBOUNCED SAVES
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
  
  // Editing state for smooth typing - completely separate from main data
  const [editingAccountData, setEditingAccountData] = useState({});
  const [editingBudgetData, setEditingBudgetData] = useState({});
  
  const [draft, setDraft] = useState(() => ({
    id: null, amount: "", label: "", category: categories[0] || "Food", 
    type: "expense", date: todayISO(), accountId: accounts[0]?.id || "acc1"
  }));

  // Save data when it changes (NOT during editing)
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

  const startEditingAccount = (account) => {
    setEditingAccount(account.id);
    setEditingAccountData({
      name: account.name,
      balance: String(account.balance),
      currency: account.currency
    });
  };

  const saveAccount = () => {
    const { name, balance, currency } = editingAccountData;
    if (!name || !currency) {
      alert("Please fill all required fields.");
      return;
    }
    
    setAccounts(prev => prev.map(acc =>
      acc.id === editingAccount ? {
        ...acc,
        name,
        balance: Number(balance) || 0,
        currency
      } : acc
    ));
    setEditingAccount(null);
    setEditingAccountData({});
  };

  const deleteAccount = (id) => {
    if (accounts.length <= 1) {
      alert("You must have at least one account.");
      return;
    }
    setAccounts(prev => prev.filter(acc => acc.id !== id));
    setEditingAccount(null);
    setEditingAccountData({});
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const deleteCategory = (category) => {
    if (categories.length > 1) {
      setCategories(prev => prev.filter(c => c !== category));
    }
  };

  const addBudget = () => {
    const newBudget = { 
      id: uid(), category: categories[0], limit: 0, spent: 0, period: "monthly" 
    };
    setBudgets(prev => [...prev, newBudget]);
    setEditingBudget(newBudget.id);
    setEditingBudgetData({
      category: newBudget.category,
      limit: "0",
      spent: "0",
      period: newBudget.period
    });
  };

  const startEditingBudget = (budget) => {
    setEditingBudget(budget.id);
    setEditingBudgetData({
      category: budget.category,
      limit: String(budget.limit),
      spent: String(budget.spent),
      period: budget.period
    });
  };

  const saveBudget = () => {
    const { category, limit, spent, period } = editingBudgetData;
    if (!category || !period) {
      alert("Please fill all required fields.");
      return;
    }
    
    setBudgets(prev => prev.map(budget =>
      budget.id === editingBudget ? {
        ...budget,
        category,
        limit: Number(limit) || 0,
        spent: Number(spent) || 0,
        period
      } : budget
    ));
    setEditingBudget(null);
    setEditingBudgetData({});
  };

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    setEditingBudget(null);
    setEditingBudgetData({});
  };

  const exportData = () => {
    const data = { accounts, tx, settings, categories, budgets };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.accounts) setAccounts(data.accounts);
          if (data.tx) setTx(data.tx);
          if (data.settings) setSettings(data.settings);
          if (data.categories) setCategories(data.categories);
          if (data.budgets) setBudgets(data.budgets);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
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

  const Sidebar = () => (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar fixed top-0 left-0 h-full w-64 ${BG} border-r border-border shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-semibold ${textLight}`}>Menu</h2>
            <button
              className="p-2 rounded-xl hover:bg-muted"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { i: <Settings size={18} />, l: "Settings", action: () => setTab(4) },
              { i: <Tags size={18} />, l: "Manage Categories", action: () => setActiveModal('categories') },
              { i: <Target size={18} />, l: "Budgets & Goals", action: () => setActiveModal('budgets') },
              { i: <Download size={18} />, l: "Export Data", action: exportData },
              { i: <Upload size={18} />, l: "Import Data", action: () => document.getElementById('import-file').click() },
              { i: <HelpCircle size={18} />, l: "Help & About", action: () => setActiveModal('help') },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition hover:bg-muted ${textLight}`}
                onClick={() => {
                  item.action();
                  setSidebarOpen(false);
                }}
              >
                {item.i}
                <span>{item.l}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      <input
        id="import-file"
        type="file"
        accept=".json"
        onChange={importData}
        className="hidden"
      />
    </>
  );

  const StatCard = ({ label, value }) => (
    <div className={`${CARD} p-4 w-full`}>
      <div className={`text-sm ${textSub}`}>{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${textLight}`}>
        {fmt(value, settings.currency)}
      </div>
    </div>
  );

  const BottomNav = () => (
    <div className={`fixed bottom-0 left-0 right-0 ${BG}/95 backdrop-blur border-t border-border`}>
      <div className="mx-auto max-w-md grid grid-cols-5 py-2">
        {[
          { i: <Home size={20} />, l: "Home" },
          { i: <PieIcon size={20} />, l: "Stats" },
          { i: <Plus size={20} />, l: "Add" },
          { i: <Wallet size={20} />, l: "Wallets" },
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

  // --- Modal Components ---
  const Modal = ({ isOpen, onClose, title, children }) => (
    <div className={`fixed inset-0 bg-black/30 z-50 ${isOpen ? '' : 'pointer-events-none opacity-0'} transition-opacity`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`${BG} ${CARD} p-6 max-w-md w-full max-h-[80vh] overflow-y-auto`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${textLight}`}>{title}</h3>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted">
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );

  const CategoriesModal = () => (
    <Modal isOpen={activeModal === 'categories'} onClose={() => setActiveModal(null)} title="Manage Categories">
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded-xl px-3 py-2 bg-input-background"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCategory()}
          />
          <button onClick={addCategory} className={`${BTN} bg-primary text-primary-foreground`}>
            Add
          </button>
        </div>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category} className="flex items-center justify-between p-2 rounded-xl bg-muted/50">
              <span className={textLight}>{category}</span>
              <button
                onClick={() => deleteCategory(category)}
                className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );

  const BudgetsModal = () => (
    <Modal isOpen={activeModal === 'budgets'} onClose={() => setActiveModal(null)} title="Budgets & Goals">
      <div className="space-y-4">
        <button onClick={addBudget} className={`${BTN} bg-primary text-primary-foreground w-full`}>
          <Plus size={16} /> Add Budget
        </button>
        <div className="space-y-3">
          {budgets.map(budget => (
            <div key={budget.id} className={`${CARD} p-3`}>
              {editingBudget === budget.id ? (
                <div className="space-y-2">
                  <select
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    value={editingBudgetData.category}
                    onChange={(e) => setEditingBudgetData(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    placeholder="Budget limit"
                    value={editingBudgetData.limit}
                    onChange={(e) => setEditingBudgetData(prev => ({ ...prev, limit: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveBudget}
                      className={`${BTN} bg-primary text-primary-foreground flex-1`}
                    >
                      <Check size={16} /> Done
                    </button>
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className={`${BTN} bg-destructive text-destructive-foreground`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => startEditingBudget(budget)} className="cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${textLight}`}>{budget.category}</span>
                    <span className={`text-sm ${textSub}`}>{fmt(budget.spent, settings.currency)} / {fmt(budget.limit, settings.currency)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );

  const HelpModal = () => (
    <Modal isOpen={activeModal === 'help'} onClose={() => setActiveModal(null)} title="Help & About">
      <div className="space-y-4">
        <div>
          <h4 className={`font-medium ${textLight} mb-2`}>Fin Track v1.0</h4>
          <p className={`text-sm ${textSub}`}>A modern finance tracking application for managing your expenses and income.</p>
        </div>
        <div>
          <h4 className={`font-medium ${textLight} mb-2`}>Quick Tips:</h4>
          <ul className={`text-sm ${textSub} space-y-1`}>
            <li>• Tap the + button to quickly add transactions</li>
            <li>• Click on wallet cards to edit account details</li>
            <li>• Use the hamburger menu for advanced features</li>
            <li>• Export your data regularly for backup</li>
          </ul>
        </div>
        <div>
          <h4 className={`font-medium ${textLight} mb-2`}>Support:</h4>
          <p className={`text-sm ${textSub}`}>For questions or feedback, please contact our support team.</p>
        </div>
      </div>
    </Modal>
  );

  // --- Screens ---
  const HomeScreen = () => (
    <div className="pb-28">
      <TopBar title="Fin Track" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Balance" value={totals.balance} />
          <StatCard label="Income" value={totals.income} />
          <StatCard label="Expenses" value={-totals.expenses} />
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
            <button className={`${BTN} text-xs bg-muted ${textLight}`} onClick={() => setShowAdd(true)}>
              <Plus size={16} /> New
            </button>
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

  const StatsScreen = () => (
    <div className="pb-28">
      <TopBar title="Statistics" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        <div className={`${CARD} p-4`}>
          <div className={`text-sm ${textSub} mb-2`}>Expenses by Category</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={txByCategory} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {txByCategory.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${CARD} p-4`}>
          <div className={`text-sm ${textSub} mb-2`}>Income vs Expense</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#22C55E" />
                <Bar dataKey="expense" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const WalletsScreen = () => (
    <div className="pb-28">
      <TopBar title="Wallets" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        {accounts.map(a => (
          <div key={a.id} className={`${CARD} p-4`}>
            {editingAccount === a.id ? (
              <div className="space-y-3">
                <div>
                  <label className={`block text-sm ${textSub} mb-1`}>Account Name</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    value={editingAccountData.name}
                    onChange={(e) => setEditingAccountData(prev => ({ ...prev, name: e.target.value }))}
                    autoFocus
                  />
                </div>
                <div>
                  <label className={`block text-sm ${textSub} mb-1`}>Balance</label>
                  <input
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    value={editingAccountData.balance}
                    onChange={(e) => setEditingAccountData(prev => ({ ...prev, balance: e.target.value }))}
                    placeholder="Enter balance"
                  />
                </div>
                <div>
                  <label className={`block text-sm ${textSub} mb-1`}>Currency</label>
                  <select
                    className="w-full border rounded-xl px-3 py-2 bg-input-background"
                    value={editingAccountData.currency}
                    onChange={(e) => setEditingAccountData(prev => ({ ...prev, currency: e.target.value }))}
                  >
                    {["JPY","USD","EUR","LKR","GBP","AUD","CAD","INR","SGD","CNY"].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`${BTN} bg-primary text-primary-foreground flex-1`}
                    onClick={saveAccount}
                  >
                    <Check size={16} /> Done
                  </button>
                  <button
                    className={`${BTN} bg-destructive text-destructive-foreground`}
                    onClick={() => deleteAccount(a.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between cursor-pointer" onClick={() => startEditingAccount(a)}>
                <div>
                  <div className={`text-sm ${textSub}`}>{a.name}</div>
                  <div className={`text-xl font-semibold ${textLight}`}>{fmt(a.balance, a.currency)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-xs ${textSub}`}>{a.currency}</div>
                  <Edit3 size={16} className={textSub} />
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          className={`${BTN} bg-primary text-primary-foreground w-full`}
          onClick={() => {
            const newAccount = {
              id: uid(), name: `Account ${accounts.length + 1}`, balance: 0, currency: settings.currency
            };
            setAccounts(prev => [...prev, newAccount]);
            startEditingAccount(newAccount);
          }}
        >
          + Add account
        </button>
      </div>
    </div>
  );

  const ProfileScreen = () => (
    <div className="pb-28">
      <TopBar title="Profile & Settings" />
      <div className="px-4 space-y-4 max-w-md mx-auto">
        {/* Personal Info */}
        <div className={`${CARD} p-4`}>
          <h3 className={`font-medium ${textLight} mb-3`}>Personal Information</h3>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Full Name</label>
              <input
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
            </div>
          </div>
        </div>

        {/* App Preferences */}
        <div className={`${CARD} p-4`}>
          <h3 className={`font-medium ${textLight} mb-3`}>App Preferences</h3>
          <div className="space-y-3">
            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Default Currency</label>
              <select
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              >
                {["JPY","USD","EUR","LKR","GBP","AUD","CAD","INR","SGD","CNY"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Language</label>
              <select
                className="w-full border rounded-xl px-3 py-2 bg-input-background"
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              >
                {["English", "日本語", "Español", "Français", "Deutsch"].map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block text-sm ${textSub} mb-1`}>Theme</label>
              <div className="flex gap-2">
                {[
                  { value: 'light', icon: <Sun size={16} />, label: 'Light' },
                  { value: 'dark', icon: <Moon size={16} />, label: 'Dark' },
                  { value: 'system', icon: <Monitor size={16} />, label: 'System' },
                ].map(theme => (
                  <button
                    key={theme.value}
                    onClick={() => setSettings(prev => ({ ...prev, theme: theme.value }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition ${
                      settings.theme === theme.value ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {theme.icon}
                    <span className="text-sm">{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className={`${CARD} p-4`}>
          <h3 className={`font-medium ${textLight} mb-3`}>Data Management</h3>
          <div className="space-y-2">
            <button
              className={`${BTN} bg-muted ${textLight} w-full justify-start`}
              onClick={exportData}
            >
              <Download size={16} />
              Export All Data
            </button>
            <button
              className={`${BTN} bg-muted ${textLight} w-full justify-start`}
              onClick={() => document.getElementById('import-file').click()}
            >
              <Upload size={16} />
              Import Data
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className={`${CARD} p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-sm font-medium ${textLight}`}>Fin Track</div>
              <div className={`text-xs ${textSub}`}>Version 1.0.0</div>
            </div>
            <button
              className={`${BTN} bg-muted ${textLight}`}
              onClick={() => setActiveModal('help')}
            >
              <Info size={16} />
              About
            </button>
          </div>
        </div>
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
                <select
                  className="w-full border rounded-xl px-3 py-2 bg-input-background"
                  value={draft.category}
                  onChange={(e) => setDraft(prev => ({ ...prev, category: e.target.value }))}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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
        {tab === 1 && <StatsScreen />}
        {tab === 3 && <WalletsScreen />}
        {tab === 4 && <ProfileScreen />}
      </div>
      <AddSheet />
      <BottomNav />
      <Sidebar />
      
      {/* Modals */}
      <CategoriesModal />
      <BudgetsModal />
      <HelpModal />
    </div>
  );
}