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
      console.log("Creating item with data:", data);
      const newItem = await budgetItemService.create(tripId, data);
      console.log("Created item:", newItem);
      setItems(prev => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateItem = async (itemId: string, data: Omit<BudgetItem, "id">) => {
    setLoading(true);
    try {
      // tripId viene del scope del hook (useParams)
      const response: BudgetItem = await budgetItemService.update(tripId, itemId, data);

      // Actualizamos el estado local reemplazando el item viejo por el nuevo
      setItems(prev => prev.map(item => item.id === itemId ? response : item));

    } catch (error) {
      console.error("Error updating budget item:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await budgetItemService.deleteItem(tripId, id);
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
