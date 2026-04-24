import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../services/errors.js";

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
      },
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Los datos enviados no son válidos",
        details: error.flatten(),
      },
    });
    return;
  }

  console.error(error);

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ocurrió un error interno en el servidor",
      details: null,
    },
  });
}
