import type { Category } from "@prisma/client";
import { CategoryRepository } from "../repositories/category.repository.js";
import type { CategoryPayload } from "../schemas/category.schema.js";
import { AppError } from "./errors.js";

export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async list(userId: string) {
    const categories = await this.categoryRepository.listByUser(userId);

    return categories.map(this.toCategoryDto);
  }

  async create(userId: string, payload: CategoryPayload) {
    await this.ensureUniqueName(payload.name, userId);

    const category = await this.categoryRepository.create(userId, payload);

    return this.toCategoryDto(category);
  }

  async update(userId: string, categoryId: string, payload: CategoryPayload) {
    const existingCategory = await this.categoryRepository.findByIdForUser(categoryId, userId);

    if (!existingCategory) {
      throw new AppError(404, "CATEGORY_NOT_FOUND", "La categoría solicitada no existe");
    }

    if (existingCategory.name.toLowerCase() !== payload.name.toLowerCase()) {
      await this.ensureUniqueName(payload.name, userId);
    }

    const category = await this.categoryRepository.update(categoryId, payload);

    return this.toCategoryDto(category);
  }

  async remove(userId: string, categoryId: string) {
    const existingCategory = await this.categoryRepository.findByIdForUser(categoryId, userId);

    if (!existingCategory) {
      throw new AppError(404, "CATEGORY_NOT_FOUND", "La categoría solicitada no existe");
    }

    const hasLinkedExpenses = await this.categoryRepository.hasLinkedExpenses(categoryId);

    if (hasLinkedExpenses) {
      throw new AppError(
        409,
        "CATEGORY_HAS_EXPENSES",
        "La categoría tiene gastos asociados y no puede eliminarse todavía"
      );
    }

    await this.categoryRepository.delete(categoryId);
  }

  private async ensureUniqueName(name: string, userId: string) {
    const category = await this.categoryRepository.findByNameForUser(name.trim(), userId);

    if (category) {
      throw new AppError(
        409,
        "CATEGORY_NAME_CONFLICT",
        "Ya existe una categoría con ese nombre para este usuario"
      );
    }
  }

  private toCategoryDto(category: Category) {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
