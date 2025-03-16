import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import Navbar from '@/components/navbar';
import MobileNav from '@/components/mobile-nav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FreshMart - Online Supermarket',
  description: 'Your one-stop shop for fresh groceries and daily essentials',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Navbar />
            <main className="pb-16 md:pb-0">{children}</main>
            <MobileNav />
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}