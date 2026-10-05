"use client";

import { Product } from "@/types/product";
import { PackageOpen, Sparkles } from "lucide-react";
import { MOCK_PRODUCTS } from "@/data/products"; 

interface ProductGridProps {
  selectedCategory: string;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductGrid({
  selectedCategory,
  onSelectProduct,
}: ProductGridProps) {
  // กรองสินค้าตามหมวดหมู่ที่เลือก
  const filteredProducts = MOCK_PRODUCTS.filter(
    (product) => product.categoryId === selectedCategory,
  );

  return (
    <div className="h-full flex flex-col space-y-3">
      {/* Header ย่อยบอกจำนวนสินค้า */}
      {/* <div className="mb-2 text-xs text-gray-500 flex justify-between items-center">
        <span>ລາຍການສິນຄ້າ ({filteredProducts.length})</span>
      </div> */}
      <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-xl border border-gray-100">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          ລາຍການສິນຄ້າທັງໝົດ
        </span>
        <span className="text-xs font-bold px-2.5 py-0.5 bg-gray-200/80 text-gray-600 rounded-full">
          {filteredProducts.length} ລາຍການ
        </span>
      </div>

      {/* Grid แสดงสินค้า */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-y-auto pr-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onSelectProduct && onSelectProduct(product)}
              type="button"
              className="
                flex flex-col justify-between p-3 rounded-lg border border-gray-200 
                bg-gray-50 hover:bg-amber-50 hover:border-amber-400 active:scale-95
                transition-all duration-150 cursor-pointer select-none text-left h-28 shadow-sm
              "
            >
              {/* <div>
                <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">
                  {product.name}
                </p>
              </div>

              <div className="mt-auto pt-1 flex justify-between items-end border-t border-gray-200/60 w-full">
                <span className="text-sm font-bold text-amber-600">
                  {product.price.toLocaleString()} LAK
                </span>
              </div> */}

              <div className="space-y-1.5">
                <p className="font-bold text-gray-800 text-sm line-clamp-2 leading-snug group-hover:text-amber-900 transition-colors">
                  {product.name}
                </p>
              </div>

              {/* ສ່ວນລຸ່ມ: ລາຄາສິນຄ້າ */}
              <div className="mt-auto pt-2 flex justify-between items-end border-t border-gray-100 w-full">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                    Price
                  </span>
                  <span className="text-sm font-black text-amber-600 tracking-tight">
                    {product.price.toLocaleString()}{" "}
                    <span className="text-xs font-bold">LAK</span>
                  </span>
                </div>

                {/* ປຸ່ມບວກນ້ອຍໆ ດ້ານຂ້າງເພື່ອເພີ່ມຄວາມເປັນສິລະປະ */}
                <div className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center font-bold text-gray-400 text-xs group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-white transition-all">
                  +
                </div>
              </div>
            </button>
          ))
        ) : (
          // <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400">
          //   <p>ກະລຸນາເລືອກໝວດສິນຄ້າ</p>
          // </div>
          <div className="w-100 h-full min-h-75 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200/80 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <PackageOpen className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="text-sm font-bold text-gray-700">
              ບໍ່ມີລາຍການສິນຄ້າ
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-50">
              ກະລຸນາເລືອກໝວດໝູ່ສິນຄ້າຢູ່ແຖບດ້ານຂ້າງ ເພື່ອສະແດງລາຍການ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
