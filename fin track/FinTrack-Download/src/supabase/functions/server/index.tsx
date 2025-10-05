import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}));
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Initialize default data structure
async function initializeUserData() {
  const defaultCategories = [
    { id: '1', name: 'Groceries', color: '#22c55e', budgetAmount: 600 },
    { id: '2', name: 'Restaurants', color: '#ef4444', budgetAmount: 250 },
    { id: '3', name: 'Gas', color: '#3b82f6', budgetAmount: 180 },
    { id: '4', name: 'Entertainment', color: '#8b5cf6', budgetAmount: 150 },
    { id: '5', name: 'Shopping', color: '#f59e0b', budgetAmount: 200 },
    { id: '6', name: 'Bills', color: '#6b7280', budgetAmount: 0 },
  ];

  const defaultAccounts = [
    { id: '1', name: 'Checking', balance: 1032.72, type: 'checking' },
    { id: '2', name: 'Apple Card', balance: -1242.32, type: 'credit' },
    { id: '3', name: 'Savings', balance: 1107.30, type: 'savings' },
  ];

  const sampleExpenses = [
    {
      id: '1',
      description: 'Whole Foods',
      amount: 25.64,
      categoryId: '1',
      accountId: '1',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      pending: false
    },
    {
      id: '2',
      description: 'Shell Gas Station',
      amount: 45.30,
      categoryId: '3',
      accountId: '1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pending: true
    },
    {
      id: '3',
      description: 'Electric Bill',
      amount: 227.16,
      categoryId: '6',
      accountId: '1',
      date: new Date().toISOString(),
      pending: true
    },
    {
      id: '4',
      description: 'Rent Payment',
      amount: 1190.73,
      categoryId: '6',
      accountId: '1',
      date: new Date().toISOString(),
      pending: true
    }
  ];

  // Check if data already exists
  const existingCategories = await kv.get('categories');
  if (!existingCategories) {
    await kv.set('categories', defaultCategories);
    await kv.set('accounts', defaultAccounts);
    await kv.set('expenses', sampleExpenses);
  }
}

// Categories endpoints
app.get('/make-server-d3dd5c10/categories', async (c) => {
  try {
    const categories = await kv.get('categories') || [];
    return c.json(categories);
  } catch (error) {
    console.log('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

app.post('/make-server-d3dd5c10/categories', async (c) => {
  try {
    const newCategory = await c.req.json();
    const categories = await kv.get('categories') || [];
    const categoryWithId = {
      ...newCategory,
      id: Date.now().toString(),
    };
    categories.push(categoryWithId);
    await kv.set('categories', categories);
    return c.json(categoryWithId);
  } catch (error) {
    console.log('Error creating category:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Accounts endpoints
app.get('/make-server-d3dd5c10/accounts', async (c) => {
  try {
    const accounts = await kv.get('accounts') || [];
    return c.json(accounts);
  } catch (error) {
    console.log('Error fetching accounts:', error);
    return c.json({ error: 'Failed to fetch accounts' }, 500);
  }
});

app.put('/make-server-d3dd5c10/accounts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updatedAccount = await c.req.json();
    const accounts = await kv.get('accounts') || [];
    const index = accounts.findIndex((account: any) => account.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updatedAccount };
      await kv.set('accounts', accounts);
      return c.json(accounts[index]);
    }
    return c.json({ error: 'Account not found' }, 404);
  } catch (error) {
    console.log('Error updating account:', error);
    return c.json({ error: 'Failed to update account' }, 500);
  }
});

// Expenses endpoints
app.get('/make-server-d3dd5c10/expenses', async (c) => {
  try {
    const expenses = await kv.get('expenses') || [];
    return c.json(expenses);
  } catch (error) {
    console.log('Error fetching expenses:', error);
    return c.json({ error: 'Failed to fetch expenses' }, 500);
  }
});

app.post('/make-server-d3dd5c10/expenses', async (c) => {
  try {
    const newExpense = await c.req.json();
    const expenses = await kv.get('expenses') || [];
    const expenseWithId = {
      ...newExpense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    expenses.push(expenseWithId);
    await kv.set('expenses', expenses);

    // Update account balance
    const accounts = await kv.get('accounts') || [];
    const accountIndex = accounts.findIndex((account: any) => account.id === newExpense.accountId);
    if (accountIndex !== -1) {
      const account = accounts[accountIndex];
      if (account.type === 'credit') {
        account.balance -= newExpense.amount; // Credit cards decrease balance
      } else {
        account.balance -= newExpense.amount; // Checking/savings decrease balance
      }
      await kv.set('accounts', accounts);
    }

    return c.json(expenseWithId);
  } catch (error) {
    console.log('Error creating expense:', error);
    return c.json({ error: 'Failed to create expense' }, 500);
  }
});

app.delete('/make-server-d3dd5c10/expenses/:id', async (c) => {
  try {
    const id = c.req.param('id');
    console.log('Attempting to delete expense with ID:', id);
    
    const expenses = await kv.get('expenses') || [];
    console.log('Current expenses count:', expenses.length);
    
    const expenseIndex = expenses.findIndex((expense: any) => expense.id === id);
    console.log('Found expense at index:', expenseIndex);
    
    if (expenseIndex !== -1) {
      const expense = expenses[expenseIndex];
      console.log('Deleting expense:', expense);
      
      expenses.splice(expenseIndex, 1);
      await kv.set('expenses', expenses);
      console.log('Expense removed from expenses array');

      // Reverse the account balance change
      const accounts = await kv.get('accounts') || [];
      const accountIndex = accounts.findIndex((account: any) => account.id === expense.accountId);
      if (accountIndex !== -1) {
        const account = accounts[accountIndex];
        console.log('Reversing balance for account:', account.name, 'Current balance:', account.balance);
        
        if (account.type === 'credit') {
          account.balance += expense.amount;
        } else {
          account.balance += expense.amount;
        }
        
        console.log('New account balance:', account.balance);
        await kv.set('accounts', accounts);
        console.log('Account balance updated successfully');
      } else {
        console.log('Account not found for expense, accountId:', expense.accountId);
      }

      console.log('Expense deletion completed successfully');
      return c.json({ success: true, message: 'Expense deleted successfully' });
    }
    
    console.log('Expense not found with ID:', id);
    return c.json({ error: `Expense not found with ID: ${id}` }, 404);
  } catch (error) {
    console.log('Error deleting expense - detailed error:', error);
    return c.json({ 
      error: 'Failed to delete expense', 
      details: error.message || 'Unknown error',
      expenseId: c.req.param('id')
    }, 500);
  }
});

// Budget analytics endpoint
app.get('/make-server-d3dd5c10/budget-analysis', async (c) => {
  try {
    const categories = await kv.get('categories') || [];
    const expenses = await kv.get('expenses') || [];
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear &&
             !expense.pending;
    });

    const budgetAnalysis = categories.map((category: any) => {
      const categoryExpenses = monthlyExpenses.filter((expense: any) => 
        expense.categoryId === category.id
      );
      const spent = categoryExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
      const remaining = Math.max(0, category.budgetAmount - spent);
      const percentage = category.budgetAmount > 0 ? (spent / category.budgetAmount) * 100 : 0;

      return {
        ...category,
        spent,
        remaining,
        percentage: Math.min(100, percentage),
        expenses: categoryExpenses
      };
    });

    return c.json(budgetAnalysis);
  } catch (error) {
    console.log('Error generating budget analysis:', error);
    return c.json({ error: 'Failed to generate budget analysis' }, 500);
  }
});

// Initialize data on startup
initializeUserData().catch(console.error);

Deno.serve(app.fetch);