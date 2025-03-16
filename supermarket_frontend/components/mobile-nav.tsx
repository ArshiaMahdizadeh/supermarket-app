'use client';

import { Home, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="md:hidden bottom-nav">
      <Link
        href="/"
        className={`bottom-nav-item ${
          isActive('/') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </Link>

      <Link
        href="/search"
        className={`bottom-nav-item ${
          isActive('/search') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <Search className="h-6 w-6" />
        <span className="text-xs mt-1">Search</span>
      </Link>

      <Link
        href="/cart"
        className={`bottom-nav-item ${
          isActive('/cart') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          <span className="cart-badge">3</span>
        </div>
        <span className="text-xs mt-1">Cart</span>
      </Link>

      <Link
        href="/account"
        className={`bottom-nav-item ${
          isActive('/account') ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Account</span>
      </Link>
    </nav>
  );
}