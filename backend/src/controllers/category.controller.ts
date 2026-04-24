import type { Request, Response, NextFunction } from "express";
import { categoryPayloadSchema } from "../schemas/category.schema.js";
import { AppError } from "../services/errors.js";
import type { CategoryService } from "../services/category.service.js";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  list = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.list(request.user.id);

      response.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parseResult = categoryPayloadSchema.safeParse(request.body);

      if (!parseResult.success) {
        throw new AppError(400, "VALIDATION_ERROR", "El payload de la categoría es inválido", parseResult.error.flatten());
      }

      const category = await this.categoryService.create(request.user.id, parseResult.data);

      response.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parseResult = categoryPayloadSchema.safeParse(request.body);

      if (!parseResult.success) {
        throw new AppError(400, "VALIDATION_ERROR", "El payload de la categoría es inválido", parseResult.error.flatten());
      }

      const category = await this.categoryService.update(request.user.id, request.params.id, parseResult.data);

      response.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction) => {
    try {
      await this.categoryService.remove(request.user.id, request.params.id);

      response.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
