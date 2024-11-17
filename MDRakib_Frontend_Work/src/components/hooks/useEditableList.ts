import { useState } from 'react';

/**
 * Hook for managing edit and delete actions in a list.
 * @param initialItems - The initial list of items
 */
export function useEditableList<T>(initialItems: T[], uniqueKey: keyof T) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // Start editing an item
  const handleEdit = (item: T) => {
    setEditingItem(item);
  };

  // Save the edited item
  const handleSave = (updatedItem: T) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item[uniqueKey] === updatedItem[uniqueKey] ? updatedItem : item))
    );
    setEditingItem(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Delete an item
  const handleDelete = (keyValue: T[keyof T]) => {
    setItems((prevItems) => prevItems.filter((item) => item[uniqueKey] !== keyValue));
  };

  return {
    items,
    editingItem,
    handleEdit,
    handleSave,
    handleCancelEdit,
    handleDelete,
  };
}
