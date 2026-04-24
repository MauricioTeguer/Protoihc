import type { PrismaClient } from "@prisma/client";
import type { CategoryPayload } from "../schemas/category.schema.js";

export class CategoryRepository {
  constructor(private readonly db: PrismaClient) {}

  async listByUser(userId: string) {
    return this.db.category.findMany({
      where: { userId },
      orderBy: [{ name: "asc" }, { createdAt: "asc" }],
    });
  }

  async findByIdForUser(id: string, userId: string) {
    return this.db.category.findFirst({
      where: { id, userId },
    });
  }

  async findByNameForUser(name: string, userId: string) {
    const categories = await this.db.category.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        icon: true,
        color: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return categories.find((category) => category.name.trim().toLowerCase() === name.trim().toLowerCase()) ?? null;
  }

  async create(userId: string, payload: CategoryPayload) {
    return this.db.category.create({
      data: {
        ...payload,
        userId,
      },
    });
  }

  async update(id: string, payload: CategoryPayload) {
    return this.db.category.update({
      where: { id },
      data: payload,
    });
  }

  async delete(id: string) {
    return this.db.category.delete({
      where: { id },
    });
  }

  async hasLinkedExpenses(_id: string) {
    // Future-proofing for the Expense module business rule.
    return false;
  }
}
