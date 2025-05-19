"use client"

import type { ComponentProps } from "react"
import type { VariantProps } from "class-variance-authority"
import type { buttonVariants } from "@/components/ui/button"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/types"
import { ShoppingCart } from "lucide-react" // Declaring the ShoppingCart variable

interface AddToCartButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  product: Product
  asChild?: boolean
}

export default function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <Button onClick={handleAddToCart} {...props}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}
