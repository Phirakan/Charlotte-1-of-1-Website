"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { cartApi } from '@/lib/api';
import { useAuth } from "@/app/context/AuthContext";
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // ดึงข้อมูลตะกร้าเมื่อ login สำเร็จ
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      loadCartFromLocalStorage();
    }
  }, [isAuthenticated]);

  // บันทึกตะกร้าใน localStorage สำหรับผู้ที่ไม่ได้ login
  useEffect(() => {
    if (!isAuthenticated && cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();
      setCart(response.data.cart.items);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Could not fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  };

  const addToCart = async (product: Product) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // ส่งไปยัง API
        await cartApi.addToCart(product.id, 1);
        await fetchCart(); // ดึงข้อมูลตะกร้าที่อัปเดตแล้ว
      } else {
        // จัดการในเบราว์เซอร์
        setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.product.id === product.id);

          if (existingItem) {
            return prevCart.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
            );
          } else {
            return [...prevCart, { id: Date.now(), product, quantity: 1 }];
          }
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        // หาค่า item ID ในตะกร้า
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
          await cartApi.removeFromCart(cartItem.id.toString());
          await fetchCart();
        }
      } else {
        setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      if (quantity < 1) {
        return removeFromCart(productId);
      }

      if (isAuthenticated) {
        // หาค่า item ID ในตะกร้า
        const cartItem = cart.find(item => item.product.id === productId);
        if (cartItem) {
          await cartApi.updateCartItem(cartItem.id.toString(), quantity);
          await fetchCart();
        }
      } else {
        setCart((prevCart) => 
          prevCart.map((item) => 
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update cart');
      console.error('Error updating cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isAuthenticated) {
        await cartApi.clearCart();
        setCart([]);
      } else {
        setCart([]);
        localStorage.removeItem("cart");
      }
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
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        loading,
        error
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