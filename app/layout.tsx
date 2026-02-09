import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Evergrow Landscaping | Professional Lawn Care in El Dorado & OKC",
  description: "Professional landscaping services in El Dorado and Oklahoma City. Lawn care, flower beds, seasonal cleanup, and pressure washing with transparent pricing.",
  keywords: ["landscaping", "lawn care", "El Dorado OK", "Oklahoma City", "flower beds", "pressure washing", "seasonal cleanup"],
  openGraph: {
    title: "Evergrow Landscaping | Professional Lawn Care in El Dorado & OKC",
    description: "Professional landscaping services in El Dorado and Oklahoma City",
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
