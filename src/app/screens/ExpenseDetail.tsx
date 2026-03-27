import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { expenses, categories } from "../data/mockData";
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  GraduationCap,
  MoreHorizontal
} from "lucide-react";

const iconMap: Record<string, any> = {
  "utensils": Utensils,
  "car": Car,
  "shopping-bag": ShoppingBag,
  "film": Film,
  "receipt": Receipt,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  "more-horizontal": MoreHorizontal,
};

export function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const expense = expenses.find((e) => e.id === id);

  if (!expense) {
    return (
      <div className="min-h-full bg-background">
        <Header title="Expense Not Found" showBack />
      </div>
    );
  }

  const category = categories.find(c => c.name === expense.category);
  const Icon = category ? iconMap[category.icon] : MoreHorizontal;
  const date = new Date(expense.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDelete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-full bg-background">
      <Header title="Expense Details" showBack />

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Amount Display */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-8 text-center">
          <p className="text-sm opacity-90 mb-2">Amount</p>
          <h1 className="text-5xl font-bold">${expense.amount.toFixed(2)}</h1>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Category</p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${category?.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: category?.color }} />
              </div>
              <p className="font-medium">{expense.category}</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Date</p>
            <p className="font-medium">{formattedDate}</p>
          </div>

          {expense.note && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm text-muted-foreground mb-2">Note</p>
              <p className="font-medium">{expense.note}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => navigate(`/edit-expense/${id}`)}
            className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Edit2 className="w-5 h-5" />
            Edit
          </button>
          
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1 bg-destructive text-destructive-foreground py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Trash2 className="w-5 h-5" />
            Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Expense?"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        cancelText="Keep"
        variant="danger"
      />
    </div>
  );
}
