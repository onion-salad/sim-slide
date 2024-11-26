import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body = ({ children, className }: BodyProps) => {
  return (
    <p className={cn(
      "text-[1vw] leading-relaxed text-gray-600",
      className
    )}>
      {children}
    </p>
  );
};

export default Body;