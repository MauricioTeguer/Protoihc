import type { CategoryIconKey } from "../../constants/category-options";
import type { ErrorResponse, SuccessResponse } from "../categories/types";

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: CategoryIconKey;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  date: string;
  note: string | null;
  category: ExpenseCategory;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePayload {
  amount: number;
  categoryId: string;
  date: string;
  note: string;
}

export interface ExpenseFilters {
  month?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export type { ErrorResponse, SuccessResponse };
