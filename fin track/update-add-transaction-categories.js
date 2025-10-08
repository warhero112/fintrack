const fs = require('fs');

// Read the current AddTransactionModal.tsx
let content = fs.readFileSync('src/components/modals/AddTransactionModal.tsx', 'utf8');

// Update the category selection to use settings categories
content = content.replace(
  '                <select\n                  className="flex-1 border rounded-xl px-3 py-2 bg-input-background"\n                  {...register(\'category\')}\n                >\n                  {categories.map(c => (\n                    <option key={c} value={c}>{c}</option>\n                  ))}\n                </select>',
  `                <select\n                  className="flex-1 border rounded-xl px-3 py-2 bg-input-background"\n                  {...register('category')}\n                >\n                  {watchedValues.type === 'income' \n                    ? (settings.incomeCategories || categories).map(c => (\n                        <option key={c} value={c}>{c}</option>\n                      ))\n                    : (settings.expenseCategories || categories).map(c => (\n                        <option key={c} value={c}>{c}</option>\n                      ))\n                  }\n                </select>`
);

// Add settings to the component props
content = content.replace(
  'export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {',
  'export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {'
);

// Update the useAppStore call to include settings
content = content.replace(
  '  const { accounts, categories, setShowBillScanner, setShowAICategorizer } = useAppStore()',
  '  const { accounts, categories, settings, setShowBillScanner, setShowAICategorizer } = useAppStore()'
);

// Write the updated content
fs.writeFileSync('src/components/modals/AddTransactionModal.tsx', content);
console.log('Updated AddTransactionModal with custom categories!');
