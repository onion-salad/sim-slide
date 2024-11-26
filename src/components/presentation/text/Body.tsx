import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body = ({ children, className }: BodyProps) => {
  return (
    <p className={cn(
      "text-[length:calc(var(--slide-width)*0.024)] leading-[1.15] text-gray-600",
      className
    )}>
      {children}
    </p>
  );
};

export default Body;