import { apiClient } from "../api/apiClient";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";


export function getAllBudgetItems(tripId: string) {
  return apiClient.get<BudgetItem[]>(`/trips/${tripId}/budget-items`);
}

export function createBudgetItem(tripId: string, data: CreateBudgetItemRequest) {
  return apiClient.post<BudgetItem>(`/trips/${tripId}/budget-items`, data);
}

export function updateBudgetItem(tripId: string, id: string, data: Partial<CreateBudgetItemRequest>) {
  return apiClient.put<BudgetItem>(`/trips/${tripId}/budget-items/${id}`, data);
}

export function deleteBudgetItem(tripId: string, id: string) {
  return apiClient.delete(`/trips/${tripId}/budget-items/${id}`);
}

export const getBudgetItemCategories = () => apiClient.get<string[]>("/budget-items/categories");

export const budgetItemService = {
  getAll: getAllBudgetItems,
  create: createBudgetItem,
    update: updateBudgetItem,
    deleteItem: deleteBudgetItem,
    getCategories: getBudgetItemCategories,
};