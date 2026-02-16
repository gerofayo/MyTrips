import { apiClient } from "../api/apiClient";
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem";

export const budgetItemService = {
    getAll: (tripId: string) =>
        apiClient.get<BudgetItem[]>(`/trips/${tripId}/budget-items`),

    create: (tripId: string, data: CreateBudgetItemRequest) =>
        apiClient.post<BudgetItem>(`/trips/${tripId}/budget-items`, data),

    update: (tripId: string, id: string, data: Partial<CreateBudgetItemRequest>) =>
        apiClient.put(`/trips/${tripId}/budget-items/${id}`, data),

    delete: (tripId: string, id: string) =>
        apiClient.delete(`/trips/${tripId}/budget-items/${id}`),
};