import { describe, expect, it, vi } from "vitest";
import { ExpenseService } from "./expense.service.js";

const now = new Date("2026-04-23T00:00:00.000Z");

function createExpenseRepositoryMock() {
  return {
    listByUser: vi.fn(),
    findByIdForUser: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };
}

function createCategoryRepositoryMock() {
  return {
    findByIdForUser: vi.fn(),
  };
}

describe("ExpenseService", () => {
  it("creates an expense when payload and category are valid", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();

    categoryRepository.findByIdForUser.mockResolvedValue({
      id: "cat-1",
      name: "Food",
      icon: "utensils",
      color: "#10B981",
    });
    expenseRepository.create.mockResolvedValue({
      id: "exp-1",
      amount: 125.5,
      date: new Date("2026-04-22T00:00:00.000Z"),
      note: "Lunch",
      categoryId: "cat-1",
      userId: "user-1",
      createdAt: now,
      updatedAt: now,
      category: {
        id: "cat-1",
        name: "Food",
        icon: "utensils",
        color: "#10B981",
      },
    });

    const service = new ExpenseService(expenseRepository as never, categoryRepository as never);

    const expense = await service.create("user-1", {
      amount: 125.5,
      categoryId: "cat-1",
      date: "2026-04-22",
      note: "Lunch",
    });

    expect(expense.amount).toBe(125.5);
    expect(expense.category.name).toBe("Food");
    expect(expenseRepository.create).toHaveBeenCalledTimes(1);
  });

  it("rejects expenses for categories outside the user scope", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    categoryRepository.findByIdForUser.mockResolvedValue(null);

    const service = new ExpenseService(expenseRepository as never, categoryRepository as never);

    await expect(
      service.create("user-1", {
        amount: 20,
        categoryId: "cat-missing",
        date: "2026-04-22",
        note: "Lunch",
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "EXPENSE_CATEGORY_NOT_FOUND",
    });
  });

  it("rejects invalid date ranges", async () => {
    const expenseRepository = createExpenseRepositoryMock();
    const categoryRepository = createCategoryRepositoryMock();
    const service = new ExpenseService(expenseRepository as never, categoryRepository as never);

    await expect(
      service.list("user-1", {
        startDate: "2026-04-23",
        endDate: "2026-04-22",
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      code: "INVALID_EXPENSE_FILTERS",
    });
  });
});
