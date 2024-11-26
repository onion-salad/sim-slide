import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  className?: string;
}

const Title = ({ children, className }: TitleProps) => {
  return (
    <h1 className={cn(
      "text-[4vw] font-bold bg-gradient-to-r from-[#7C3AED] to-[#6366F1] bg-clip-text text-transparent",
      className
    )}>
      {children}
    </h1>
  );
};

export default Title;