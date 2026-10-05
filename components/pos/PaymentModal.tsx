"use client";

import React, { useState } from "react";

interface PaymentModalProps {
  isOpen: boolean;
  grandTotal: number;
  totalItems: number;
  onClose: () => void;
  onConfirmPayment: (receivedAmount: number, change: number) => void;
}

export default function PaymentModal({
  isOpen,
  grandTotal,
  totalItems,
  onClose,
  onConfirmPayment,
}: PaymentModalProps) {
  const [receivedAmount, setReceivedAmount] = useState<string>("");

  if (!isOpen) return null;

  const numericReceived = parseFloat(receivedAmount) || 0;
  const change = numericReceived - grandTotal;
  const isEnough = numericReceived >= grandTotal;

  // ปุ่มลัดสำหรับจำนวนเงิน LAK ยอดนิยม
  const QUICK_CASH_AMOUNTS = [
    grandTotal, // จ่ายพอดี
    20000,
    50000,
    100000,
    200000,
    500000,
  ].filter(
    (amt, index, self) => amt >= grandTotal && self.indexOf(amt) === index,
  );

  const handleQuickCash = (amount: number) => {
    setReceivedAmount(amount.toString());
  };

  const handleConfirm = () => {
    if (isEnough) {
      onConfirmPayment(numericReceived, change);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-amber-500 text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">ຊຳລະເງິນ (Checkout)</h3>
          <span className="text-xs bg-amber-600 px-2.5 py-1 rounded-full">
            {totalItems} ລາຍການ
          </span>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* ยอดรวมที่ต้องชำระ */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
            <span className="text-xs text-gray-500 font-semibold block uppercase">
              ຍອດລວມທັງໝົດ (Total Amount)
            </span>
            <span className="text-3xl font-extrabold text-amber-600">
              {grandTotal.toLocaleString()} LAK
            </span>
          </div>

          {/* ช่องกรอกจำนวนเงินที่รับมา */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">
              ຈຳນວນເງິນທີ່ຮັບມາ (Received Cash)
            </label>
            <input
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              placeholder="0"
              autoFocus
              className="w-full h-12 text-right px-3 font-bold text-xl border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* ปุ่ม Quick Cash */}
          <div>
            <span className="text-xs text-gray-400 block mb-1">
              ປຸ່ນລັດເງິນທີ່ຮັບ (Quick Cash):
            </span>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_CASH_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickCash(amt)}
                  className="py-2 text-xs font-bold rounded-lg border border-gray-200 bg-gray-50 hover:bg-amber-50 hover:border-amber-400 hover:text-amber-700 transition-all cursor-pointer"
                >
                  {amt === grandTotal ? "ພໍດີ" : `${amt.toLocaleString()} LAK`}
                </button>
              ))}
            </div>
          </div>

          {/* เงินทอน */}
          <div
            className={`p-4 rounded-xl border flex justify-between items-center ${
              numericReceived > 0 && !isEnough
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }`}
          >
            <span className="text-sm font-bold">
              {numericReceived > 0 && !isEnough
                ? "ຈຳນວນເງິນບໍ່ພຽງພໍ:"
                : "ເງິນທອນ (Change):"}
            </span>
            <span className="text-xl font-extrabold">
              {numericReceived > 0 && !isEnough
                ? `${Math.abs(change).toLocaleString()} LAK`
                : `${Math.max(0, change).toLocaleString()} LAK`}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 cursor-pointer transition-all"
          >
            ຍົກເລີກ
          </button>
          <button
            type="button"
            disabled={!isEnough}
            onClick={handleConfirm}
            className="w-2/3 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 text-white font-bold cursor-pointer disabled:cursor-not-allowed shadow-md transition-all text-center"
          >
            ຢືນຢັນຊຳລະເງິນ
          </button>
        </div>
      </div>
    </div>
  );
}
