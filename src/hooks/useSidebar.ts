// \src\hooks\useSidebar.ts

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";

const COLLAPSE_KEY = "keeva.sidebar.collapsed";

export function useSidebar() {
  const pathname = usePathname();
  const [userName, setUserName] = useState("Loading...");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapse state from Local Storage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        if (localStorage.getItem(COLLAPSE_KEY) === "1") setIsCollapsed(true);
      }
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
    }
  }, []);

  // Save collapse state to Local Storage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(COLLAPSE_KEY, isCollapsed ? "1" : "0");
      }
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
    }
  }, [isCollapsed]);

  // Fetch current user authentication metadata
  useEffect(() => {
    async function fetchUser() {
      try {
        const user = (await getCurrentUser()) as any;
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
          const photo = user.user_metadata?.avatar_url || null;
          setUserName(name);
          if (photo) setUserPhoto(photo);
        } else {
          setUserName("Guest");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUserName("Guest");
      }
    }
    fetchUser();
  }, []);

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isAuthPage = pathname === "/" || pathname === "/login" || pathname === "/register";

  return {
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
  };
}