import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "PolyMerit | Prediction Market Analytics",
  description: "Enterprise-grade analytics and insights for Polymarket traders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-colors flex flex-col">
        <ThemeProvider>
          <NavBar />
          <main className="flex-1 min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
