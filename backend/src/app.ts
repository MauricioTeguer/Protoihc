import cors from "cors";
import express from "express";
import { prisma } from "./config/prisma.js";
import { CategoryController } from "./controllers/category.controller.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { createUserContextMiddleware } from "./middleware/user-context.middleware.js";
import { CategoryRepository } from "./repositories/category.repository.js";
import { UserRepository } from "./repositories/user.repository.js";
import { createCategoryRouter } from "./routes/category.routes.js";
import { CategoryService } from "./services/category.service.js";

const categoryRepository = new CategoryRepository(prisma);
const userRepository = new UserRepository(prisma);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

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

  app.use(errorHandler);

  return app;
}
