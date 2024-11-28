import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileAddButtonProps {
  onAddClick: () => void;
}

export const MobileAddButton = ({ onAddClick }: MobileAddButtonProps) => {
  return (
    <div className="fixed bottom-4 right-4 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-2">
          <DropdownMenuItem onClick={onAddClick}>
            新しいスライドを追加
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};