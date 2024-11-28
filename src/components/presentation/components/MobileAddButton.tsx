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
  templates: string[];
  onSelect: (template: string) => void;
}

export const MobileAddButton = ({
  onAddClick,
  templates,
  onSelect,
}: MobileAddButtonProps) => {
  return (
    <div className="fixed bottom-4 right-4 md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            onClick={onAddClick}
            size="icon"
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          alignOffset={-40}
          className="w-48"
          sideOffset={5}
        >
          {templates.map((template) => (
            <DropdownMenuItem
              key={template}
              onClick={() => onSelect(template)}
              className="capitalize"
            >
              {template}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};