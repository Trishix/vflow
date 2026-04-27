import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';
import { Outfit } from 'next/font/google';
import "./globals.css";
import { Toaster } from 'sonner';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: "VFlow | AI Workflow Builder",
  description:
    "VFLOW is a node-based AI workflow builder for creating reusable tasks with drag-and-drop nodes, chained AI operations, and your own API keys. It runs in the browser and keeps your data local.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body className="antialiased font-sans">
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
