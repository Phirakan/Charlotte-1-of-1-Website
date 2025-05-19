import { products } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="w-full md:w-64 space-y-4">
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold text-lg">Filters</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Category</h3>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="category-clothing" className="h-4 w-4" />
                  <label htmlFor="category-clothing" className="text-sm">
                    Clothing
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="category-accessories" className="h-4 w-4" />
                  <label htmlFor="category-accessories" className="text-sm">
                    Accessories
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="category-footwear" className="h-4 w-4" />
                  <label htmlFor="category-footwear" className="text-sm">
                    Footwear
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" placeholder="Min" />
                <Input type="number" placeholder="Max" />
              </div>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{products.length} products</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
