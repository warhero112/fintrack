const fs = require('fs');

// Read the current App.tsx
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add GoalsScreen import
content = content.replace(
  "import { Sidebar } from './components/Sidebar'",
  "import { Sidebar } from './components/Sidebar'\nimport { GoalsScreen } from './components/GoalsScreen'"
);

// Add Goals tab to the navigation (tab 6)
content = content.replace(
  '  const [tab, setTab] = useState(0); // 0 Home, 1 Stats, 2 Add, 3 Wallets, 4 Profile, 5 AI Advisor',
  '  const [tab, setTab] = useState(0); // 0 Home, 1 Stats, 2 Add, 3 Wallets, 4 Profile, 5 AI Advisor, 6 Goals'
);

// Add Goals screen to the render
content = content.replace(
  '        {tab === 5 && <AIAdvisorScreen />}',
  '        {tab === 5 && <AIAdvisorScreen />}\n        {tab === 6 && <GoalsScreen />}'
);

// Add Goals to the bottom navigation
content = content.replace(
  '          { i: <User size={20} />, l: "Profile" },',
  '          { i: <User size={20} />, l: "Profile" },\n          { i: <Target size={20} />, l: "Goals" },'
);

// Update the navigation array length check
content = content.replace(
  '        {navItems.map((item, i) => {',
  '        {navItems.map((item, i) => {'
);

// Add default categories to settings
content = content.replace(
  'const DEFAULT_SETTINGS = {\n  currency: "JPY",\n  theme: "light",\n  name: "Fin Track User",\n  locale: "en",\n  language: "English",\n};',
  `const DEFAULT_SETTINGS = {\n  currency: "JPY",\n  theme: "light",\n  name: "Fin Track User",\n  locale: "en",\n  language: "English",\n  incomeCategories: ["Salary", "Bonus", "Freelance", "Investment", "Rental", "Other Income"],\n  expenseCategories: ["Food", "Transport", "Shopping", "Bills", "Utilities", "Health", "Entertainment", "Travel", "Education", "Other"],\n};`
);

// Write the updated content
fs.writeFileSync('src/App.tsx', content);
console.log('Updated App.tsx with Goals screen!');
