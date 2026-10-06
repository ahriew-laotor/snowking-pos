"use client";

import { useState, useEffect } from "react";

import { Calendar, Clock, LayoutGrid, Maximize, Minimize } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Function to update the clock
    const updateClock = () => {
      const now = new Date();

      // Format Time (e.g., 01:06:45 PM)
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );

      // Custom DD-MM-YYYY format
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = now.getFullYear();

      setDate(`${day}-${month}-${year}`);
    };
    // Run instantly on mount, then interval every second
    updateClock();
    const timer = setInterval(updateClock, 1000);

    // Cleanup interval on unmount
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

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-100 select-none">
      <header className="h-12 bg-blue-600 text-white flex justify-between items-center px-6 text-sm font-medium shrink-0 z-40 shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black text-lg shadow-sm">
            S
          </div>
          {/* <h1 className="text-xl font-bold">Snowking POS</h1> */}
          <h1 className="text-xl font-black tracking-tight bg-linear-to-r from-amber-200 to-amber-50 bg-clip-text text-transparent">
            Snowking POS
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          {mounted && date && time ? (
            <div className="flex items-center space-x-4 bg-gray-50 border border-gray-200/60 px-4 py-1.5 rounded-xl text-xs font-bold text-gray-600">
              {/* ວັນການດຳເນີນງານ */}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                <span className="text-gray-600 font-medium">ວັນທີ:</span>
                <span className="font-mono text-gray-700">{date}</span>
              </div>

              <span className="text-gray-300">|</span>

              {/* ເວລາປັດຈຸບັນ */}
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span className="text-gray-600 font-medium">ເວລາ:</span>
                <span className="font-mono text-sky-700 text-sm tracking-wide tabular-nums font-black">
                  {time}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-200 font-medium animate-pulse">
              ກຳລັງໂຫລດຂໍ້ມູນລະບົບ...
            </div>
          )}

          <button className="hover:bg-blue-700 transition-all duration-300 p-1 rounded cursor-pointer">
            <LayoutGrid className="w-5 h-5" />
          </button>

          <button
            onClick={toggleFullscreen}
            type="button"
            className="hover:bg-blue-700 transition-all duration-200 p-1 rounded cursor-pointer text-gray-100"
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

      <main className="flex-1 overflow-hidden p-2">{children}</main>
    </div>
  );
}
