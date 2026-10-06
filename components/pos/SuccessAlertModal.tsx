"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessAlertModalProps {
  isOpen: boolean;
  totalAmount: number;
  changeAmount: number;
  onClose: () => void;
  onPrintReceipt?: () => void; // Added optional print handler
}

export default function SuccessAlertModal({
  isOpen,
  totalAmount,
  changeAmount,
  onClose,
}: SuccessAlertModalProps) {
  const [countdown, setCountdown] = useState<number>(5);
  const TOTAL_DURATION = 5;

  useEffect(() => {
    if (!isOpen) return;

    let currentSeconds = TOTAL_DURATION;

    const interval = setInterval(() => {
      currentSeconds -= 1;
      setCountdown(currentSeconds);

      if (currentSeconds <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        <div className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-full absolute top-4 right-4">
          <span className="text-xs font-bold text-emerald-600">
            {countdown}
          </span>
        </div>

        {/* Success Animated Icon Badge */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100 animate-bounce">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-gray-800 tracking-tight">
          ຊຳລະເງິນສຳເລັດແລ້ວ!
        </h3>
        <p className="text-xs font-medium text-gray-400 mt-0.5 uppercase tracking-wider">
          Payment Successful
        </p>

        {/* Financial Breakdown Card */}
        <div className="w-full bg-gray-50/80 rounded-xl p-4 mt-5 border border-gray-100/80 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">ຍອດຊຳລະທັງໝົດ</span>
            <span className="font-bold text-gray-800">
              {totalAmount.toLocaleString()} LAK
            </span>
          </div>

          <div className="h-px bg-dashed bg-gray-200 w-full" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-emerald-600">
              ເງິນທອນ
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {changeAmount.toLocaleString()}{" "}
              <span className="text-sm font-bold">LAK</span>
            </span>
          </div>
        </div>

        {/* Interactive Action Buttons Footer */}
        <div className="w-50 flex gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md shadow-amber-500/10 transition-all cursor-pointer text-center"
          >
            ປິດ
          </button>
        </div>

        {/* Floating Auto-Close Disclaimer */}
        <span className="text-[10px] font-semibold text-gray-300 mt-4 block">
          * ໜ້ານີ້ຈະປິດອັດຕະໂນມັດເມື່ອໂຕຈັບເວລາໝົດລົງ
        </span>
      </div>
    </div>
  );
}
