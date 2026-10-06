import { Product } from "@/types/product";
import { PackageOpen, Sparkles, Plus } from "lucide-react";

interface ProductGridProps {
  selectedCategory: string;
  onSelectProduct?: (product: Product) => void;
  products: Product[];
}

export default function ProductGrid({
  selectedCategory,
  onSelectProduct,
  products,
}: ProductGridProps) {
  // If category selected, filter by category and only show available products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || selectedCategory === "all"
        ? true
        : product.categoryId === selectedCategory;
    const isAvailable = product.available !== false;
    return matchesCategory && isAvailable;
  });

  return (
    <div className="h-full flex flex-col space-y-2.5 sm:space-y-3">
      {/* Category count bar */}
      <div className="flex justify-between items-center bg-gray-50/70 p-2 sm:p-2.5 rounded-xl border border-gray-100 shrink-0">
        <span className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          ລາຍການສິນຄ້າ
        </span>
        <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 bg-gray-200/80 text-gray-700 rounded-full">
          {filteredProducts.length} ລາຍການ
        </span>
      </div>

      {/* Grid of products */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 pb-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onSelectProduct && onSelectProduct(product)}
                type="button"
                className="
                  flex flex-col justify-between p-2.5 sm:p-3 rounded-xl border border-gray-200 
                  bg-white hover:bg-amber-50/60 hover:border-amber-400 active:scale-95
                  transition-all duration-150 cursor-pointer select-none text-left min-h-26.25 sm:min-h-25.75 shadow-2xs group
                "
              >
                <div className="space-y-1">
                  <span className="inline-block text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                    {product.categoryId}
                  </span>
                  <p className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-amber-800 transition-colors">
                    {product.name}
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="mt-2 pt-2 flex justify-between items-end border-t border-gray-100 w-full">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                      ລາຄາ
                    </span>
                    <span className="text-xs sm:text-sm font-black text-amber-600 tracking-tight">
                      {product.price.toLocaleString()}{" "}
                      <span className="text-[10px] font-bold">LAK</span>
                    </span>
                  </div>

                  <div className="w-6 h-6 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-400 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white transition-all">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="h-full min-h-50 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200/80">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <PackageOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-bold text-gray-700">
              ບໍ່ມີລາຍການສິນຄ້າ
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              ກະລຸນາເລືອກໝວດໝູ່ສິນຄ້າອື່ນ ເພື່ອສະແດງລາຍການ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
