import { Link } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { BarChart3, PieChart } from "lucide-react";

export function Reports() {
  return (
    <div className="min-h-full bg-background pb-20">
      <Header title="Reports" />

      <div className="max-w-md mx-auto p-6 space-y-4">
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
