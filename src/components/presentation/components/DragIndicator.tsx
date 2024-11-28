import { cn } from "@/lib/utils";

interface DragIndicatorProps {
  number: number;
  isDragging?: boolean;
}

export const DragIndicator = ({ number, isDragging = false }: DragIndicatorProps) => {
  return (
    <div
      className={cn(
        "w-16 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl",
        "bg-gradient-to-r from-primary to-primary-dark",
        "transition-all duration-300",
        isDragging && "scale-110 shadow-lg"
      )}
    >
      {number}
    </div>
  );
};