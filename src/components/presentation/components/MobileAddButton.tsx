import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileAddButtonProps {
  onSelectTemplate: (template: string) => void;
}

export const MobileAddButton = ({ onSelectTemplate }: MobileAddButtonProps) => {
  const templates = ["title", "content", "steps", "thumbnail"];
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:hidden">
      <DropdownMenu onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className={cn(
              "h-6 w-6 text-white transition-transform duration-300",
              isAnimating && "animate-[spin_0.5s_ease-out]"
            )} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-2">
          {templates.map((template) => (
            <DropdownMenuItem
              key={template}
              onClick={() => onSelectTemplate(template)}
              className="capitalize"
            >
              {template}スライド
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};