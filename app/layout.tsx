import type { Metadata } from "next";
import { Open_Sans, Lato } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainLayout from "@/components/layout/MainLayout";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

const openSans = Open_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

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
      <body
        className={`${openSans.variable} ${lato.variable} antialiased flex flex-col min-h-screen`}
      >
        <ToastProvider>
          <AuthProvider>
            <Header />
            <MainLayout>
              {children}
            </MainLayout>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
