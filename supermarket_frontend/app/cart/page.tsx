"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "@/lib/api/cartApi"; // Import the API hooks
import { CartItem, CartResponse } from "@/types/Categories"; // Import centralized types

export default function CartPage() {
  const [promoCode, setPromoCode] = useState("");
  const { data: cartData, isLoading, isError } = useGetCartQuery(undefined); 
  const [addToCart] = useAddToCartMutation(); 
  const [removeFromCart] = useRemoveFromCartMutation(); 
  const [updateCartItem] = useUpdateCartItemMutation(); 

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 text-center">
        <p className="text-red-500">
          An error occurred while fetching the cart.
        </p>
      </div>
    );
  }
  const cartItems: CartItem[] = cartData?.items || [];
  const totalCartPrice: number = cartData?.total_cart_price || 0;

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    console.log(
      "Updating quantity for item:",
      itemId,
      "New quantity:",
      newQuantity
    );

    try {
      if (newQuantity > 0) {
        const cartItem = cartItems.find((item) => item.id === itemId);
        if (!cartItem) {
          console.error("Cart item not found for ID:", itemId);
          return;
        }
        await updateCartItem({
          cart_item_id: cartItem.id,
          quantity: newQuantity,
        });
      } else {
        const cartItem = cartItems.find((item) => item.id === itemId);
        if (cartItem) {
          await removeFromCart(cartItem.id);
        }
      }
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.total_price,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto text-center px-4">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link href="/categories">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <ScrollArea className="h-[480px] p-6">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => updateQuantity(item.id, 0)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="flex items-center mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="mx-4 w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-auto">
                          <span className="text-lg font-semibold">
                            ${item.total_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {promoCode && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${(subtotal * 0.2).toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>
                    ${(promoCode ? subtotal * 0.8 : subtotal).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <Button variant="outline">Apply</Button>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link
                    href="/checkout"
                    className="flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="text-sm text-gray-500">
                <p>Free shipping on orders over $50</p>
                <p>30-day easy returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
