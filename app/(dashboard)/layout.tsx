"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Calendar,
  Clock,
  LayoutGrid,
  Maximize,
  Minimize,
  ShoppingCart,
  Package,
  LogOut,
  X,
  ChevronRight,
  Shield,
  User,
  Lock,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { useAuth, ADMIN_PIN } from "@/lib/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, logout, elevateToAdmin } = useAuth();

  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Admin PIN prompt state when staff tries to access products
  const [isAdminPromptOpen, setIsAdminPromptOpen] = useState<boolean>(false);
  const [adminPinInput, setAdminPinInput] = useState<string>("");
  const [adminPromptError, setAdminPromptError] = useState<string>("");

  // Clean hydration check for React 19 / SSR
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      setDate(`${day}-${month}-${year}`);
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleNavigate = (path: string) => {
    if (path === "/products" && !isAdmin) {
      // Staff cannot enter products! Open admin verification prompt
      setAdminPinInput("");
      setAdminPromptError("");
      setIsAdminPromptOpen(true);
      return;
    }

    setIsMenuOpen(false);
    router.push(path);
  };

  const handleVerifyAdminPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (adminPinInput === ADMIN_PIN) {
      elevateToAdmin(adminPinInput);
      setIsAdminPromptOpen(false);
      setIsMenuOpen(false);
      router.push("/products");
    } else if (adminPinInput === "888888") {
      setAdminPromptError("ລະຫັດ 888888 ແມ່ນສຳລັບພະນັກງານເທົ່ານັ້ນ! ບໍ່ສາມາດເຂົ້າໜ້າຈັດການສິນຄ້າໄດ້");
    } else {
      setAdminPromptError("ລະຫັດ Admin ບໍ່ຖືກຕ້ອງ!");
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 select-none">
      {/* Top Header — Fully Responsive for Mobile to Desktop */}
      <header className="h-13 sm:h-12 bg-blue-600 text-white flex justify-between items-center px-3 sm:px-5 text-sm font-medium shrink-0 z-40 shadow-xs">
        {/* Left: Brand + Role Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push("/pos")}>
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              S
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight bg-linear-to-r from-amber-200 to-amber-50 bg-clip-text text-transparent truncate">
              Snowking POS
            </h1>
          </div>

          {/* Current User Role Pill */}
          {mounted && user && (
            <div
              className={`hidden xs:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all ${
                isAdmin
                  ? "bg-amber-400/20 text-amber-200 border-amber-400/40"
                  : "bg-blue-500/40 text-blue-100 border-blue-400/30"
              }`}
              title={isAdmin ? "ສິດທິ: ແອດມິນ (Admin)" : "ສິດທິ: ພະນັກງານ (Staff)"}
            >
              {isAdmin ? (
                <>
                  <Shield className="w-3 h-3 text-amber-300" />
                  <span>Admin (111111)</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-blue-200" />
                  <span>Staff (888888)</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: Date/Time + Menu + Fullscreen */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {mounted && date && time ? (
            <div className="flex items-center space-x-2 sm:space-x-3 bg-blue-700/60 border border-blue-500/50 px-2.5 sm:px-3.5 py-1 rounded-xl text-xs font-bold text-blue-50">
              {/* Date (hidden on mobile, visible on sm+) */}
              <div className="hidden sm:flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-300" />
                <span className="font-mono text-gray-100 text-[11px]">{date}</span>
                <span className="text-blue-400 ml-1">|</span>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-300 animate-pulse" />
                <span className="font-mono text-white text-xs sm:text-sm tracking-wide tabular-nums font-black">
                  {time}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-blue-200 font-medium animate-pulse hidden sm:block">
              ກຳລັງໂຫລດ...
            </div>
          )}

          {/* Grid Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="hover:bg-blue-700 active:scale-95 transition-all duration-150 p-2 rounded-xl cursor-pointer text-white bg-blue-700/40 border border-blue-500/40"
            title="System Menu"
          >
            <LayoutGrid className="w-4.5 h-4.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            type="button"
            className="hidden sm:flex hover:bg-blue-700 active:scale-95 transition-all duration-150 p-2 rounded-xl cursor-pointer text-blue-100 bg-blue-700/40 border border-blue-500/40"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main App Content Area */}
      <main className="flex-1 overflow-hidden p-1.5 sm:p-2">{children}</main>

      {/* System Navigation & Action Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <LayoutGrid className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight leading-none">
                    ເມນູລະບົບ (System Menu)
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] text-blue-100 font-medium">
                      ເຂົ້າສູ່ລະບົບໂດຍ:
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                        isAdmin
                          ? "bg-amber-400 text-amber-950"
                          : "bg-blue-400 text-blue-950"
                      }`}
                    >
                      {isAdmin ? "🛡️ ແອດມິນ (Admin)" : "👤 ພະນັກງານ (Staff)"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Menu Options */}
            <div className="p-3.5 sm:p-4 space-y-2">
              {/* POS Page (Accessible to all) */}
              <button
                type="button"
                onClick={() => handleNavigate("/pos")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${
                  pathname === "/pos"
                    ? "bg-amber-50 border-amber-300 ring-1 ring-amber-400"
                    : "bg-gray-50/80 border-gray-200/80 hover:bg-amber-50/50 hover:border-amber-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-gray-800 text-sm">
                        ໜ້າຂາຍ (POS Terminal)
                      </h4>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                        ທຸກຄົນ
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium block">
                      ໜ້າຈໍສັ່ງຊື້ ແລະ ຊຳລະເງິນ
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
              </button>

              {/* Products Management Page (Admin Only, Staff Restricted) */}
              <button
                type="button"
                onClick={() => handleNavigate("/products")}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${
                  pathname === "/products"
                    ? "bg-blue-50 border-blue-300 ring-1 ring-blue-400"
                    : isAdmin
                    ? "bg-gray-50/80 border-gray-200/80 hover:bg-blue-50/50 hover:border-blue-300"
                    : "bg-gray-100/70 border-gray-200/60 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0 ${
                      isAdmin ? "bg-blue-600" : "bg-gray-400"
                    }`}
                  >
                    {isAdmin ? (
                      <Package className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-100" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <h4
                        className={`font-bold text-sm ${
                          isAdmin ? "text-gray-800" : "text-gray-600"
                        }`}
                      >
                        ຈັດການສິນຄ້າ (Products)
                      </h4>
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                          isAdmin
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-700 flex items-center gap-0.5"
                        }`}
                      >
                        {!isAdmin && <Lock className="w-2.5 h-2.5 inline" />}
                        {isAdmin ? "Admin" : "ລັອກ (ສະເພາະ Admin)"}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium block">
                      {isAdmin
                        ? "ເພີ່ມ, ແກ້ໄຂ, ແລະ ປັບສະຖານະສິນຄ້າ"
                        : "ຜູ້ໃຊ້ທົ່ວໄປ ບໍ່ມີສິດເຂົ້າເຖິງ"}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    isAdmin
                      ? "text-gray-400 group-hover:text-blue-600"
                      : "text-gray-300"
                  }`}
                />
              </button>

              <div className="h-px bg-gray-100 my-2" />

              {/* Log out */}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full p-3 rounded-xl bg-gray-50/80 border border-gray-200/80 hover:bg-rose-50/60 hover:border-rose-200 flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800 group-hover:text-rose-600 text-sm transition-colors">
                      ອອກຈາກລະບົບ (Log out)
                    </h4>
                    <span className="text-[11px] text-gray-500 font-medium">
                      ປ່ຽນຜູ້ໃຊ້ງານ ຫຼື ກັບໄປໜ້າ Login
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-rose-600 transition-colors" />
              </button>
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-[10px] font-semibold text-gray-400">
                Snowking POS • ແອດມິນ: 111111 | ພະນັກງານ: 888888
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Verification Modal (When staff tries to access products) */}
      {isAdminPromptOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150">
            <div className="bg-amber-500 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">
                    ຢືນຢັນສິດທິແອດມິນ (Admin Only)
                  </h3>
                  <p className="text-[10px] text-amber-100">
                    ຜູ້ໃຊ້ທົ່ວໄປບໍ່ສາມາດເຂົ້າໜ້ານີ້ໄດ້
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAdminPromptOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyAdminPin} className="p-5">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-800 text-sm">
                  ກະລຸນາປ້ອນລະຫັດ Admin
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  ໜ້າຈັດການສິນຄ້າຖືກຈຳກັດສິດ ສຳລັບຜູ້ດູແລລະບົບເທົ່ານັ້ນ
                </p>
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  value={adminPinInput}
                  onChange={(e) => {
                    setAdminPinInput(e.target.value);
                    setAdminPromptError("");
                  }}
                  placeholder="ປ້ອນລະຫັດ 6 ຫຼັກ"
                  className="w-full text-center tracking-widest text-lg font-black py-2.5 px-3 rounded-xl border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              {adminPromptError && (
                <div className="mb-4 flex items-start gap-1.5 bg-rose-50 border border-rose-200 rounded-lg p-2.5 text-[11px] font-bold text-rose-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{adminPromptError}</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdminPromptOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  ຍົກເລີກ
                </button>
                <button
                  type="submit"
                  disabled={adminPinInput.length !== 6}
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                >
                  ປົດລັອກ & ເຂົ້າສູ່ໜ້າ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
