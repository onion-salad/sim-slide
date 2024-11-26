import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SubtitleProps {
  children: ReactNode;
  className?: string;
}

const Subtitle = ({ children, className }: SubtitleProps) => {
  return (
    <h2 className={cn(
      "text-[length:calc(var(--slide-width)*0.036)] leading-[1.15] font-semibold text-gray-700",
      className
    )}>
      {children}
    </h2>
  );
};

export default Subtitle;