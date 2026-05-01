import type { NextFunction, Request, Response } from "express";
import { expensePayloadSchema, expenseQuerySchema } from "../schemas/expense.schema.js";
import { AppError } from "../services/errors.js";
import type { ExpenseService } from "../services/expense.service.js";

function getRouteParam(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  list = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parseResult = expenseQuerySchema.safeParse(request.query);

      if (!parseResult.success) {
        throw new AppError(400, "VALIDATION_ERROR", "Los filtros de gastos son inválidos", parseResult.error.flatten());
      }

      const expenses = await this.expenseService.list(request.user.id, parseResult.data);

      response.status(200).json({
        success: true,
        data: expenses,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const expense = await this.expenseService.getById(request.user.id, getRouteParam(request.params.id));

      response.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parseResult = expensePayloadSchema.safeParse(request.body);

      if (!parseResult.success) {
        throw new AppError(400, "VALIDATION_ERROR", "El payload del gasto es inválido", parseResult.error.flatten());
      }

      const expense = await this.expenseService.create(request.user.id, parseResult.data);

      response.status(201).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const parseResult = expensePayloadSchema.safeParse(request.body);

      if (!parseResult.success) {
        throw new AppError(400, "VALIDATION_ERROR", "El payload del gasto es inválido", parseResult.error.flatten());
      }

      const expense = await this.expenseService.update(request.user.id, getRouteParam(request.params.id), parseResult.data);

      response.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      next(error);
    }
  };

  remove = async (request: Request, response: Response, next: NextFunction) => {
    try {
      await this.expenseService.remove(request.user.id, getRouteParam(request.params.id));

      response.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
