// src/app/layout.tsx
import type { Metadata } from "next";
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
      </body>
    </html>
  );
}