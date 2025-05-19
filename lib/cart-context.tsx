"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { cartApi } from '@/lib/api';
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import type { Product } from "./types"

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loading: boolean;
  error: string | null;
  requireLogin: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth() || { isAuthenticated: false };
  const router = useRouter();

  // Fetch cart data when logged in
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart([]);
    }
  }, [isAuthenticated]);

  const requireLogin = () => {
    if (!isAuthenticated) {
      router.push("/login?returnTo=" + encodeURIComponent(window.location.pathname));
      return false;
    }
    return true;
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();
      if (response && response.data && response.data.cart && Array.isArray(response.data.cart.items)) {
        setCart(response.data.cart.items);
      } else {
        setCart([]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not fetch cart');
      console.error('Error fetching cart:', err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    if (!requireLogin()) return;
    
    try {
      setLoading(true);
      setError(null);
      await cartApi.addToCart(product.id, 1);
      await fetchCart();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!requireLogin()) return;
    
    try {
      setLoading(true);
      setError(null);
      const cartItem = Array.isArray(cart) ? cart.find(item => item.product.id === productId) : undefined;
      if (cartItem) {
        await cartApi.removeFromCart(cartItem.id.toString());
        await fetchCart();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!requireLogin()) return;
    
    try {
      setLoading(true);
      setError(null);

      if (quantity < 1) {
        return removeFromCart(productId);
      }

      const cartItem = Array.isArray(cart) ? cart.find(item => item.product.id === productId) : undefined;
      if (cartItem) {
        await cartApi.updateCartItem(cartItem.id.toString(), quantity);
        await fetchCart();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update cart');
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!requireLogin()) return;
    
    try {
      setLoading(true);
      setError(null);
      await cartApi.clearCart();
      setCart([]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart: Array.isArray(cart) ? cart : [],
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        loading,
        error,
        requireLogin
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}