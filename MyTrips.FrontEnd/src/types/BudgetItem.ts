export interface BudgetItem {
  id: string
  title: string
  amount: number
  category: string
  isEstimated: boolean
  date?: string | null
  description?: string | null
}

export interface CreateBudgetItemRequest {
  title: string
  category: string
  amount: number
  date: string | null
  isEstimated: boolean
  description?: string | null
}
