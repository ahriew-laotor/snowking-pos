"use client";

import { CartItem } from "@/types/product";
import { ShoppingCart } from "lucide-react";

interface OrderCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onEditItem: (item: CartItem) => void;
  onCheckout: () => void;
}

export default function OrderCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onEditItem,
  onCheckout,
}: OrderCartProps) {
  const grandTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header  */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-gray-800 text-lg">ລາຍການສັ່ງຊື້</h2>
          {/* Badge  */}
          <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {totalItems} ລາຍການ
          </span>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearCart}
            className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
          >
            ລ້າງລາຍການທັງໝົດ
          </button>
        )}
      </div>

      {/* รายการสินค้าในตะกร้า */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
            {/* <svg
              className="w-12 h-12 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg> */}
            <ShoppingCart className="w-12 h-12" />
            <p className="text-sm font-medium">ຍັງບໍ່ມີລາຍການສິນຄ້າ</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg flex justify-between items-start gap-2"
            >
              <div
                onClick={() => onEditItem(item)}
                className="flex-1 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-sm">
                    {item.product.name}
                    <span className="text-[10px] ml-2 text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-normal">
                      ແກ້ໄຂ
                    </span>
                  </h4>
                </div>

                {/* Options */}
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  {item.options.sweetness && (
                    <span className="mr-2">ຫວານ: {item.options.sweetness}</span>
                  )}
                  {item.options.ice && (
                    <span className="mr-2">ນ້ຳກ້ອນ: {item.options.ice}</span>
                  )}
                  {item.options.toppings &&
                    item.options.toppings.length > 0 && (
                      <div className="text-amber-700 font-medium">
                        ທ໋ອບປິ້ງ: {item.options.toppings.join(", ")}
                      </div>
                    )}
                </div>

                <div className="text-xs font-bold text-amber-600 mt-1">
                  {item.totalPrice.toLocaleString()} LAK
                </div>
              </div>

              {/* ເພີ່ມ-ລົບລາຍການ */}
              <div className="flex items-center gap-1 mt-1 bg-white border border-gray-200 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="w-6 h-6 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-6 text-center text-xs font-bold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="w-6 h-6 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-gray-700 flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 text-xs font-bold px-1"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer - ສະຫຼຸບ ແລະ ລາຄາ */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>ຈຳນວນເມນູທັງໝົດ ({items.length} ລາຍການ)</span>
            <span>ຈຳນວນອັນ {totalItems}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold text-gray-800">
            <span>ລວມທັງໝົດ</span>
            <span className="text-amber-600">
              {grandTotal.toLocaleString()} LAK
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={items.length === 0}
          onClick={onCheckout}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold rounded-lg transition-all cursor-pointer disabled:cursor-not-allowed shadow-md"
        >
          ຊຳລະເງິນ ({totalItems})
        </button>
      </div>
    </div>
  );
}
