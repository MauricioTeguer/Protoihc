import type { Prisma, PrismaClient } from "@prisma/client";
import type { ExpensePayload } from "../schemas/expense.schema.js";

export interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
}

export class ExpenseRepository {
  constructor(private readonly db: PrismaClient) {}

  async listByUser(userId: string, filters: ExpenseFilters) {
    const where: Prisma.ExpenseWhereInput = {
      userId,
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.startDate || filters.endDate
        ? {
            date: {
              ...(filters.startDate ? { gte: filters.startDate } : {}),
              ...(filters.endDate ? { lte: filters.endDate } : {}),
            },
          }
        : {}),
    };

    return this.db.expense.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
  }

  async findByIdForUser(id: string, userId: string) {
    return this.db.expense.findFirst({
      where: { id, userId },
      include: { category: true },
    });
  }

  async create(userId: string, payload: ExpensePayload, date: Date) {
    return this.db.expense.create({
      data: {
        amount: payload.amount,
        date,
        note: payload.note,
        categoryId: payload.categoryId,
        userId,
      },
      include: { category: true },
    });
  }

  async update(id: string, payload: ExpensePayload, date: Date) {
    return this.db.expense.update({
      where: { id },
      data: {
        amount: payload.amount,
        date,
        note: payload.note,
        categoryId: payload.categoryId,
      },
      include: { category: true },
    });
  }

  async delete(id: string) {
    return this.db.expense.delete({
      where: { id },
    });
  }
}
