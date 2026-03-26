import { X, Bell, Clock, User } from "lucide-react";
import { useEffect } from "react";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeNameClick: () => void;
  notificationSettings: {
    enabled: boolean;
    permission: NotificationPermission;
    time: string;
  };
  onToggleNotifications: () => void;
  onUpdateTime: (time: string) => void;
  onTestNotification: () => void;
}

export function SettingsSidebar({
  isOpen,
  onClose,
  onChangeNameClick,
  notificationSettings,
  onToggleNotifications,
  onUpdateTime,
  onTestNotification,
}: SettingsSidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Spacer to push items to bottom */}
          <div className="flex-1"></div>

          {/* Bottom Content */}
          <div className="p-6 space-y-6 border-t border-border">
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
                  onClick={onToggleNotifications}
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
                      onChange={(e) => onUpdateTime(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      You'll receive a reminder each day at this time
                    </p>
                  </div>

                  <button
                    onClick={onTestNotification}
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
              onClick={onChangeNameClick}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-foreground" />
              </div>
              <span className="flex-1 text-left font-medium">Change Name</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
