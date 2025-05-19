"use client"
import { useEffect, useState } from 'react';
import { productApi } from '@/lib/api';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/Loading-spinner';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [sort, setSort] = useState<string>('featured');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredProducts = [...products];
    
    // Category filter
    if (categoryFilter !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category === categoryFilter
      );
    }
    
    // Price range filter
    if (priceMin) {
      filteredProducts = filteredProducts.filter(
        product => product.price >= parseFloat(priceMin)
      );
    }
    
    if (priceMax) {
      filteredProducts = filteredProducts.filter(
        product => product.price <= parseFloat(priceMax)
      );
    }
    
    // Sort products
    switch (sort) {
      case 'price-low':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // ในกรณีที่มีฟิลด์วันที่สร้าง ให้เรียงตามนั้น
        // สำหรับตัวอย่างนี้จะไม่ได้ทำการเรียงลำดับ
        break;
      default:
        // 'featured' - ใช้ลำดับเดิม
        break;
    }
    
    return filteredProducts;
  };

  const displayProducts = applyFilters();
  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
          <Button onClick={fetchProducts} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id={`category-${category}`} 
                      name="category"
                      className="h-4 w-4" 
                      checked={categoryFilter === category}
                      onChange={() => setCategoryFilter(category)}
                    />
                    <label htmlFor={`category-${category}`} className="text-sm capitalize">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  type="number" 
                  placeholder="Min" 
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                />
                <Input 
                  type="number" 
                  placeholder="Max" 
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                />
              </div>
            </div>

            <Button 
              onClick={() => {
                // Reset filters
                setCategoryFilter('all');
                setPriceMin('');
                setPriceMax('');
              }} 
              variant="outline" 
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500">{displayProducts.length} products</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Sort by:</span>
              <Select value={sort} onValueChange={setSort}>
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

          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
