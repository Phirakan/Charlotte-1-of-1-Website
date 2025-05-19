// app/admin/products/[id]/sizes/page.tsx
"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetchSizes, fetchProductById } from '@/lib/products'
import { Size, ProductSize, Product } from '@/lib/types'
import LoadingSpinner from '@/components/ui/Loading-spinner'

export default function ProductSizesPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [availableSizes, setAvailableSizes] = useState<Size[]>([])
  const [productSizes, setProductSizes] = useState<ProductSize[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stockInputs, setStockInputs] = useState<Record<number, number>>({})
  const router = useRouter()

  useEffect(() => {
    loadProductAndSizes()
  }, [params.id])

  const loadProductAndSizes = async () => {
    try {
      setLoading(true)
      
      // Load product data
      const productData = await fetchProductById(params.id)
      if (!productData) {
        setError('Product not found')
        return
      }
      setProduct(productData)
      
      // Load all available sizes
      const sizesData = await fetchSizes()
      setAvailableSizes(sizesData)
      
      // Initialize stock inputs based on current product sizes
      const initialStockInputs: Record<number, number> = {}
      if (productData.sizes) {
        setProductSizes(productData.sizes)
        productData.sizes.forEach(size => {
          initialStockInputs[size.size_id] = size.stock
        })
      }
      setStockInputs(initialStockInputs)
      
      setError(null)
    } catch (err) {
      console.error('Error loading data:', err)
      setError('Failed to load product or sizes')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!product) return
    
    try {
      setSaving(true)
      setError(null)
      
      // Convert stock inputs to array of size objects
      const sizeUpdates = Object.entries(stockInputs).map(([sizeId, stock]) => ({
        size_id: parseInt(sizeId),
        stock: stock
      }))
      
      const token = localStorage.getItem('token')
      const response = await fetch(`http://127.0.0.1:8080/products/${params.id}/sizes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sizeUpdates)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update product sizes: ${response.status}`)
      }
      
      // Reload product data to reflect changes
      await loadProductAndSizes()
      
      alert('Product sizes updated successfully!')
    } catch (err: any) {
      console.error('Error updating product sizes:', err)
      setError(err.message || 'Failed to update product sizes')
    } finally {
      setSaving(false)
    }
  }

  const handleStockChange = (sizeId: number, value: string) => {
    const stock = parseInt(value) || 0
    setStockInputs({
      ...stockInputs,
      [sizeId]: stock >= 0 ? stock : 0
    })
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error || 'Product not found'}</p>
          <Button onClick={() => router.push('/admin/products')} className="mt-4">
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Sizes for {product.name}</h1>
        <Button onClick={() => router.push('/admin/products')} variant="outline">
          Back to Products
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Product Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Set the stock quantity for each size. Set stock to 0 for sizes that are not available.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Size</th>
                    <th className="text-left py-2 px-4">Stock</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {availableSizes.map((size) => {
                    const stock = stockInputs[size.id] || 0
                    
                    return (
                      <tr key={size.id} className="border-b">
                        <td className="py-2 px-4">{size.name}</td>
                        <td className="py-2 px-4 w-32">
                          <Input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => handleStockChange(size.id, e.target.value)}
                          />
                        </td>
                        <td className="py-2 px-4">
                          {stock > 0 ? (
                            <span className="text-green-500">In Stock</span>
                          ) : (
                            <span className="text-gray-500">Not Available</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? <LoadingSpinner /> : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}