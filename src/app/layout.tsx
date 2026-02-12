import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const ptSans = localFont({
  src: [
    {
      path: "../assets/fonts/MicrosoftSansSerif.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "SWAELCO Elevators",
    template: "%s | SWAELCO",
  },
  description:
    "Elevator installation and modernization platform with customer portal and internal operations dashboard.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${ptSans.variable} min-h-screen bg-background font-sans text-foreground`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
