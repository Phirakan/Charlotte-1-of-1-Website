import Link from "next/link"

import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { products } from "@/lib/products"

export default function Home() {
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 "
          style={{
            backgroundImage: "url('/charrlott.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
          }}
        ></div>

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        <div className="container px-4 md:px-6 relative z-20">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                Charlotte 1 of 1
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                This is my e-commerce demo website by Phirakan Khongpheat.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/products">
                <Button size="lg">Shop Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Featured Products</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our most popular T-shirt for you.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Join Our Newsletter</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <form className="flex space-x-2">
                <input
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your email"
                  type="email"
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
