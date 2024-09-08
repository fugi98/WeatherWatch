import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Real-Time Weather Dashboard | Accurate Forecasts & Hourly Updates",
  description:
    "Get real-time weather updates with accurate hourly forecasts, current conditions, and long-term outlooks. Stay informed with our user-friendly weather dashboard tailored for cities worldwide.",
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
        {/* Explicitly casting metadata.title to a string */}
        <title>{String(metadata.title) || "Default Title"}</title>
        <meta name="description" content={metadata.description || "Default description"} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
