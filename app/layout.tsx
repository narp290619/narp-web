import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

import { siteConfig } from "@/config/site";

import { AuthProvider } from "@/providers/AuthProvider";

import ScrollProgress from "@/components/layout/ScrollProgress";
import Footer from "@/components/marketing/footer/Footer";
import Navbar from "@/components/marketing/navbar/Navbar";
import AppProviders from "@/components/maps/providers/AppProviders";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html lang="en">

      <body className={geist.className}>

        <AuthProvider>

          <ScrollProgress />

          <Navbar />

          <main className="min-h-screen">

            <AppProviders>

              {children}

            </AppProviders>

          </main>

          <Footer />

        </AuthProvider>

      </body>

    </html>

  );

}