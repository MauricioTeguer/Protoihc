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
import { Link } from "react-router-dom";
import type { Expense } from "../data/mockData";
import { categories } from "../data/mockData";

interface ExpenseCardProps {
  expense: Expense;
}

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

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const category = categories.find(c => c.name === expense.category);
  const Icon = category ? iconMap[category.icon] : MoreHorizontal;
  const date = new Date(expense.date);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      to={`/expense/${expense.id}`}
      className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${category?.color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color: category?.color }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{expense.category}</p>
        {expense.note && (
          <p className="text-sm text-muted-foreground truncate">{expense.note}</p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">{formattedDate}</p>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-lg">-${expense.amount.toFixed(2)}</p>
      </div>
    </Link>
  );
}
