import { User } from "lucide-react";
import { useState } from "react";
import { Modal } from "./Modal";

interface ChangeNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (name: string) => void;
}

export function ChangeNameModal({ isOpen, onClose, currentName, onSave }: ChangeNameModalProps) {
  const [name, setName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Name">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm text-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-input-background border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-medium active:scale-[0.98] transition-transform"
        >
          Save Changes
        </button>
      </form>
    </Modal>
  );
}
