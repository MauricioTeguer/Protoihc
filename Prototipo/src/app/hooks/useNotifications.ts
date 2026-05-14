import { useEffect, useState, useCallback, useRef } from "react";

export interface NotificationSettings {
  enabled: boolean;
  permission: NotificationPermission;
  time: string; // Format: "HH:MM"
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem("notificationSettings");
    return saved
      ? JSON.parse(saved)
      : {
          enabled: false,
          permission: "default",
          time: "20:00", // Default to 8:00 PM
        };
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notificationSettings", JSON.stringify(settings));
  }, [settings]);

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      alert("This browser does not support notifications");
      return false;
    }

    const permission = await Notification.requestPermission();
    setSettings((prev) => ({ ...prev, permission }));
    return permission === "granted";
  };

  // Send notification
  const sendNotification = useCallback(() => {
    if (settings.permission !== "granted") return;

    new Notification("ExpenTra Reminder", {
      body: "Don't forget to record your expenses for today! 💰",
      icon: "/icon.png",
      badge: "/badge.png",
      tag: "daily-reminder",
      requireInteraction: false,
    });
  }, [settings.permission]);

  // Schedule notification for the specified time
  const scheduleNotification = useCallback(() => {
    if (!settings.enabled || settings.permission !== "granted") return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const now = new Date();
    const [hours, minutes] = settings.time.split(":").map(Number);
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    );

    // If scheduled time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    timeoutRef.current = setTimeout(() => {
      sendNotification();
      // Schedule next day's notification
      scheduleNotification();
    }, timeUntilNotification);
  }, [settings.enabled, settings.permission, settings.time, sendNotification]);

  // Enable daily notifications
  const enableNotifications = async () => {
    const hasPermission = await requestPermission();
    if (hasPermission) {
      setSettings((prev) => ({ ...prev, enabled: true }));
      return true;
    }
    return false;
  };

  // Disable daily notifications
  const disableNotifications = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSettings((prev) => ({ ...prev, enabled: false }));
  };

  // Update notification time
  const updateTime = (time: string) => {
    setSettings((prev) => ({ ...prev, time }));
  };

  // Test notification (sends immediately)
  const testNotification = () => {
    const title = "Test Notification";
    const body = "This is how your daily reminder will look! 🔔";

    // Real browser notification when permission is granted
    if (settings.permission === "granted" && "Notification" in window) {
      new Notification(title, {
        body,
        icon: "/icon.png",
        tag: "test-notification",
      });
      return;
    }

    // Fallback simulation for development/demo
    alert(`🔔 ${title}\n\n${body}`);
  };

  // Initialize scheduled notifications on mount
  useEffect(() => {
    if (settings.enabled && settings.permission === "granted") {
      scheduleNotification();
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [settings.enabled, settings.permission, scheduleNotification]);

  return {
    settings,
    enableNotifications,
    disableNotifications,
    updateTime,
    testNotification,
    requestPermission,
  };
}