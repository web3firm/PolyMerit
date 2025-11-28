import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/components/AuthProvider";

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
      <body className="min-h-screen font-sans antialiased transition-colors flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <NavBar />
            <main className="flex-1 min-h-screen">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
