import { API_URL } from "../constants/config";
import type { Category, CategoryPayload, ErrorResponse, SuccessResponse } from "../features/categories/types";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as SuccessResponse<T> | ErrorResponse;

  if (!response.ok || !("success" in payload) || payload.success === false) {
    const message = "error" in payload ? payload.error.message : "Ocurrió un error inesperado";
    throw new Error(message);
  }

  return payload.data;
}

export async function listCategories() {
  const response = await fetch(`${API_URL}/categories`);
  return parseResponse<Category[]>(response);
}

export async function createCategory(payload: CategoryPayload) {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Category>(response);
}

export async function updateCategory(id: string, payload: CategoryPayload) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Category>(response);
}

export async function deleteCategory(id: string) {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
  });

  return parseResponse<null>(response);
}
