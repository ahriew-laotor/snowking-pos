"use client";

import React, { useState } from "react";
import { Product, ProductOption, CartItem } from "@/types/product";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    options: ProductOption,
    quantity: number,
    itemId?: string,
  ) => void;
  initialItem?: CartItem | null;
}

const SWEETNESS_OPTIONS = ["100%", "70%", "50%", "0%"];
const ICE_OPTIONS = ["ປົກກະຕິ", "ນ້ຳກ້ອນໜ້ອຍ", "ບໍ່ໃສ່"];
const TOPPING_OPTIONS = [
  { id: "coconut", name: "ວຸ້ນໝາກພ້າວ", price: 4000 },
  { id: "pearl", name: "ໄຂ່ມຸກ", price: 4000 },
  { id: "oreo", name: "ໂອລີໂອ້", price: 4000 },
  { id: "pudding", name: "ພູດດິ້ງ", price: 4000 },
];

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onConfirm,
  initialItem,
}: ProductModalProps) {
  const [sweetness, setSweetness] = useState<string>(
    initialItem?.options.sweetness ?? "100%",
  );
  const [ice, setIce] = useState<string>(
    initialItem?.options.ice ?? "ປົກກະຕິ",
  );
  const [selectedToppings, setSelectedToppings] = useState<string[]>(
    initialItem?.options.toppings ?? [],
  );
  const [quantity, setQuantity] = useState<number | string>(
    initialItem?.quantity ?? 1,
  );

  if (!isOpen || !product) return null;

  const isSnack = product.categoryId === "snacks";
  const isIceCream = product.categoryId === "ice-cream";
  const isIcecreamCone = product.name === "ໄອສຄຣີມວານິລາ";

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((item) => item !== toppingName)
        : [...prev, toppingName],
    );
  };

  const numericQuantity =
    typeof quantity === "number" ? quantity : parseInt(quantity, 10) || 1;
  const toppingPrice = isSnack ? 0 : selectedToppings.length * 4000;
  const unitPrice = product.price + toppingPrice;
  const totalPrice = unitPrice * numericQuantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === "") {
      setQuantity("");
    } else {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) {
        setQuantity(parsed);
      }
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === "" || (typeof quantity === "number" && quantity < 1)) {
      setQuantity(1);
    }
  };
  const handleClose = () => {
    setQuantity(1);
    setSelectedToppings([]);
    setSweetness("100%");
    setIce("ປົກກະຕິ");
    onClose();
  };
  const handleConfirm = () => {
    const finalQuantity =
      typeof quantity === "number" && quantity >= 1
        ? quantity
        : parseInt(quantity as string, 10) || 1;

    onConfirm(
      product,
      {
        sweetness: isSnack || isIceCream || isIcecreamCone ? undefined : sweetness,
        ice: isSnack || isIceCream || isIcecreamCone ? undefined : ice,
        toppings: isSnack || isIcecreamCone ? [] : selectedToppings,
      },
      finalQuantity,
      initialItem?.id,
    );

    setQuantity(1);
    setSelectedToppings([]);
    setSweetness("100%");
    setIce("ປົກກະຕິ");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">
              {initialItem ? "ແກ້ໄຂລາຍການ: " : ""}
              {product.name}
            </h3>
          </div>
          <span className="text-xl font-bold bg-blue-600 px-3 py-1 rounded-lg">
            {product.price.toLocaleString()} LAK
          </span>
        </div>

        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {!isSnack && !isIceCream && (
            <>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  ລະດັບນ້ຳຕານ
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SWEETNESS_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSweetness(item)}
                      className={`py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                        sweetness === item
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  ປະລິມານນ້ຳກ້ອນ
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ICE_OPTIONS.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setIce(item)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                        ice === item
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {!isSnack && !isIcecreamCone ? (
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                ເພີ່ມທ໋ອບປິ້ງ
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TOPPING_OPTIONS.map((item) => {
                  const isSelected = selectedToppings.includes(item.name);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleTopping(item.name)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border flex justify-between items-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-amber-50 text-amber-700 border-amber-500 ring-1 ring-amber-500"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] text-gray-500">
                        + 4,000 kip
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500 text-sm italic">
              ສິນຄ້າປະເພດນີ້ບໍ່ມີຕົວເລືອກເພີ່ມ
            </div>
          )}

          <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">ຈຳນວນ</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setQuantity((prev) =>
                    Math.max(1, (typeof prev === "number" ? prev : 1) - 1),
                  )
                }
                className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center cursor-pointer transition-all"
              >
                -
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleQuantityBlur}
                onFocus={(e) => e.target.select()}
                className="w-16 h-9 text-center font-bold text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    (prev) => (typeof prev === "number" ? prev : 0) + 1,
                  )
                }
                className="w-9 h-9 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-gray-700 flex items-center justify-center cursor-pointer transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="w-1/3 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer transition-all"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-2/3 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer transition-all shadow-md flex justify-between px-4 items-center"
          >
            <span>{initialItem ? "ບັນທຶກການແກ້ໄຂ" : "ຢືນຢັນ"}</span>
            <span>{totalPrice.toLocaleString()} LAK</span>
          </button>
        </div>
      </div>
    </div>
  );
}
