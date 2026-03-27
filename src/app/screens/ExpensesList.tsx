import { ChevronLeft, ChevronRight, Filter, X, Calendar } from "lucide-react";
import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { ExpenseCard } from "../components/ExpenseCard";
import { Header } from "../components/Header";
import { expenses, categories } from "../data/mockData";

export function ExpensesList() {
  const [currentMonth, setCurrentMonth] = useState("March 2026");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePrevMonth = () => {
    // Mock month navigation
    setCurrentMonth("February 2026");
  };

  const handleNextMonth = () => {
    // Mock month navigation
    setCurrentMonth("April 2026");
  };

  // Filter expenses based on category and date range
  const filteredExpenses = expenses.filter(expense => {
    // Filter by category
    if (selectedCategory && expense.category !== selectedCategory) {
      return false;
    }

    // Filter by date range
    if (startDate && new Date(expense.date) < new Date(startDate)) {
      return false;
    }
    if (endDate && new Date(expense.date) > new Date(endDate)) {
      return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = selectedCategory || startDate || endDate;

  return (
    <div className="min-h-full bg-background pb-20">
      <Header title="All Expenses" showBack />

      <div className="max-w-md mx-auto p-6 space-y-4">
        {/* Month Selector */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="font-medium">{currentMonth}</span>
          
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-full bg-card border border-border rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors ${
            hasActiveFilters ? 'border-primary bg-primary/5' : ''
          }`}
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">
            {hasActiveFilters ? 'Filters Active' : 'Filter Expenses'}
          </span>
          {hasActiveFilters && (
            <span className="ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full">
              {[selectedCategory, startDate, endDate].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Category
              </label>
              <select
                value={selectedCategory || ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Filter by Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="px-2">
          <p className="text-sm text-muted-foreground">
            Showing {filteredExpenses.length} of {expenses.length} expenses
          </p>
        </div>

        {/* Expenses List */}
        <div className="space-y-3">
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense) => (
              <ExpenseCard key={expense.id} expense={expense} />
            ))
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">No expenses found</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-3 text-primary font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}