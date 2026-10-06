"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  ShieldCheck,
  AlertCircle,
  Delete,
  ArrowRight,
  RotateCcw,
  IceCreamCone,
  CupSoda,
  Cherry,
  Snowflake,
  Shield,
  User,
} from "lucide-react";
import { useAuth, ADMIN_PIN, STAFF_PIN } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);

  const PIN_LENGTH = 6;

  const triggerError = useCallback((msg: string) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 600);
    setPin("");
  }, []);

  const handleLogin = useCallback(
    (codeToVerify: string) => {
      const res = login(codeToVerify);

      if (res.success && res.user) {
        setIsLoading(true);
        setIsSuccess(true);
        setError("");
        const roleGreeting =
          res.user.role === "admin"
            ? "ຍິນດີຕ້ອນຮັບ ແອດມິນ 🛡️"
            : "ຍິນດີຕ້ອນຮັບ ພະນັກງານ 👤";
        setSuccessMessage(`ສຳເລັດ! ${roleGreeting}`);

        setTimeout(() => {
          router.push("/pos");
        }, 600);
      } else {
        triggerError(res.error || "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!");
      }
    },
    [login, router, triggerError]
  );

  const handleKeyPress = useCallback(
    (digit: string) => {
      if (isLoading || isSuccess) return;
      setError("");

      if (pin.length < PIN_LENGTH) {
        const nextPin = pin + digit;
        setPin(nextPin);

        if (nextPin.length === PIN_LENGTH) {
          handleLogin(nextPin);
        }
      }
    },
    [pin, isLoading, isSuccess, handleLogin]
  );

  const handleDelete = useCallback(() => {
    if (isLoading || isSuccess) return;
    setError("");
    setPin((prev) => prev.slice(0, -1));
  }, [isLoading, isSuccess]);

  const handleClear = useCallback(() => {
    if (isLoading || isSuccess) return;
    setError("");
    setPin("");
  }, [isLoading, isSuccess]);

  const handleQuickFill = (presetPin: string) => {
    if (isLoading || isSuccess) return;
    setPin(presetPin);
    handleLogin(presetPin);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === "Backspace") {
        handleDelete();
      } else if (e.key === "Escape") {
        handleClear();
      } else if (e.key === "Enter") {
        if (pin.length === PIN_LENGTH) {
          handleLogin(pin);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress, handleDelete, handleClear, handleLogin, pin]);

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row select-none overflow-x-hidden bg-gray-50">
      {/* Left Panel — Brand & Decorative (Hidden on mobile / tablet portrait) */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative bg-linear-to-br from-blue-700 via-blue-600 to-indigo-800 flex-col items-center justify-center overflow-hidden p-8">
        {/* Floating decorative orbs */}
        <div className="absolute top-16 left-16 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-sky-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-rose-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Floating food icons */}
        <div className="absolute top-[15%] left-[12%] text-white/10 pointer-events-none">
          <IceCreamCone className="w-20 h-20" strokeWidth={1} />
        </div>
        <div className="absolute bottom-[20%] right-[15%] text-white/10 pointer-events-none">
          <CupSoda className="w-16 h-16" strokeWidth={1} />
        </div>
        <div className="absolute top-[60%] left-[8%] text-white/10 pointer-events-none">
          <Cherry className="w-14 h-14" strokeWidth={1} />
        </div>
        <div className="absolute top-[10%] right-[20%] text-white/8 pointer-events-none">
          <Snowflake className="w-24 h-24" strokeWidth={0.8} />
        </div>

        {/* Main branding content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg">
          {/* Logo */}
          <div className="w-22 h-22 rounded-3xl bg-amber-500 shadow-2xl shadow-amber-500/40 flex items-center justify-center text-white font-black text-5xl mb-6 ring-4 ring-white/15">
            S
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight">
            Snowking
          </h1>
          <h2 className="text-xl xl:text-2xl font-bold text-amber-300 tracking-wide mt-1">
            POINT OF SALE
          </h2>

          <div className="w-16 h-1 bg-amber-400/60 rounded-full mt-4 mb-4" />

          <p className="text-white/75 text-sm font-medium max-w-xs leading-relaxed">
            ລະບົບຈັດການການຂາຍໜ້າຮ້ານ ສຳລັບຮ້ານຊານົມ, ກາເຟ ແລະ ໄອສຄຣີມ
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["ຊານົມ", "ກາເຟ", "ໄອສຄຣີມ", "ຊາໝາກໄມ້", "ຂອງກິນຫຼີ້ນ"].map(
              (item) => (
                <span
                  key={item}
                  className="bg-white/10 border border-white/15 text-white/85 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Bottom version */}
        <div className="absolute bottom-6 text-white/40 text-xs font-medium tracking-wide">
          Snowking POS v0.1.0 • © 2026
        </div>
      </div>

      {/* Right Panel — PIN Login (Fully responsive for mobile, tablet, desktop) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 min-h-screen lg:min-h-0 overflow-y-auto">
        {/* Mobile top branding */}
        <div className="lg:hidden flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-11 h-11 rounded-2xl bg-amber-500 shadow-md shadow-amber-500/25 flex items-center justify-center text-white font-black text-2xl">
            S
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-800 tracking-tight leading-none">
              Snowking POS
            </h1>
            <span className="text-xs font-semibold text-gray-500">
              ລະບົບເຂົ້າສູ່ລະບົບ (Login)
            </span>
          </div>
        </div>

        {/* Login Card */}
        <div
          className={`w-full max-w-85 transition-transform duration-300 ${
            shake ? "animate-[shake_0.5s_ease-in-out]" : ""
          }`}
        >
          {/* Lock icon + title */}
          <div className="flex flex-col items-center mb-4 sm:mb-5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-600 shadow-md shadow-blue-600/25 flex items-center justify-center text-white mb-2.5">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-xl font-black text-gray-800 tracking-tight">
              ເຂົ້າສູ່ລະບົບ
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5 text-center">
              ກະລຸນາປ້ອນລະຫັດ PIN 6 ຫຼັກ ເພື່ອເລີ່ມການເຮັດວຽກ
            </p>
          </div>

          {/* PIN Dots Box */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs flex flex-col items-center mb-4">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>ລະຫັດຜ່ານ (PIN 6 ຫຼັກ)</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-3.5">
              {Array.from({ length: PIN_LENGTH }).map((_, index) => {
                const isFilled = index < pin.length;
                const isCurrentSlot = index === pin.length;
                return (
                  <div
                    key={index}
                    className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full transition-all duration-200 ${
                      isFilled
                        ? isSuccess
                          ? "bg-emerald-500 scale-125 shadow-sm shadow-emerald-400/50"
                          : "bg-blue-600 scale-110 shadow-sm shadow-blue-500/40"
                        : isCurrentSlot && !isSuccess
                          ? "bg-gray-200 border-2 border-blue-400 scale-105"
                          : "bg-gray-200 border border-gray-300"
                    }`}
                  />
                );
              })}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3.5 flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 w-full animate-in fade-in duration-200">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-[11px] font-bold text-rose-600">
                  {error}
                </span>
              </div>
            )}

            {/* Success Message */}
            {isSuccess && (
              <div className="mt-3.5 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 w-full animate-in fade-in duration-200">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[11px] font-bold text-emerald-600">
                  {successMessage || "ສຳເລັດ! ກຳລັງເຂົ້າສູ່ລະບົບ..."}
                </span>
              </div>
            )}
          </div>

          {/* Numpad Grid */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isLoading || isSuccess}
                onClick={() => handleKeyPress(digit)}
                className="h-12 sm:h-13 bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 text-gray-800 font-bold text-xl rounded-xl border border-gray-200 shadow-2xs transition-all duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center select-none"
              >
                {digit}
              </button>
            ))}

            {/* Clear */}
            <button
              type="button"
              disabled={isLoading || isSuccess || pin.length === 0}
              onClick={handleClear}
              className="h-12 sm:h-13 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-500 hover:text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-all duration-100 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center select-none"
              title="Clear all"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>

            {/* 0 */}
            <button
              type="button"
              disabled={isLoading || isSuccess}
              onClick={() => handleKeyPress("0")}
              className="h-12 sm:h-13 bg-white hover:bg-blue-50 active:bg-blue-100 active:scale-95 text-gray-800 font-bold text-xl rounded-xl border border-gray-200 shadow-2xs transition-all duration-100 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center select-none"
            >
              0
            </button>

            {/* Backspace */}
            <button
              type="button"
              disabled={isLoading || isSuccess || pin.length === 0}
              onClick={handleDelete}
              className="h-12 sm:h-13 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 active:scale-95 text-gray-500 font-bold text-xs rounded-xl border border-gray-200 transition-all duration-100 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center select-none"
              title="Backspace"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>

          {/* Login Button */}
          <button
            type="button"
            disabled={isLoading || isSuccess || pin.length < PIN_LENGTH}
            onClick={() => handleLogin(pin)}
            className={`w-full h-11 sm:h-12 font-black text-sm rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] ${
              isSuccess
                ? "bg-emerald-500 text-white shadow-emerald-500/25"
                : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none text-white shadow-blue-600/25"
            }`}
          >
            <span>
              {isSuccess
                ? "ສຳເລັດ ✓"
                : isLoading
                  ? "ກຳລັງກວດສອບ..."
                  : "ເຂົ້າສູ່ລະບົບ"}
            </span>
            {!isLoading && !isSuccess && <ArrowRight className="w-4 h-4" />}
          </button>

          {/* Role Accounts & Quick Test Credentials */}
          <div className="mt-4 pt-3 border-t border-gray-200/70">
            <p className="text-[11px] font-bold text-gray-500 text-center mb-2">
              ລະຫັດເຂົ້າໃຊ້ງານຕາມສິດທິ:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {/* Staff PIN */}
              <button
                type="button"
                onClick={() => handleQuickFill(STAFF_PIN)}
                className="p-2 rounded-xl bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left group cursor-pointer shadow-2xs"
                title="ຄລິກເພື່ອປ້ອນ 888888 ອັດຕະໂນມັດ"
              >
                <div className="flex items-center gap-1.5 text-gray-700 font-bold text-xs">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>ພະນັກງານ</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono font-black text-xs text-blue-600 tracking-wider">
                    {STAFF_PIN}
                  </span>
                  <span className="text-[9px] text-gray-400 group-hover:text-blue-500 font-medium">
                    (ໜ້າ POS)
                  </span>
                </div>
              </button>

              {/* Admin PIN */}
              <button
                type="button"
                onClick={() => handleQuickFill(ADMIN_PIN)}
                className="p-2 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer shadow-2xs"
                title="ຄລິກເພື່ອປ້ອນ 111111 ອັດຕະໂນມັດ"
              >
                <div className="flex items-center gap-1.5 text-gray-800 font-bold text-xs">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>ແອດມິນ</span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono font-black text-xs text-amber-600 tracking-wider">
                    {ADMIN_PIN}
                  </span>
                  <span className="text-[9px] text-amber-500 font-medium">
                    (+ ສິນຄ້າ)
                  </span>
                </div>
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 font-medium mt-2">
              ຮອງຮັບ Touchscreen, ມືຖື, ແທັບເລັດ ແລະ ຄີບອດ
            </p>
          </div>
        </div>
      </div>

      {/* Shake keyframe animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          10%,
          50%,
          90% {
            transform: translateX(-6px);
          }
          30%,
          70% {
            transform: translateX(6px);
          }
        }
      `}</style>
    </div>
  );
}