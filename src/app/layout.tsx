import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ServiceRequestProvider } from "@/contexts/ServiceRequestContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Local Services - Home Service Provider",
  description: "Connect with trusted home service providers for plumbing, cleaning, electrical, and more.",
  keywords: "home services, plumbing, cleaning, electrical, pool maintenance, house sitting, errands, delivery",
  openGraph: {
    title: "Local Services - Home Service Provider",
    description: "Connect with trusted home service providers for plumbing, cleaning, electrical, and more.",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ServiceRequestProvider>
          {children}
        </ServiceRequestProvider>
      </body>
    </html>
  );
}
