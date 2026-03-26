import { DollarSign, Calendar, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { categories, expenses } from "../data/mockData";

export function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const expense = expenses.find((e) => e.id === id);

  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [category, setCategory] = useState(expense?.category || "");
  const [date, setDate] = useState(expense?.date || "");
  const [note, setNote] = useState(expense?.note || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - just navigate back
    navigate(`/expense/${id}`);
  };

  if (!expense) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Expense Not Found" showBack />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Edit Expense" showBack />

      <div className="flex-1 p-6 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm text-foreground">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-input-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm text-foreground">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-input-background border border-border rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm text-foreground">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-input-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="block text-sm text-foreground">
              Note (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full bg-input-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium active:scale-[0.98] transition-transform mt-8"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
