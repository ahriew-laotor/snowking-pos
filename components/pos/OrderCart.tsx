"use client";

import { CartItem } from "@/types/product";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";

interface OrderCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onEditItem: (item: CartItem) => void;
  onCheckout: () => void;
  onBackToMenu?: () => void;
}

export default function OrderCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onEditItem,
  onCheckout,
  onBackToMenu,
}: OrderCartProps) {
  const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-2xs border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {onBackToMenu && (
            <button
              type="button"
              onClick={onBackToMenu}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors mr-1 cursor-pointer"
              title="ກັບໄປໜ້າເມນູ"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h2 className="font-bold text-gray-800 text-base sm:text-lg">
            ລາຍການສັ່ງຊື້
          </h2>
          <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
            {totalItems} ອັນ
          </span>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ລ້າງລາຍການທັງໝົດ</span>
            <span className="sm:hidden">ລ້າງ</span>
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5">
        {items.length === 0 ? (
          <div className="h-full min-h-45 flex flex-col items-center justify-center text-gray-400 space-y-2 p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-7 h-7 stroke-1" />
            </div>
            <p className="text-sm font-bold text-gray-600">ຍັງບໍ່ມີລາຍການສິນຄ້າ</p>
            <p className="text-xs text-gray-400 max-w-xs">
              ເລືອກສິນຄ້າຈາກເມນູເພື່ອເພີ່ມລົງໃນກະຕ່າ
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-amber-50/40 border border-amber-200/70 rounded-xl flex justify-between items-start gap-2 hover:border-amber-400 transition-all"
            >
              <div
                onClick={() => onEditItem(item)}
                className="flex-1 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-800 text-xs sm:text-sm">
                    {item.product.name}
                  </h4>
                  <span className="text-[10px] text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded font-semibold">
                    ແກ້ໄຂ
                  </span>
                </div>

                {/* Options */}
                <div className="text-[11px] text-gray-500 mt-1 space-y-0.5">
                  {item.options.sweetness && (
                    <span className="mr-2">ຫວານ: {item.options.sweetness}</span>
                  )}
                  {item.options.ice && (
                    <span className="mr-2">ນ້ຳກ້ອນ: {item.options.ice}</span>
                  )}
                  {item.options.toppings && item.options.toppings.length > 0 && (
                    <div className="text-amber-800 font-medium">
                      + {item.options.toppings.join(", ")}
                    </div>
                  )}
                </div>

                <div className="text-xs font-black text-amber-600 mt-1.5">
                  {item.totalPrice.toLocaleString()}{" "}
                  <span className="text-[10px] font-bold">LAK</span>
                </div>
              </div>

              {/* Quantity buttons */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-7 h-7 text-xs font-black bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-md text-gray-700 flex items-center justify-center cursor-pointer transition-all"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-black text-gray-800 tabular-nums">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-7 h-7 text-xs font-black bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-md text-gray-700 flex items-center justify-center cursor-pointer transition-all"
                >
                  +
                </button>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-400 hover:text-rose-500 text-xs font-bold p-1 rounded-md transition-colors cursor-pointer shrink-0"
                title="ລົບລາຍການ"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer - Total & Checkout */}
      <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 space-y-2.5 shrink-0">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>ຈຳນວນ {items.length} ລາຍການ ({totalItems} ອັນ)</span>
          </div>
          <div className="flex justify-between items-center text-base sm:text-lg font-black text-gray-800">
            <span>ລວມທັງໝົດ:</span>
            <span className="text-amber-600 font-mono tracking-tight">
              {grandTotal.toLocaleString()}{" "}
              <span className="text-xs font-bold">LAK</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-sm rounded-xl transition-all cursor-pointer shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>ຊຳລະເງິນ ({totalItems})</span>
        </button>
      </div>
    </div>
  );
}
