import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "krí1.is - Icelandic Side Projects",
  description: "A place to share and discover side projects built in Iceland.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <LanguageProvider>
          <ThemeProvider>
            <AppProvider>
              <Header />
              <main>{children}</main>
            </AppProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
