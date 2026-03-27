import { LogOut, Settings, User as UserIcon, Mail, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "../components/BottomNav";
import { Header } from "../components/Header";
import { ConfirmDialog } from "../components/ConfirmDialog";

export function Profile() {
  const navigate = useNavigate();
  const [userName] = useState("John Doe");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-full bg-background pb-20">
      <Header title="Profile" />

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* User Info */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-semibold text-lg mb-1">{userName}</h2>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            john.doe@example.com
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {/* Settings */}
          <button
            onClick={() => navigate("/settings")}
            className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
          >
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-foreground" />
            </div>
            <span className="flex-1 text-left font-medium">Settings</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Log Out */}
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full bg-background border border-red-200 dark:border-red-900/50 rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform text-red-600 dark:text-red-400"
          >
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="flex-1 text-left font-medium">Log Out</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogout}
        title="Log Out?"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmText="Log Out"
        cancelText="Stay"
        variant="danger"
      />

      <BottomNav />
    </div>
  );
}