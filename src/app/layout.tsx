import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WeatherWatch | Real-Time Weather Updates & Forecasts",
  description:
    "WeatherWatch provides real-time weather updates, accurate hourly forecasts, and comprehensive long-term outlooks. Stay ahead of the weather with our intuitive dashboard tailored for cities worldwide. Whether you need current conditions, detailed forecasts, or global weather insights, WeatherWatch has you covered.",
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
