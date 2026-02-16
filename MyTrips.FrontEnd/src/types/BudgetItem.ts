export const ExpenseCategory = {
  Accommodation: 0,
  Transport: 1,
  Food: 2,
  Activities: 3,
  Other: 4
} as const;

export type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];

export interface BudgetItem {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  isEstimated: boolean
  date: string
}

export interface CreateBudgetItemRequest {
  title: string
  amount: number
  category: ExpenseCategory
  isEstimated: boolean
  date: string
}

export interface UpdateBudgetItemRequest {
  title?: string
  amount?: number
  category?: ExpenseCategory
  isEstimated?: boolean
  date?: string
}
