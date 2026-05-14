import { Plus } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { CategoryItem } from "../components/CategoryItem";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { CreateCategoryModal } from "../components/CreateCategoryModal";
import { EditCategoryModal } from "../components/EditCategoryModal";
import { Header } from "../components/Header";
import { categories } from "../data/mockData";
import type { Category } from "../data/mockData";

export function Categories() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const handleEdit = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCategoryToEdit(category);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteClick = (id: string) => {
    setCategoryToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      console.log("Delete category", categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="h-full bg-background flex flex-col relative overflow-hidden">
      <Header title="Categories" />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto p-6 space-y-3 pb-24">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={() => handleEdit(category.id)}
              onDelete={() => handleDeleteClick(category.id)}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="absolute bottom-24 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCategoryToEdit(null);
        }}
        category={categoryToEdit}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Category?"
        message="Are you sure you want to delete this category? All expenses in this category will be affected."
        confirmText="Delete"
        cancelText="Keep"
        variant="danger"
      />

      <BottomNav />
    </div>
  );
}