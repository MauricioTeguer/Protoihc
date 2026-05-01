import { Router } from "express";
import type { ExpenseController } from "../controllers/expense.controller.js";

export function createExpenseRouter(expenseController: ExpenseController) {
  const router = Router();

  router.get("/", expenseController.list);
  router.post("/", expenseController.create);
  router.get("/:id", expenseController.getById);
  router.put("/:id", expenseController.update);
  router.delete("/:id", expenseController.remove);

  return router;
}
