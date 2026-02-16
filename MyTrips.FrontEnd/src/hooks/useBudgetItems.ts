import { useEffect, useState } from "react"
import { budgetItemService } from "../services/budgetItemService"
import type { BudgetItem, CreateBudgetItemRequest, UpdateBudgetItemRequest } from "../types/BudgetItem"

export function useBudgetItems(tripId: string) {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await budgetItemService.getAll(tripId);
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const createItem = async (data: CreateBudgetItemRequest) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const newItem = await budgetItemService.create(tripId, data);
      setItems(prev => [...prev, newItem]);
      return newItem; 
    } catch (err: any) {
      setError(err.message);
      throw err; 
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = async (id: string, data: UpdateBudgetItemRequest) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await budgetItemService.update(tripId, id, data);
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, ...data } : item
      ));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await budgetItemService.delete(tripId, id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (tripId) fetchItems()
  }, [tripId])

  return {
    items,
    loading,
    error,
    isSubmitting,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems
  }
}
