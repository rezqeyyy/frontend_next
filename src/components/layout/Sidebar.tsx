// C:\KULIAH\semester 6\KEEVA\frontend_next\src\components\layout\Sidebar.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SettingsModal from "./SettingsModal";
import { useSidebar } from "@/hooks/useSidebar";
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  PieChart,
  FileText,
  BadgeDollarSign,
  Settings,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customer List", href: "/customer-list", icon: Users },
  { name: "Upload CSV", href: "/upload-csv", icon: UploadCloud },
  { name: "Prediction Results", href: "/prediction-results", icon: PieChart },
  { name: "Feature Importance", href: "/feature-importance", icon: FileText },
  { name: "Revenue at Risk", href: "/revenue-at-risk", icon: BadgeDollarSign },
];

export default function Sidebar() {
  const router = useRouter();
  const {
    pathname,
    userName,
    setUserName,
    userPhoto,
    setUserPhoto,
    isSettingsOpen,
    setIsSettingsOpen,
    isMobileOpen,
    setIsMobileOpen,
    isCollapsed,
    setIsCollapsed,
    isAuthPage,
  } = useSidebar();

  if (isAuthPage) return null;

  return (
    <>
      {/* --- MOBILE TOP NAVIGATION --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-5 flex items-center justify-between z-[40]">
        <div className="flex items-center gap-2">
          <img src="/assets/keeva.png" alt="Logo" className="h-7 w-auto" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">Keeva</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-gray-500 hover:bg-gray-50 rounded-xl"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* --- SIDEBAR DRAWER OVERLAY (Mobile) --- */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[50] transition-opacity lg:hidden ${
          isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* --- MAIN SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[60] flex flex-col bg-white border-r border-slate-100 transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:h-screen lg:z-20 lg:shadow-none shadow-2xl
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-[88px] w-[260px]" : "w-[260px]"}
        `}
      >
        {/* DESKTOP TOGGLE: Menggunakan Desain 3 Strip ke Bawah */}
        <button
          onClick={() => setIsCollapsed((v) => !v)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`
            hidden lg:flex absolute top-8 z-30 w-8 h-8 items-center justify-center transition-all group
            ${isCollapsed 
              ? "-right-4 rounded-full bg-white border-2 border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50" 
              : "right-5 bg-transparent text-slate-300 hover:text-blue-600"
            }
          `}
        >
          {/* GRIP HANDLE: 3 Strip Vertikal ke Bawah */}
          <div className="flex flex-col gap-[3px] items-center justify-center">
            <span className="w-3 h-[2px] bg-current rounded-full transition-all group-hover:scale-x-110" />
            <span className="w-3 h-[2px] bg-current rounded-full transition-all group-hover:scale-x-110" />
            <span className="w-3 h-[2px] bg-current rounded-full transition-all group-hover:scale-x-110" />
          </div>
        </button>

        {/* LOGO AREA */}
        <div className={`flex items-center h-20 transition-all duration-300 ${isCollapsed ? "lg:justify-center px-6" : "pl-7 pr-14"}`}>
          <div className="flex items-center gap-3">
            <img
              src="/assets/keeva.png"
              alt="Keeva Logo"
              className="h-8 w-auto object-contain shrink-0"
            />
            <span
              className={`text-2xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap overflow-hidden transition-all duration-200 ${
                isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
              }`}
            >
              Keeva
            </span>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden ml-auto p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                title={isCollapsed ? item.name : undefined}
                className={`relative flex items-center rounded-xl transition-all duration-200 ${
                  isCollapsed ? "lg:justify-center px-4 py-3.5 lg:px-0" : "px-4 py-3.5 gap-4"
                } ${
                  isActive
                    ? "bg-[#1d4ed8] text-white shadow-md shadow-blue-200/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`shrink-0 ${isActive ? "text-white" : "text-slate-400"}`}
                />
                <span
                  className={`text-[15px] font-medium whitespace-nowrap overflow-hidden transition-all duration-200 ${
                    isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* USER PROFILE BOTTOM */}
        <div className={`mt-auto border-t border-slate-100 flex items-center ${isCollapsed ? "lg:justify-center p-4" : "p-5 justify-between"}`}>
          <div className={`flex items-center overflow-hidden ${isCollapsed ? "lg:w-auto" : "gap-3 max-w-[170px]"}`}>
            <div className="w-10 h-10 rounded-full bg-[#f8f6ff] overflow-hidden shrink-0">
              <img
                src={
                  userPhoto ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${userName}&backgroundColor=b599f6`
                }
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className={`flex flex-col overflow-hidden transition-all duration-200 ${
                isCollapsed ? "lg:w-0 lg:opacity-0" : "w-auto opacity-100"
              }`}
            >
              <span className="text-[15px] font-bold text-slate-900 leading-tight truncate">
                {userName}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            title="Settings"
            className={`p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all shrink-0 ${
              isCollapsed ? "lg:hidden" : "block"
            }`}
          >
            <Settings size={18} />
          </button>
        </div>
      </aside>

      {/* SETTINGS MODAL */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userName={userName}
        onUpdateSuccess={(newName, newPhoto) => {
          if (newName) setUserName(newName);
          if (newPhoto) setUserPhoto(newPhoto);
          router.refresh();
        }}
      />
    </>
  );
}