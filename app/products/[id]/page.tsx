import Image from "next/image"
import { notFound } from "next/navigation"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { products } from "@/lib/products"
import AddToCartButton from "@/components/add-to-cart-button"

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold mt-2">${product.price.toFixed(2)}</p>
          </div>

          <div>
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <div>
            <h2 className="font-medium mb-2">Size</h2>
            <div className="flex flex-wrap gap-2">
              {["S", "M", "L", "XL"].map((size) => (
                <Button key={size} variant="outline" className="h-10 w-10">
                  {size}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-medium mb-2">Quantity</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">1</span>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AddToCartButton product={product} />

          <div className="border-t pt-6 mt-6">
            <h2 className="font-medium mb-2">Details</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Material: 100% Cotton</li>
              <li>Made in USA</li>
              <li>Machine washable</li>
              <li>Free shipping on orders over $50</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
