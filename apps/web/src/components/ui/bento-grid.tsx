import React from "react";
import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-2xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-zinc-900/60 dark:border-zinc-800/80 border border-zinc-800 justify-between flex flex-col space-y-4 backdrop-blur-md",
        className
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200">
        {icon}
        <div className="font-semibold text-zinc-100 mb-1 mt-2 text-base">
          {title}
        </div>
        <div className="font-normal text-zinc-400 text-xs leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );
};
