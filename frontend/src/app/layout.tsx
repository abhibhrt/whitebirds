// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "WhiteBirds - Premium Fashion Store",
  description:
    "Discover the latest trends in men's and women's fashion at WhiteBirds. Shop clothing, accessories, and more with exclusive offers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-primary text-primary transition-colors duration-300">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}