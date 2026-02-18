export interface BudgetItem {
  id: string
  title: string
  amount: number
  category: string
  isEstimated: boolean
  date?: string | null
}

export interface CreateBudgetItemRequest {
  title: string
  category: string
  amount: number
  date: string | null
  isEstimated: boolean
}

export interface UpdateBudgetItemRequest {
  title: string | null
  category: string | null
  amount: number | null
  date: string | null
  isEstimated: boolean | null
}
