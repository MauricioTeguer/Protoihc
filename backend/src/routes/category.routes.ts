import { Router } from "express";
import type { CategoryController } from "../controllers/category.controller.js";

export function createCategoryRouter(categoryController: CategoryController) {
  const router = Router();

  router.get("/", categoryController.list);
  router.post("/", categoryController.create);
  router.put("/:id", categoryController.update);
  router.delete("/:id", categoryController.remove);

  return router;
}
