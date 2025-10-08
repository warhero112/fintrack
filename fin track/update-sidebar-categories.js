const fs = require('fs');

// Read the current Sidebar.tsx
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Add category management section after the preferences section
const categoryManagement = `
          {/* Category Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings size={16} />
              Custom Categories
            </h3>
            
            {/* Income Categories */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Income Categories</label>
              <div className="space-y-2">
                {settings.incomeCategories?.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        const newCategories = [...settings.incomeCategories]
                        newCategories[index] = e.target.value
                        onSettingsChange({ ...settings, incomeCategories: newCategories })
                      }}
                      className="flex-1 border rounded-lg px-3 py-2 bg-input-background text-sm"
                    />
                    <button
                      onClick={() => {
                        const newCategories = settings.incomeCategories.filter((_, i) => i !== index)
                        onSettingsChange({ ...settings, incomeCategories: newCategories })
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  </div>
                )) || []}
                <button
                  onClick={() => {
                    const newCategories = [...(settings.incomeCategories || []), '']
                    onSettingsChange({ ...settings, incomeCategories: newCategories })
                  }}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary"
                >
                  + Add Income Category
                </button>
              </div>
            </div>

            {/* Expense Categories */}
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Expense Categories</label>
              <div className="space-y-2">
                {settings.expenseCategories?.map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => {
                        const newCategories = [...settings.expenseCategories]
                        newCategories[index] = e.target.value
                        onSettingsChange({ ...settings, expenseCategories: newCategories })
                      }}
                      className="flex-1 border rounded-lg px-3 py-2 bg-input-background text-sm"
                    />
                    <button
                      onClick={() => {
                        const newCategories = settings.expenseCategories.filter((_, i) => i !== index)
                        onSettingsChange({ ...settings, expenseCategories: newCategories })
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      ×
                    </button>
                  </div>
                )) || []}
                <button
                  onClick={() => {
                    const newCategories = [...(settings.expenseCategories || []), '']
                    onSettingsChange({ ...settings, expenseCategories: newCategories })
                  }}
                  className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-2 text-sm text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary"
                >
                  + Add Expense Category
                </button>
              </div>
            </div>
          </div>
`;

// Add the category management section before the closing div
content = content.replace(
  '          </div>\n        </div>\n      </div>\n    </div>\n  )\n}',
  `${categoryManagement}\n          </div>\n        </div>\n      </div>\n    </div>\n  )\n}`
);

// Write the updated content
fs.writeFileSync('src/components/Sidebar.tsx', content);
console.log('Updated Sidebar with category management!');
