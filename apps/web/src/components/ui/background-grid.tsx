import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundGridProps {
  children?: React.ReactNode;
  className?: string;
  pattern?: "grid" | "dots";
}

export const BackgroundGrid: React.FC<BackgroundGridProps> = ({
  children,
  className,
  pattern = "grid",
}) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-zinc-950",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none opacity-20",
          pattern === "grid"
            ? "bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            : "bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
        )}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
