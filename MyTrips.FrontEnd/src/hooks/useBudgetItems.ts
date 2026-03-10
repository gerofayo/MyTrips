import { useEffect, useState } from "react"
import { budgetItemService } from "../services/budgetItemService"
import type { BudgetItem, CreateBudgetItemRequest } from "../types/BudgetItem"
import { logger } from "../utils/logger"

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
      logger.info("Budget items fetched", { tripId, count: data.length });
    } catch (err: any) {
      setError(err.message);
      logger.error("Failed to fetch budget items", err);
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
      logger.info("Budget item created", { tripId, itemId: newItem.id });
      return newItem;
    } catch (err: any) {
      setError(err.message);
      logger.error("Failed to create budget item", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = async (itemId: string, data: Omit<BudgetItem, "id">) => {
    setLoading(true);
    try {
      const response: BudgetItem = await budgetItemService.update(tripId, itemId, data);
      setItems(prev => prev.map(item => item.id === itemId ? response : item));
      logger.info("Budget item updated", { tripId, itemId });
    } catch (error) {
      logger.error("Failed to update budget item", error);
    } finally {
      setLoading(false);
    }
  };

  const updateItemTime = async (itemId: string, newDate: string | null) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response: BudgetItem = await budgetItemService.update(tripId, itemId, { 
        date: newDate,
        time: newDate === null ? null : undefined
      });
      setItems(prev => prev.map(item => item.id === itemId ? response : item));
      logger.info("Budget item time updated", { tripId, itemId, newDate });
      return response;
    } catch (err: any) {
      setError(err.message);
      logger.error("Failed to update budget item time", err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await budgetItemService.deleteItem(tripId, id);
      setItems(prev => prev.filter(item => item.id !== id));
      logger.info("Budget item deleted", { tripId, itemId: id });
    } catch (err: any) {
      setError(err.message);
      logger.error("Failed to delete budget item", err);
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
    updateItemTime,
    deleteItem,
    refetch: fetchItems
  }
}
