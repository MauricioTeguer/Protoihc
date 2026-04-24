import type { CategoryIconKey } from "../../constants/category-options";

export interface Category {
  id: string;
  name: string;
  icon: CategoryIconKey;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  icon: CategoryIconKey;
  color: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details: unknown;
  };
}
