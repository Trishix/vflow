import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';
import "./globals.css";
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: "VFLOW",
  description:
    "VFLOW is a node-based AI workflow builder for creating reusable tasks with drag-and-drop nodes, chained AI operations, and your own API keys. It runs in the browser and keeps your data local.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
