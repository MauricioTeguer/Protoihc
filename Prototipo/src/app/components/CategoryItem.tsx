import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  Receipt, 
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Edit2,
  Trash2
} from "lucide-react";
import type { Category } from "../data/mockData";

interface CategoryItemProps {
  category: Category;
  onEdit?: () => void;
  onDelete?: () => void;
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

export function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
  const Icon = iconMap[category.icon] || MoreHorizontal;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${category.color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color: category.color }} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium">{category.name}</p>
      </div>
      
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 hover:bg-destructive/10 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
