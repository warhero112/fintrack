import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  label: z.string().min(1, 'Description is required').max(100, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  type: z.enum(['income', 'expense']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  accountId: z.string().min(1, 'Account is required'),
})

export const accountSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Account name is required').max(50, 'Name too long'),
  balance: z.number(),
  currency: z.string().length(3, 'Currency must be 3 characters'),
  type: z.enum(['checking', 'savings', 'credit', 'investment']),
})

export const budgetSchema = z.object({
  id: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  limit: z.number().positive('Limit must be positive'),
  spent: z.number().min(0, 'Spent cannot be negative'),
  period: z.enum(['weekly', 'monthly', 'yearly']),
})

export const settingsSchema = z.object({
  currency: z.string().length(3, 'Currency must be 3 characters'),
  theme: z.enum(['light', 'dark', 'system']),
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  locale: z.string().min(2, 'Locale is required'),
  language: z.string().min(2, 'Language is required'),
  notifications: z.boolean(),
  autoSync: z.boolean(),
})

export const scannedDataSchema = z.object({
  amount: z.number().positive().optional(),
  merchant: z.string().optional(),
  date: z.string().optional(),
  category: z.string().optional(),
  confidence: z.number().min(0).max(1),
  rawText: z.string(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
export type AccountFormData = z.infer<typeof accountSchema>
export type BudgetFormData = z.infer<typeof budgetSchema>
export type SettingsFormData = z.infer<typeof settingsSchema>
export type ScannedDataFormData = z.infer<typeof scannedDataSchema>
