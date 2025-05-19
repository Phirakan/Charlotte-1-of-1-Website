"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/app/context/AuthContext"
import { fetchProductById } from "@/lib/products"
import { Product, ProductSize } from "@/lib/types"
import LoadingSpinner from "@/components/ui/Loading-spinner"
import { useAlert } from "@/app/hooks/useAlert"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const { addToCart, loading: cartLoading } = useCart()
  const { isAuthenticated } = useAuth() || { isAuthenticated: false }
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const productId = params.id
  const { showSuccess, showError } = useAlert()

  
useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        // ใช้ productId ที่เก็บไว้แล้วในตัวแปร แทนที่จะใช้ params.id โดยตรง
        const productData = await fetchProductById(productId)
        
        console.log("Product data loaded:", productData) // เพิ่ม log ข้อมูลสินค้า
        
        if (!productData) {
          notFound()
        }
        setProduct(productData)
        
        // Check sizes data
        console.log("Product sizes:", productData?.sizes)
        
        // If product has sizes, select the first available size by default
        if (productData?.sizes && productData.sizes.length > 0) {
          // Find the first size with stock > 0
          const availableSize = productData.sizes.find(size => size.stock > 0)
          if (availableSize) {
            console.log("Setting default size:", availableSize)
            setSelectedSize(availableSize)
          }
        }
      } catch (err) {
        console.error("Error loading product:", err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId])

useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        // ใช้ productId ที่เก็บไว้แล้วในตัวแปร แทนที่จะใช้ params.id โดยตรง
        const productData = await fetchProductById(productId)
        
        console.log("Product data loaded:", productData) // เพิ่ม log ข้อมูลสินค้า
        
        if (!productData) {
          notFound()
        }
        setProduct(productData)
        
        // Check sizes data
        console.log("Product sizes:", productData?.sizes)
        
        // If product has sizes, select the first available size by default
        if (productData?.sizes && productData.sizes.length > 0) {
          // Find the first size with stock > 0
          const availableSize = productData.sizes.find(size => size.stock > 0)
          if (availableSize) {
            console.log("Setting default size:", availableSize)
            setSelectedSize(availableSize)
          }
        }
      } catch (err) {
        console.error("Error loading product:", err)
        setError("Failed to load product details")
      } finally {
        setLoading(false)
      }
    }
    
    loadProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex items-center justify-center h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex flex-col items-center justify-center h-[60vh]">
        <p className="text-red-500 mb-4">{error || "Product not found"}</p>
        <Button onClick={() => router.push("/products")}>Back to Products</Button>
      </div>
    )
  }

  const increaseQuantity = () => {
    if (selectedSize && quantity < selectedSize.stock) {
      setQuantity(prev => prev + 1)
    } else if (!selectedSize && product.stock && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      // If product has sizes but none selected, show an error
      alert("Please select a size before adding to cart");
      return;
    }
    
    try {
      setIsAdding(true)
      
      // Create a modified product with selected size information
      const productToAdd = {
        ...product,
        selectedSize: selectedSize ? selectedSize.size_name : null
      };
      
      // This will redirect to login if not authenticated
      await addToCart(productToAdd)
      
      // Show confirmation
      showSuccess(`${product.name} (${selectedSize ? selectedSize.size_name : ''}) added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Failed to add product to cart. Please try again."); 
    } finally {
      setIsAdding(false);
    }
  }
  
  // Check if selected size or product is out of stock
  const isOutOfStock = selectedSize 
    ? selectedSize.stock <= 0 
    : (!product.stock || product.stock <= 0);

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

          {/* Sizes Section */}
          {product.sizes && product.sizes.length > 0 && (
           <div>
             <h2 className="font-medium mb-2">Size</h2>
              <div className="flex flex-wrap gap-2">
               {product.sizes.map((size) => (
                 <Button 
                    key={size.size_id} 
                     variant={selectedSize?.size_id === size.size_id ? "default" : "outline"} 
                     className={`h-10 w-10 ${size.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => size.stock > 0 && setSelectedSize(size)}
                   disabled={size.stock <= 0}
                 >
                   {size.size_name}
                 </Button>
               ))}
             </div>
             {selectedSize && (
               <p className="text-sm text-gray-500 mt-2">
                 {selectedSize.stock > 0 
                   ? `${selectedSize.stock} in stock` 
                   : 'Out of stock'}
                </p>
             )}
             </div>
          )}

          <div>
            <h2 className="font-medium mb-2">Quantity</h2>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10" 
                onClick={increaseQuantity}
                disabled={isOutOfStock || (selectedSize ? quantity >= selectedSize.stock : (product.stock ? quantity >= product.stock : true))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleAddToCart} 
            disabled={isAdding || cartLoading || isOutOfStock}
            className="mt-6"
          >
            {isOutOfStock 
              ? "Out of Stock" 
              : isAdding 
                ? "Adding to Cart..." 
                : "Add to Cart"}
          </Button>

          <div className="border-t pt-6 mt-6">
            <h2 className="font-medium mb-2">Details</h2>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Material: 100% Cotton</li>
              <li>Made in Thailand</li>
              <li>Machine washable</li>
              <li>Free shipping on orders over ฿1,000</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
