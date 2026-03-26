import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Header } from "../components/Header";
import { categoryTotals } from "../data/mockData";

export function CategorySummary() {
  const total = categoryTotals.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header title="Category Summary" showBack />

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Chart */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-4">Spending by Category</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  isAnimationActive={false}
                >
                  {categoryTotals.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => `$${value}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          <h3 className="font-semibold">Category Totals</h3>
          {categoryTotals.map((category) => (
            <div
              key={category.name}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold">${category.value}</p>
                <p className="text-xs text-muted-foreground">
                  {((category.value / total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}