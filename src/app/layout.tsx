import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import FloatingIconBar from "@/components/navigation/FloatingIconBar";
import { Toaster } from "react-hot-toast";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Vibeo - Where moments matter",
  description:
    "A next-generation social media platform merging camera-first experiences with community building.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-dark text-text-primary`}>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1A1F3A",
              color: "#F5F5F5",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <FloatingIconBar />
      </body>
    </html>
  );
}
