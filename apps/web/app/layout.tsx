import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header, Footer, NavbarSpacer } from "@/components/layout";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "Nike Store | Just Do It",
    template: "%s | Nike Store",
  },
  description:
    "Shop the latest Nike shoes, apparel, and gear. Free shipping on orders over $100.",
  keywords: ["Nike", "shoes", "sneakers", "running", "basketball", "training"],
  icons: {
    icon: "/nike_logo.ico",
    shortcut: "/nike_logo.ico",
    apple: "/nike_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          <Header />
          <NavbarSpacer />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
