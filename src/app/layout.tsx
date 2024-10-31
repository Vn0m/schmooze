import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpotifyAuthProvider } from "@/context/SpotifyAuthContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Schmooze",
  description: "Music app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider >
    <SpotifyAuthProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </SpotifyAuthProvider>
    </AuthProvider>
  );
}
