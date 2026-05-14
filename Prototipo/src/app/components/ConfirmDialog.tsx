import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmDialogProps) {
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

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 z-50 flex items-end justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="bg-background border border-border rounded-3xl w-full max-w-full sm:max-w-md shadow-xl animate-in slide-in-from-bottom-4 duration-200 mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  variant === "danger"
                    ? "bg-red-100 dark:bg-red-950/30"
                    : "bg-yellow-100 dark:bg-yellow-950/30"
                }`}
              >
                <AlertTriangle
                  className={`w-6 h-6 ${
                    variant === "danger"
                      ? "text-red-600 dark:text-red-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`}
                />
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 -mt-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground">{message}</p>
          </div>

          {/* Actions */}
          <div className="p-6 pt-2 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-background border border-border rounded-2xl py-3 px-4 font-medium active:scale-[0.98] transition-transform hover:bg-secondary"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 rounded-2xl py-3 px-4 font-medium active:scale-[0.98] transition-transform ${
                variant === "danger"
                  ? "bg-red-600 dark:bg-red-500 text-white hover:bg-red-700 dark:hover:bg-red-600"
                  : "bg-yellow-600 dark:bg-yellow-500 text-white hover:bg-yellow-700 dark:hover:bg-yellow-600"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}