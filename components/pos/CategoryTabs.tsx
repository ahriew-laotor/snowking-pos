"use client";

import { Category } from "@/types/product";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  orientation?: "vertical" | "horizontal" | "responsive";
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
  orientation = "responsive",
}: CategoryTabsProps) {
  const containerClasses =
    orientation === "horizontal"
      ? "flex flex-row gap-1.5 p-1.5 bg-white rounded-xl shadow-2xs border border-gray-200 overflow-x-auto no-scrollbar shrink-0"
      : orientation === "vertical"
      ? "flex flex-col gap-2 p-2 bg-white rounded-xl shadow-2xs border border-gray-200 h-full overflow-y-auto"
      : "flex flex-row lg:flex-col gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-xl shadow-2xs border border-gray-200 overflow-x-auto lg:overflow-y-auto lg:h-full shrink-0 no-scrollbar";

  return (
    <div className={containerClasses}>
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            type="button"
            className={`
              flex justify-center items-center text-center
              px-3 sm:px-4 py-2 sm:py-3 lg:py-4 rounded-xl text-xs sm:text-sm font-bold
              transition-all duration-150 cursor-pointer select-none whitespace-nowrap
              ${
                isSelected
                  ? "bg-amber-500 text-white shadow-sm ring-1 ring-amber-400"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200/80 active:scale-95"
              }
            `}
          >
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
