import { useState, useEffect } from "react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  Receipt,
  HeartPulse,
  GraduationCap,
  MoreHorizontal,
  Coffee,
  Home as HomeIcon,
  Plane,
  Dumbbell
} from "lucide-react";
import { Modal } from "./Modal";
import type { Category } from "../data/mockData";

const availableIcons = [
  { name: "utensils", Icon: Utensils },
  { name: "car", Icon: Car },
  { name: "shopping-bag", Icon: ShoppingBag },
  { name: "film", Icon: Film },
  { name: "receipt", Icon: Receipt },
  { name: "heart-pulse", Icon: HeartPulse },
  { name: "graduation-cap", Icon: GraduationCap },
  { name: "coffee", Icon: Coffee },
  { name: "home", Icon: HomeIcon },
  { name: "plane", Icon: Plane },
  { name: "dumbbell", Icon: Dumbbell },
  { name: "more-horizontal", Icon: MoreHorizontal },
];

const availableColors = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#06b6d4",
  "#6b7280",
];

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

export function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("utensils");
  const [selectedColor, setSelectedColor] = useState("#10b981");

  // Pre-populate form when category changes
  useEffect(() => {
    if (category) {
      setName(category.name);
      setSelectedIcon(category.icon);
      setSelectedColor(category.color);
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - just close modal
    console.log("Saving category:", { name, icon: selectedIcon, color: selectedColor });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Category">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm text-foreground">
            Category Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter category name"
            className="w-full bg-input-background border border-border rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-foreground">
            Icon
          </label>
          <div className="grid grid-cols-6 gap-3">
            {availableIcons.map(({ name, Icon }) => (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedIcon(name)}
                className={`aspect-square rounded-xl flex items-center justify-center border-2 transition-colors ${
                  selectedIcon === name
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-foreground">
            Color
          </label>
          <div className="grid grid-cols-8 gap-3">
            {availableColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`aspect-square rounded-xl border-2 transition-all ${
                  selectedColor === color
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium active:scale-[0.98] transition-transform mt-8"
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
}
