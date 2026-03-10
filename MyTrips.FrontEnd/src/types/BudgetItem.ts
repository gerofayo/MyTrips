export interface BudgetItem {
  id: string
  title: string
  amount: number
  category: string
  isEstimated: boolean
  date?: string | null  // YYYY-MM-DD format - just the day
  time?: string | null // HH:MM format - just the time
  description?: string | null
}

export interface CreateBudgetItemRequest {
  title: string
  category: string
  amount: number
  date: string | null
  time: string | null
  isEstimated: boolean
  description?: string | null
}
