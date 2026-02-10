import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  title: {
    default: "Nike Store | Just Do It",
    template: "%s | Nike Store",
  },
  description:
    "Shop the latest Nike shoes, apparel, and gear. Free shipping on orders over $100.",
  keywords: ["Nike", "shoes", "sneakers", "running", "basketball", "training"],
  openGraph: {
    type: "website",
    siteName: "Nike Store",
    title: "Nike Store | Just Do It",
    description: "Shop the latest Nike shoes, apparel, and gear.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nike Store | Just Do It",
    description: "Shop the latest Nike shoes, apparel, and gear.",
  },
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
          {children}
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
