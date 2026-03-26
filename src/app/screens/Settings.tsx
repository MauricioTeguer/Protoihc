import { Bell, Clock, User, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChangeNameModal } from "../components/ChangeNameModal";
import { useNotifications } from "../hooks/useNotifications";

interface SettingsProps {
  userName?: string;
  onSaveName?: (name: string) => void;
}

export function Settings({ userName = "John Doe", onSaveName }: SettingsProps) {
  const navigate = useNavigate();
  const [isChangeNameModalOpen, setIsChangeNameModalOpen] = useState(false);

  const {
    settings: notificationSettings,
    enableNotifications,
    disableNotifications,
    updateTime,
    testNotification,
  } = useNotifications();

  const handleToggleNotifications = async () => {
    if (notificationSettings.enabled) {
      disableNotifications();
    } else {
      const success = await enableNotifications();
      if (!success) {
        alert(
          "Unable to enable notifications. Please check your browser permissions."
        );
      }
    }
  };

  const handleSaveName = (name: string) => {
    if (onSaveName) {
      onSaveName(name);
    }
    setIsChangeNameModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Daily Reminder */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Daily Reminder</p>
                <p className="text-xs text-muted-foreground">
                  Get reminded to log expenses
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notificationSettings.enabled ? "bg-primary" : "bg-secondary"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notificationSettings.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {notificationSettings.enabled && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Notification Time
                </label>
                <input
                  type="time"
                  value={notificationSettings.time}
                  onChange={(e) => updateTime(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  You'll receive a reminder each day at this time
                </p>
              </div>

              <button
                onClick={testNotification}
                className="w-full bg-background border border-border rounded-xl p-3 text-sm font-medium hover:bg-secondary transition-colors"
              >
                Send Test Notification
              </button>

              {notificationSettings.permission !== "granted" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                  <p className="text-xs text-yellow-600 dark:text-yellow-500">
                    ⚠️ Notifications require browser permissions. Click the toggle
                    to grant access.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Change Name */}
        <button
          onClick={() => setIsChangeNameModalOpen(true)}
          className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-foreground" />
          </div>
          <span className="flex-1 text-left font-medium">Change Name</span>
        </button>
      </div>

      <ChangeNameModal
        isOpen={isChangeNameModalOpen}
        onClose={() => setIsChangeNameModalOpen(false)}
        currentName={userName}
        onSave={handleSaveName}
      />
    </div>
  );
}
