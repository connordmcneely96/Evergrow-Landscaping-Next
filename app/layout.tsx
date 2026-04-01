import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Evergrow Landscaping | Professional Landscaping Services | Residential and Commercial",
  description: "Professional Landscaping Services in Arkansas and Oklahoma. Lawncare, Landscaping, Seasonal Cleanups, Pressure Washing",
  keywords: ["landscaping", "lawn care", "Arkansas", "Oklahoma", "landscaping design", "pressure washing", "seasonal cleanup"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Evergrow Landscaping | Professional Landscaping Services | Residential and Commercial",
    description: "Professional Landscaping Services in Arkansas and Oklahoma. Lawncare, Landscaping, Seasonal Cleanups, Pressure Washing",
    url: "https://evergrowlandscaping.com",
    siteName: "Evergrow Landscaping",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/logo-icon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <ToastProvider>
          <AuthProvider>
            <LayoutShell>
              {children}
            </LayoutShell>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
