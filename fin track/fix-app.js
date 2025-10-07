const fs = require('fs');

// Read the original App.tsx
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add Sidebar import
content = content.replace(
  "import { SmartCategorizer } from './components/ai/SmartCategorizer'",
  "import { SmartCategorizer } from './components/ai/SmartCategorizer'\nimport { Sidebar } from './components/Sidebar'"
);

// Add Sidebar component before the closing div
content = content.replace(
  '      {showBillScanner && (\n        <BillScanner\n          onScanComplete={handleBillScanComplete}\n          onClose={() => setShowBillScanner(false)}\n        />\n      )}\n    </div>\n  );\n}',
  '      <Sidebar\n        isOpen={sidebarOpen}\n        onClose={() => setSidebarOpen(false)}\n        settings={settings}\n        onSettingsChange={setSettings}\n      />\n      \n      {showBillScanner && (\n        <BillScanner\n          onScanComplete={handleBillScanComplete}\n          onClose={() => setShowBillScanner(false)}\n        />\n      )}\n    </div>\n  );\n}'
);

// Write the fixed content
fs.writeFileSync('src/App.tsx', content);
console.log('Fixed App.tsx successfully!');
