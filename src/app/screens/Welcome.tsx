import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center shadow-lg">
            <Wallet className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold">ExpenTra</h1>
          <p className="text-muted-foreground text-lg">Track your expenses easily</p>
        </div>
        
        <div className="space-y-3 pt-8">
          <Link
            to="/login"
            className="block w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium active:scale-[0.98] transition-transform"
          >
            Log in
          </Link>
          
          <Link
            to="/register"
            className="block w-full bg-secondary text-secondary-foreground py-4 rounded-2xl font-medium active:scale-[0.98] transition-transform"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
