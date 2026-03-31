import type { Metadata } from "next";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Evergrow Landscaping | Professional Landscaping Services | Residential and Commercial",
    template: `%s | ${SITE_NAME}`,
  },
  description: "Professional Landscaping Services in Arkansas and Oklahoma. Lawncare, Landscaping, Seasonal Cleanups, Pressure Washing",
  keywords: ["landscaping", "lawn care", "Arkansas", "Oklahoma", "landscaping design", "pressure washing", "seasonal cleanup"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/images/logo-icon.svg",
  },
  openGraph: {
    title: "Evergrow Landscaping | Professional Landscaping Services | Residential and Commercial",
    description: "Professional Landscaping Services in Arkansas and Oklahoma. Lawncare, Landscaping, Seasonal Cleanups, Pressure Washing",
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evergrow Landscaping | Professional Landscaping Services | Residential and Commercial",
    description: "Professional Landscaping Services in Arkansas and Oklahoma. Lawncare, Landscaping, Seasonal Cleanups, Pressure Washing",
    images: [DEFAULT_OG_IMAGE],
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
