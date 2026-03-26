import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { ExpenseCard } from "../components/ExpenseCard";
import { AddExpenseModal } from "../components/AddExpenseModal";
import { expenses } from "../data/mockData";

export function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalThisMonth = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8 rounded-b-3xl">
        <div className="max-w-md mx-auto">
          <p className="text-sm opacity-90 mb-1">Total Spending</p>
          <h1 className="text-4xl font-bold mb-1">${totalThisMonth.toFixed(2)}</h1>
          <p className="text-sm opacity-75">March 2026</p>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="max-w-md mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
          <Link to="/expenses" className="text-primary text-sm font-medium">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {recentExpenses.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-24 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <BottomNav />
    </div>
  );
}