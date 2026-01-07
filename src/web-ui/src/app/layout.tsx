import type { Metadata } from "next";
import { Inter, PT_Mono, Caveat } from "next/font/google";
import { Suspense } from "react";
import { AuthProvider } from "@/contexts/auth";
import { Navigation } from "@/components/Navigation";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const caveat = Caveat({
      variable: "--font-caveat",
      subsets: ["latin"]
});

const ptMono = PT_Mono({
  variable: "--font-pt-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "naglasúpan",
  description: "All great things start small",
  openGraph: {
    title: "naglasúpan",
    description: "All great things start small",
    images: [
      {
        url: "/naglasupan.png",
        width: 595,
        height: 539,
        alt: "naglasúpan",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "naglasúpan",
    description: "All great things start small",
    images: ["/naglasupan.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${caveat.variable} ${ptMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense>
            <Navigation />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
