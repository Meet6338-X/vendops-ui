"use client";

import "./globals.css";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ToastProvider } from "@/components/layout/toast-stack";
import { initMocks } from "@/mocks/browser";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  useEffect(() => {
    initMocks();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#09090B] font-sans text-zinc-100 antialiased selection:bg-blue-500/20 selection:text-blue-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryClientProvider client={queryClient}>
            <ToastProvider>
              <div className="flex min-h-screen">
                {/* Persistent Sidebar */}
                <Sidebar />

                {/* Main Content Workspace */}
                <div className="flex-1 flex flex-col min-w-0">
                  <Header />
                  <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                  </main>
                </div>
              </div>
            </ToastProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
