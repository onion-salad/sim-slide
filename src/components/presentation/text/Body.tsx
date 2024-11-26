import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body = ({ children, className }: BodyProps) => {
  return (
    <p className={cn(
      "text-[16px] md:text-[24px] leading-[1.15] text-gray-600",
      className
    )}>
      {children}
    </p>
  );
};

export default Body;