'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Menu,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant={pathname === link.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link href={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar for desktop */}
        <aside className="hidden lg:block w-64 shrink-0 border-r h-screen sticky top-0">
          <ScrollArea className="h-full py-6">
            <SidebarContent />
          </ScrollArea>
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden fixed left-4 top-4 z-40"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 min-h-screen">
          <div className="container max-w-7xl py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}