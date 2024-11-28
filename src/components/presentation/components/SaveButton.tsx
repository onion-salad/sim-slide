import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  onSave: () => void;
}

export const SaveButton = ({ onSave }: SaveButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onSave();
    setTimeout(() => setIsAnimating(false), 1000);
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className={cn(
        "w-full relative overflow-hidden transition-all duration-300",
        isAnimating && "animate-[scale-in_0.2s_ease-out]"
      )}
    >
      <Save className={cn(
        "w-4 h-4 mr-2 transition-transform duration-300",
        isAnimating && "animate-[spin_0.5s_ease-out]"
      )} />
      保存
    </Button>
  );
};