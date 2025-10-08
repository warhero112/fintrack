const fs = require('fs');

// Read the current App.tsx
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add authentication state
const authState = `
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
`;

// Add after the existing state declarations
content = content.replace(
  '  const [categorizerData, setCategorizerData] = useState({ description: \'\', amount: 0 });',
  `  const [categorizerData, setCategorizerData] = useState({ description: '', amount: 0 });
  ${authState}`
);

// Add authentication handlers
const authHandlers = `
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };
`;

// Add after the existing handlers
content = content.replace(
  '  const handleBillScanComplete = (data) => {',
  `${authHandlers}

  const handleBillScanComplete = (data) => {`
);

// Update the Sidebar component call to include auth props
content = content.replace(
  '      <Sidebar\n        isOpen={sidebarOpen}\n        onClose={() => setSidebarOpen(false)}\n        settings={settings}\n        onSettingsChange={setSettings}\n      />',
  '      <Sidebar\n        isOpen={sidebarOpen}\n        onClose={() => setSidebarOpen(false)}\n        settings={settings}\n        onSettingsChange={setSettings}\n        isAuthenticated={isAuthenticated}\n        onLogin={handleLogin}\n        onLogout={handleLogout}\n      />'
);

// Write the updated content
fs.writeFileSync('src/App.tsx', content);
console.log('Updated App.tsx with authentication!');
