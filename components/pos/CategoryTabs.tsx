"use client";

import { Category } from "@/types/product";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            type="button"
            className={`
              flex justify-center items-center
              px-15 py-8 rounded-md text-sm font-semibold
              transition-all duration-150 cursor-pointer select-none min-w-25
              ${
                isSelected
                  ? "bg-amber-500 text-white shadow-md scale-[1.02]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95"
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
