"use client";

import { ShoppingCart, User, Search, Menu, Bell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useGetUserQuery, useLogoutMutation } from "@/lib/api/authApi";
import { useLazySearchProductsQuery } from "@/lib/api/productApi";
import { useGetCartQuery } from "@/lib/api/cartApi";  

export default function Navbar() {
  const { data: user, isLoading: isUserLoading } = useGetUserQuery({});
  const [logout] = useLogoutMutation();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: cart, isLoading: isCartLoading } = useGetCartQuery();

  const totalItemsInCart =
    Array.isArray(cart?.items) && cart.items.length > 0
      ? cart.items.reduce(
          (total: number, item: { quantity: number }) => total + item.quantity,
          0
        )
      : 0;


  const [triggerSearch, { data: searchResults = [], isFetching }] =
    useLazySearchProductsQuery();

  useEffect(() => {
    if (searchQuery) {
      triggerSearch(searchQuery); 
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchQuery, triggerSearch]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">FreshMart</span>
            </Link>
          </div>


          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
              />

              {showResults && searchQuery && (
                <Card className="absolute mt-2 w-full z-50 max-h-[400px] overflow-auto">
                  <div className="p-2">
                    {isFetching ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Loading...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((product: any) => (
                        <Link
                          key={product.id}
                          href={`/products/${product.id}`}
                          onClick={() => setShowResults(false)}
                        >
                          <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                            <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No products found
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </div>

    
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {!isCartLoading && totalItemsInCart > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                    {totalItemsInCart}
                  </span>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white">
                2
              </span>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.avatar || ""}
                        alt={user.name || ""}
                      />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="w-full">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="w-full">
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist" className="w-full">
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={async () => {
                      await logout({});
                      localStorage.removeItem("access");
                      localStorage.removeItem("refresh");
                      window.location.href = "/login";
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="w-full">
                      Sign Up
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {}
      <div className="md:hidden px-4 py-2 border-t">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
          />
          {showResults && searchQuery && (
            <Card className="absolute mt-2 w-full z-50 max-h-[400px] overflow-auto">
              <div className="p-2">
                {isFetching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Loading...
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((product: any) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setShowResults(false)}
                    >
                      <div className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${product.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No products found
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </nav>
  );
}
