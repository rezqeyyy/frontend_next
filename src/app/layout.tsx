// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Keeva Dashboard",
  description: "Customer Churn Prediction Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-[#F8F9FB] text-gray-800 font-sans overflow-hidden antialiased">
        
        {/* SIDEBAR COMPONENT */}
        <Sidebar />

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 h-screen overflow-y-auto">
          {children}
        </main>
        
      </body>
    </html>
  );
}