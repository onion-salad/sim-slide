import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { isMobile } from "@/lib/utils";

interface SaveButtonProps {
  onSave: () => void;
  isAnimating?: boolean;
}

export const SaveButton = ({ onSave, isAnimating: externalIsAnimating }: SaveButtonProps) => {
  const [internalIsAnimating, setInternalIsAnimating] = useState(false);
  const isAnimating = externalIsAnimating || internalIsAnimating;

  useEffect(() => {
    if (externalIsAnimating) {
      const timer = setTimeout(() => {
        setInternalIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [externalIsAnimating]);

  const handleClick = () => {
    setInternalIsAnimating(true);
    onSave();
    setTimeout(() => setInternalIsAnimating(false), 1000);
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      className={cn(
        "w-full relative overflow-hidden transition-all duration-300",
        isAnimating && "animate-[scale-in_0.2s_ease-out]",
        isAnimating && isMobile() && "animate-save-flash"
      )}
    >
      <Save className={cn(
        "w-4 h-4 mr-2 transition-transform duration-300",
        isAnimating && "animate-[spin_0.5s_ease-out]"
      )} />
      保存 (Command + S)
    </Button>
  );
};