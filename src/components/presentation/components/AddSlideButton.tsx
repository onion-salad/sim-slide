import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddSlideButtonProps {
  onClick: () => void;
}

export const AddSlideButton = ({ onClick }: AddSlideButtonProps) => {
  return (
    <Button onClick={onClick} size="sm" className="w-full">
      <Plus className="w-4 h-4 mr-2" />
      Add (Space×2)
    </Button>
  );
};