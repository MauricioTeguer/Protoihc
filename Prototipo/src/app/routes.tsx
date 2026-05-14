import { createBrowserRouter } from "react-router-dom";
import { Welcome } from "./screens/Welcome";
import { Login } from "./screens/Login";
import { Register } from "./screens/Register";
import { Dashboard } from "./screens/Dashboard";
import { AddExpense } from "./screens/AddExpense";
import { ExpensesList } from "./screens/ExpensesList";
import { ExpenseDetail } from "./screens/ExpenseDetail";
import { EditExpense } from "./screens/EditExpense";
import { Categories } from "./screens/Categories";
import { CreateCategory } from "./screens/CreateCategory";
import { Reports } from "./screens/Reports";
import { AnnualSummary } from "./screens/AnnualSummary";
import { CategorySummary } from "./screens/CategorySummary";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/add-expense",
    Component: AddExpense,
  },
  {
    path: "/expenses",
    Component: ExpensesList,
  },
  {
    path: "/expense/:id",
    Component: ExpenseDetail,
  },
  {
    path: "/edit-expense/:id",
    Component: EditExpense,
  },
  {
    path: "/categories",
    Component: Categories,
  },
  {
    path: "/create-category",
    Component: CreateCategory,
  },
  {
    path: "/reports",
    Component: Reports,
  },
  {
    path: "/annual-summary",
    Component: AnnualSummary,
  },
  {
    path: "/category-summary",
    Component: CategorySummary,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/settings",
    Component: Settings,
  },
]);
