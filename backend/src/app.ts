import cors from "cors";
import express from "express";
import { prisma } from "./config/prisma.js";
import { CategoryController } from "./controllers/category.controller.js";
import { ExpenseController } from "./controllers/expense.controller.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { createUserContextMiddleware } from "./middleware/user-context.middleware.js";
import { CategoryRepository } from "./repositories/category.repository.js";
import { ExpenseRepository } from "./repositories/expense.repository.js";
import { UserRepository } from "./repositories/user.repository.js";
import { createCategoryRouter } from "./routes/category.routes.js";
import { createExpenseRouter } from "./routes/expense.routes.js";
import { CategoryService } from "./services/category.service.js";
import { ExpenseService } from "./services/expense.service.js";

const categoryRepository = new CategoryRepository(prisma);
const expenseRepository = new ExpenseRepository(prisma);
const userRepository = new UserRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const expenseService = new ExpenseService(expenseRepository, categoryRepository);
const categoryController = new CategoryController(categoryService);
const expenseController = new ExpenseController(expenseService);

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(express.json());
  app.use(createUserContextMiddleware(userRepository));

  app.get("/health", (_request, response) => {
    response.status(200).json({
      success: true,
      data: {
        status: "ok",
      },
    });
  });

  app.use("/categories", createCategoryRouter(categoryController));
  app.use("/expenses", createExpenseRouter(expenseController));

  app.use(errorHandler);

  return app;
}
