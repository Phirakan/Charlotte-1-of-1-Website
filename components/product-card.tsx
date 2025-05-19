import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import AddToCartButton from "./add-to-cart-button"

export default function ProductCard({ product }: { product: Product }) {
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
          <AddToCartButton product={product} variant="outline" size="sm" />
        </div>
      </div>
    </div>
  )
}
