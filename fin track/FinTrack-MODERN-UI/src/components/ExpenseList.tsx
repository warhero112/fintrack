import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Clock } from 'lucide-react';

interface ExpenseListProps {
  expenses: any[];
  categories: any[];
  accounts: any[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, categories, accounts, onDelete }: ExpenseListProps) {
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);
  const getAccountById = (id: string) => accounts.find(acc => acc.id === id);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedExpenses.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses yet</p>
          ) : (
            sortedExpenses.map((expense) => {
              const category = getCategoryById(expense.categoryId);
              const account = getAccountById(expense.accountId);
              const date = new Date(expense.date);
              
              return (
                <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category?.color || '#6b7280' }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{expense.description}</span>
                        {expense.pending && (
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {category?.name} • {account?.name} • {date.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${expense.amount.toFixed(2)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}