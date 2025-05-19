"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/app/context/AuthContext"
import type { Product } from "@/lib/types"
import { useAlert } from "@/app/hooks/useAlert"

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth() || { isAuthenticated: false };
  const [isAdding, setIsAdding] = useState(false);
  const { showSuccess, showError } = useAlert(); // เพิ่มบรรทัดนี้

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    
    try {
      setIsAdding(true);
      await addToCart(product);
      
      // แสดง SweetAlert แทน toast
      showSuccess(`${product.name} has been added to your cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      
      // แสดงข้อความเมื่อเกิดข้อผิดพลาด
      showError("Could not add item to cart. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border">
      <Link href={`/products/${product.id}`} className="block aspect-square overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          <Button 
            onClick={handleAddToCart} 
            variant="outline" 
            size="sm"
            disabled={isAdding || loading}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            {isAdding ? "Adding..." : "Add"}
          </Button>
        </div>
      </div>
    </div>
  )
}