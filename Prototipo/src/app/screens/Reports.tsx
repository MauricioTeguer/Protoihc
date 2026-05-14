import { Link } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { BarChart3, PieChart } from "lucide-react";
import { expenses } from "../data/mockData";

export function Reports() {
  // Get current date
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Filter expenses by month
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === previousMonth &&
      expenseDate.getFullYear() === previousYear
    );
  });

  // Calculate statistics for current month
  const totalExpenses = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const averageExpense =
    currentMonthExpenses.length > 0 ? totalExpenses / currentMonthExpenses.length : 0;
  const transactionCount = currentMonthExpenses.length;

  // Calculate statistics for previous month
  const previousMonthTotal = previousMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const previousMonthAverage =
    previousMonthExpenses.length > 0
      ? previousMonthTotal / previousMonthExpenses.length
      : 0;
  const previousMonthCount = previousMonthExpenses.length;

  // Calculate comparison
  const difference = totalExpenses - previousMonthTotal;
  const percentageChange =
    previousMonthTotal > 0 ? (difference / previousMonthTotal) * 100 : 0;
  const isIncrease = difference > 0;

  return (
    <div className="min-h-full bg-background pb-20">
      <Header title="Reports" />

      <div className="max-w-md mx-auto p-6 space-y-4">
        {/* Statistics Card */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 space-y-5">
          {/* Current Month */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">This Month</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-lg text-primary">${totalExpenses.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg</p>
                <p className="font-bold text-lg">${averageExpense.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="font-bold text-lg">{transactionCount}</p>
              </div>
            </div>
          </div>

          {/* Previous Month */}
          <div className="border-t border-primary/20 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground text-sm">Last Month</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-lg">${previousMonthTotal.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg</p>
                <p className="font-bold text-lg">${previousMonthAverage.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Count</p>
                <p className="font-bold text-lg">{previousMonthCount}</p>
              </div>
            </div>
          </div>

          {/* Difference */}
          <div className="border-t border-primary/20 pt-5">
            <p className="text-xs text-muted-foreground mb-2">Difference</p>
            <div
              className={`font-bold text-lg ${
                isIncrease ? "text-red-500" : "text-green-500"
              }`}
            >
              {isIncrease ? "+" : ""}
              {percentageChange.toFixed(1)}%
            </div>
          </div>
        </div>
        <Link
          to="/annual-summary"
          className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 active:scale-[0.98] transition-transform"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Annual Summary</h3>
            <p className="text-sm text-muted-foreground">
              View monthly expenses for the year
            </p>
          </div>
        </Link>

        <Link
          to="/category-summary"
          className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4 active:scale-[0.98] transition-transform"
        >
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <PieChart className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Category Summary</h3>
            <p className="text-sm text-muted-foreground">
              See spending breakdown by category
            </p>
          </div>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
