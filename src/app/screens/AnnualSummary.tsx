import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Header } from "../components/Header";
import { monthlyData } from "../data/mockData";
import { useEffect } from "react";

export function AnnualSummary() {
  const totalYearly = monthlyData.reduce((sum, month) => sum + month.amount, 0);

  // Suppress Recharts internal key warning
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('Encountered two children with the same key')) {
        return;
      }
      originalError.call(console, ...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-8">
      <Header title="Annual Summary" showBack />

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Total */}
        <div className="bg-primary text-primary-foreground rounded-3xl p-6 text-center">
          <p className="text-sm opacity-90 mb-1">Total Yearly Expenses</p>
          <h2 className="text-4xl font-bold">${totalYearly.toLocaleString()}</h2>
          <p className="text-sm opacity-75 mt-1">2026</p>
        </div>

        {/* Chart */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h3 className="font-semibold mb-4">Monthly Breakdown</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} key="annual-chart">
                <XAxis 
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                  }}
                  formatter={(value: number) => `$${value}`}
                  cursor={false}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#10b981" 
                  radius={[8, 8, 0, 0]} 
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}