// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser } from "@/actions/auth";
import SettingsModal from "./SettingsModal";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const COLLAPSE_KEY = "keeva.sidebar.collapsed";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState("Loading...");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(COLLAPSE_KEY) === "1") setIsCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, isCollapsed ? "1" : "0");
    } catch {}
  }, [isCollapsed]);

  useEffect(() => {
    async function fetchUser() {
      const user = (await getCurrentUser()) as any;
      if (user) {
        const name =
          user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
        const photo = user.user_metadata?.avatar_url || null;
        setUserName(name);
        if (photo) setUserPhoto(photo);
      } else {
        setUserName("Guest");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isAuthPage =
    pathname === "/" || pathname === "/login" || pathname === "/register";
  if (isAuthPage) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Customer List", href: "/customer-list", icon: Users },
    { name: "Upload CSV", href: "/upload-csv", icon: UploadCloud },
    { name: "Prediction Results", href: "/prediction-results", icon: PieChart },
    { name: "Feature Importance", href: "/feature-importance", icon: FileText },
    { name: "Revenue at Risk", href: "/revenue-at-risk", icon: BadgeDollarSign },
  ];

  return (
    <>
      {/* --- MOBILE TOP NAVIGATION --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-5 flex items-center justify-between z-[40]">
        <div className="flex items-center gap-2">
          <img src="/assets/keeva.png" alt="Logo" className="h-7 w-auto" />
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Keeva
          </span>
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
        {/* FLOATING COLLAPSE TOGGLE (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed((v) => !v)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-4 top-8 z-30 w-8 h-8 items-center justify-center rounded-full bg-white border-2 border-slate-100 text-slate-600 shadow-sm hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} strokeWidth={2.5} /> : <ChevronLeft size={18} strokeWidth={2.5} />}
        </button>

        {/* LOGO AREA */}
        <div className={`flex items-center h-20 ${isCollapsed ? "lg:justify-center px-6" : "px-7"}`}>
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
          {navItems.map((item) => {
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