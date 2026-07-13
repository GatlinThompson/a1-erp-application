import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "A1 Inventory Management System",
  description: "A1 Inventory Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
