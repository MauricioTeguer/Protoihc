export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  { id: "1", name: "Food & Dining", icon: "utensils", color: "#10b981" },
  { id: "2", name: "Transportation", icon: "car", color: "#3b82f6" },
  { id: "3", name: "Shopping", icon: "shopping-bag", color: "#f59e0b" },
  { id: "4", name: "Entertainment", icon: "film", color: "#8b5cf6" },
  { id: "5", name: "Bills & Utilities", icon: "receipt", color: "#ec4899" },
  { id: "6", name: "Healthcare", icon: "heart-pulse", color: "#ef4444" },
  { id: "7", name: "Education", icon: "graduation-cap", color: "#06b6d4" },
  { id: "8", name: "Other", icon: "more-horizontal", color: "#6b7280" },
];

export const expenses: Expense[] = [
  {
    id: "1",
    amount: 45.50,
    category: "Food & Dining",
    date: "2026-03-18",
    note: "Lunch with colleagues",
  },
  {
    id: "2",
    amount: 120.00,
    category: "Shopping",
    date: "2026-03-17",
    note: "New shoes",
  },
  {
    id: "3",
    amount: 25.00,
    category: "Transportation",
    date: "2026-03-16",
    note: "Taxi to airport",
  },
  {
    id: "4",
    amount: 89.99,
    category: "Bills & Utilities",
    date: "2026-03-15",
    note: "Internet bill",
  },
  {
    id: "5",
    amount: 15.50,
    category: "Food & Dining",
    date: "2026-03-14",
    note: "Coffee and snacks",
  },
  {
    id: "6",
    amount: 55.00,
    category: "Entertainment",
    date: "2026-03-13",
    note: "Concert tickets",
  },
  {
    id: "7",
    amount: 32.99,
    category: "Shopping",
    date: "2026-03-12",
    note: "Books",
  },
  {
    id: "8",
    amount: 75.00,
    category: "Healthcare",
    date: "2026-03-11",
    note: "Doctor visit",
  },
  {
    id: "9",
    amount: 28.50,
    category: "Food & Dining",
    date: "2026-03-10",
    note: "Dinner at restaurant",
  },
  {
    id: "10",
    amount: 18.00,
    category: "Transportation",
    date: "2026-03-09",
    note: "Uber ride",
  },
  {
    id: "11",
    amount: 150.00,
    category: "Shopping",
    date: "2026-03-08",
    note: "Clothing shopping",
  },
  {
    id: "12",
    amount: 42.00,
    category: "Entertainment",
    date: "2026-03-07",
    note: "Movie night",
  },
  {
    id: "13",
    amount: 95.00,
    category: "Bills & Utilities",
    date: "2026-03-06",
    note: "Electricity bill",
  },
  {
    id: "14",
    amount: 12.50,
    category: "Food & Dining",
    date: "2026-03-05",
    note: "Breakfast",
  },
  {
    id: "15",
    amount: 65.00,
    category: "Healthcare",
    date: "2026-03-04",
    note: "Pharmacy",
  },
  {
    id: "16",
    amount: 220.00,
    category: "Education",
    date: "2026-03-03",
    note: "Online course",
  },
  {
    id: "17",
    amount: 38.00,
    category: "Transportation",
    date: "2026-03-02",
    note: "Gas station",
  },
  {
    id: "18",
    amount: 52.50,
    category: "Food & Dining",
    date: "2026-03-01",
    note: "Grocery shopping",
  },
  {
    id: "19",
    amount: 60.00,
    category: "Food & Dining",
    date: "2026-02-28",
    note: "Lunch",
  },
  {
    id: "20",
    amount: 85.00,
    category: "Shopping",
    date: "2026-02-27",
    note: "Groceries",
  },
  {
    id: "21",
    amount: 30.00,
    category: "Transportation",
    date: "2026-02-26",
    note: "Gas",
  },
  {
    id: "22",
    amount: 45.00,
    category: "Entertainment",
    date: "2026-02-25",
    note: "Dinner and movie",
  },
  {
    id: "23",
    amount: 22.00,
    category: "Food & Dining",
    date: "2026-02-20",
    note: "Coffee",
  },
  {
    id: "24",
    amount: 95.00,
    category: "Bills & Utilities",
    date: "2026-02-15",
    note: "Phone bill",
  },
  {
    id: "25",
    amount: 55.00,
    category: "Healthcare",
    date: "2026-02-10",
    note: "Vitamins",
  },
  {
    id: "26",
    amount: 40.00,
    category: "Shopping",
    date: "2026-02-05",
    note: "Clothes",
  },
  {
    id: "27",
    amount: 35.00,
    category: "Transportation",
    date: "2026-02-02",
    note: "Taxi",
  },
];

export const monthlyData = [
  { id: "jan", month: "Jan", amount: 1200 },
  { id: "feb", month: "Feb", amount: 1450 },
  { id: "mar", month: "Mar", amount: 1100 },
  { id: "apr", month: "Apr", amount: 1600 },
  { id: "may", month: "May", amount: 1350 },
  { id: "jun", month: "Jun", amount: 1800 },
  { id: "jul", month: "Jul", amount: 1500 },
  { id: "aug", month: "Aug", amount: 1250 },
  { id: "sep", month: "Sep", amount: 1700 },
  { id: "oct", month: "Oct", amount: 1400 },
  { id: "nov", month: "Nov", amount: 1550 },
  { id: "dec", month: "Dec", amount: 1900 },
];

export const categoryTotals = [
  { name: "Food & Dining", value: 450, color: "#10b981" },
  { name: "Shopping", value: 320, color: "#f59e0b" },
  { name: "Transportation", value: 180, color: "#3b82f6" },
  { name: "Entertainment", value: 150, color: "#8b5cf6" },
  { name: "Bills & Utilities", value: 250, color: "#ec4899" },
  { name: "Healthcare", value: 120, color: "#ef4444" },
];