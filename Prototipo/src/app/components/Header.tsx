import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  backReplace?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, backTo, backReplace = false, rightAction }: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo, { replace: backReplace });
      return;
    }

    navigate(-1);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-md mx-auto flex items-center justify-between h-14 px-4">
        {showBack ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-9" />
        )}
        
        <h1 className="text-lg">{title}</h1>
        
        {rightAction ? rightAction : <div className="w-9" />}
      </div>
    </header>
  );
}
