"use client"

import React, { useState } from 'react';
import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth() || { isAuthenticated: false };
  const router = useRouter();
  
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?returnTo=/cart");
      return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setSubtotal(total);
  }, [cart, isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (cart.length === 0) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {/* Cart Items */}
          <div className="border rounded-lg overflow-hidden">
            <div className="hidden md:grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium">
              <div className="col-span-2">Product</div>
              <div>Size</div> {/* Added Size column */}
              <div>Price</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>

            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2 flex items-center space-x-4">
                    <div className="relative h-20 w-20 rounded overflow-hidden bg-gray-100">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{item.product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id.toString())}
                        className="text-sm text-red-500 flex items-center mt-1"
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Size Column */}
                  <div className="text-gray-600">
                    <span className="md:hidden font-medium mr-2">Size:</span>
                    {getItemSize(item)}
                  </div>

                  <div className="text-gray-600">
                    <span className="md:hidden font-medium mr-2">Price:</span>${item.product.price.toFixed(2)}
                  </div>

                  <div>
                    <span className="md:hidden font-medium mr-2">Quantity:</span>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id.toString(), Number.parseInt(e.target.value))}
                      className="w-20"
                    />
                  </div>

                  <div className="font-medium">
                    <span className="md:hidden font-medium mr-2">Total:</span>$
                    {(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={clearCart}>
              Clear Cart
            </Button>
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 h-fit space-y-4">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper function to get the size name from cart item
function getItemSize(item: any) {
  // Check if the item has a direct size property
  if (item.size_name) {
    return item.size_name;
  }
  
  // Check if the size is stored in a size_id property
  if (item.size_id) {
    // You might need to fetch the size name from the size_id
    // This is a placeholder, replace with actual implementation if needed
    return `Size ID: ${item.size_id}`;
  }
  
  // Check product for size information
  if (item.product) {
    // If the product has a selectedSize property
    if (item.product.selectedSize) {
      return item.product.selectedSize;
    }
    
    // If the product stores size in selectedSizeId
    if (item.product.selectedSizeId && item.product.sizes) {
      const size = item.product.sizes.find(
        (s: any) => s.size_id === item.product.selectedSizeId
      );
      if (size) {
        return size.size_name;
      }
    }
  }
  
  // If no size information is found
  return "N/A";
}