import { API_URL } from "../constants/config";
import type {
  ErrorResponse,
  Expense,
  ExpenseFilters,
  ExpensePayload,
  SuccessResponse,
} from "../features/expenses/types";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as SuccessResponse<T> | ErrorResponse;

  if (!response.ok || !("success" in payload) || payload.success === false) {
    const message = "error" in payload ? payload.error.message : "Ocurrió un error inesperado";
    throw new Error(message);
  }

  return payload.data;
}

function toQueryString(filters?: ExpenseFilters) {
  const params = new URLSearchParams();

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function listExpenses(filters?: ExpenseFilters) {
  const response = await fetch(`${API_URL}/expenses${toQueryString(filters)}`);
  return parseResponse<Expense[]>(response);
}

export async function getExpense(id: string) {
  const response = await fetch(`${API_URL}/expenses/${id}`);
  return parseResponse<Expense>(response);
}

export async function createExpense(payload: ExpensePayload) {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Expense>(response);
}

export async function updateExpense(id: string, payload: ExpensePayload) {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<Expense>(response);
}

export async function deleteExpense(id: string) {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
  });

  return parseResponse<null>(response);
}
