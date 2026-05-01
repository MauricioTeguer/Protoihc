import type { Expense, Category } from "@prisma/client";
import type { CategoryRepository } from "../repositories/category.repository.js";
import type { ExpenseFilters, ExpenseRepository } from "../repositories/expense.repository.js";
import type { ExpensePayload, ExpenseQuery } from "../schemas/expense.schema.js";
import { AppError } from "./errors.js";

type ExpenseWithCategory = Expense & { category: Category };

export class ExpenseService {
  constructor(
    private readonly expenseRepository: ExpenseRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async list(userId: string, query: ExpenseQuery) {
    const filters = this.toFilters(query);
    await this.ensureCategoryBelongsToUser(userId, query.categoryId);

    const expenses = await this.expenseRepository.listByUser(userId, filters);

    return expenses.map(this.toExpenseDto);
  }

  async getById(userId: string, expenseId: string) {
    const expense = await this.expenseRepository.findByIdForUser(expenseId, userId);

    if (!expense) {
      throw new AppError(404, "EXPENSE_NOT_FOUND", "El gasto solicitado no existe");
    }

    return this.toExpenseDto(expense);
  }

  async create(userId: string, payload: ExpensePayload) {
    await this.ensureCategoryBelongsToUser(userId, payload.categoryId);
    const date = this.parseRequiredDate(payload.date);

    const expense = await this.expenseRepository.create(userId, payload, date);

    return this.toExpenseDto(expense);
  }

  async update(userId: string, expenseId: string, payload: ExpensePayload) {
    const existingExpense = await this.expenseRepository.findByIdForUser(expenseId, userId);

    if (!existingExpense) {
      throw new AppError(404, "EXPENSE_NOT_FOUND", "El gasto solicitado no existe");
    }

    await this.ensureCategoryBelongsToUser(userId, payload.categoryId);
    const date = this.parseRequiredDate(payload.date);
    const expense = await this.expenseRepository.update(expenseId, payload, date);

    return this.toExpenseDto(expense);
  }

  async remove(userId: string, expenseId: string) {
    const existingExpense = await this.expenseRepository.findByIdForUser(expenseId, userId);

    if (!existingExpense) {
      throw new AppError(404, "EXPENSE_NOT_FOUND", "El gasto solicitado no existe");
    }

    await this.expenseRepository.delete(expenseId);
  }

  private toFilters(query: ExpenseQuery): ExpenseFilters {
    const { startDate, endDate } = this.getDateRange(query);

    return {
      startDate,
      endDate,
      categoryId: query.categoryId,
    };
  }

  private getDateRange(query: ExpenseQuery) {
    if (query.month && (query.startDate || query.endDate)) {
      throw new AppError(
        400,
        "INVALID_EXPENSE_FILTERS",
        "El filtro por mes no se puede combinar con un rango de fechas"
      );
    }

    if (query.month) {
      const [year, month] = query.month.split("-").map(Number);
      const startDate = new Date(Date.UTC(year, month - 1, 1));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

      return { startDate, endDate };
    }

    const startDate = query.startDate ? this.parseDate(query.startDate, "start") : undefined;
    const endDate = query.endDate ? this.parseDate(query.endDate, "end") : undefined;

    if (startDate && endDate && startDate > endDate) {
      throw new AppError(
        400,
        "INVALID_EXPENSE_FILTERS",
        "La fecha de inicio debe ser anterior o igual a la fecha de fin"
      );
    }

    return { startDate, endDate };
  }

  private parseRequiredDate(value: string) {
    const date = this.parseDate(value, "start");

    if (date > this.endOfToday()) {
      throw new AppError(400, "EXPENSE_DATE_IN_FUTURE", "La fecha del gasto no puede ser futura");
    }

    return date;
  }

  private parseDate(value: string, boundary: "start" | "end") {
    const [year, month, day] = value.split("-").map(Number);
    const date =
      boundary === "start"
        ? new Date(Date.UTC(year, month - 1, day))
        : new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    if (Number.isNaN(date.getTime())) {
      throw new AppError(400, "INVALID_DATE", "La fecha enviada no es válida");
    }

    return date;
  }

  private endOfToday() {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
  }

  private async ensureCategoryBelongsToUser(userId: string, categoryId?: string) {
    if (!categoryId) {
      return;
    }

    const category = await this.categoryRepository.findByIdForUser(categoryId, userId);

    if (!category) {
      throw new AppError(400, "EXPENSE_CATEGORY_NOT_FOUND", "La categoría seleccionada no existe");
    }
  }

  private toExpenseDto(expense: ExpenseWithCategory) {
    return {
      id: expense.id,
      amount: Number(expense.amount),
      date: expense.date.toISOString().slice(0, 10),
      note: expense.note,
      category: {
        id: expense.category.id,
        name: expense.category.name,
        icon: expense.category.icon,
        color: expense.category.color,
      },
      createdAt: expense.createdAt.toISOString(),
      updatedAt: expense.updatedAt.toISOString(),
    };
  }
}
