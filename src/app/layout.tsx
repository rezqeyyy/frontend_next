// src/app/layout.tsx
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast"; // 1. Tambahkan import Toaster
import "./globals.css";

export const metadata: Metadata = {
  title: "Keeva Dashboard",
  description: "Customer Churn Prediction Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Cuma tag body sama children aja, jangan naruh Sidebar di sini! */}
      <body className="bg-[#F8F9FB] text-gray-800 font-sans antialiased">
        {children}
        
        {/* 2. Taruh Toaster di sini agar bisa diakses global */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}