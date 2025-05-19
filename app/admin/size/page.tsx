// app/admin/sizes/page.tsx
"use client"
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchSizes } from '@/lib/products'
import { Size } from '@/lib/types'
import LoadingSpinner from '@/components/ui/Loading-spinner'

export default function SizesManagementPage() {
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newSize, setNewSize] = useState({ name: '', display_order: 0 })
  const [editingSize, setEditingSize] = useState<Size | null>(null)
  
  useEffect(() => {
    loadSizes()
  }, [])
  
  const loadSizes = async () => {
    try {
      setLoading(true)
      const sizesData = await fetchSizes()
      setSizes(sizesData)
      setError(null)
    } catch (err) {
      console.error('Error loading sizes:', err)
      setError('Failed to load sizes')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateSize = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://127.0.0.1:8080/admin/sizes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSize)
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create size: ${response.status}`)
      }
      
      setNewSize({ name: '', display_order: 0 })
      loadSizes()
    } catch (err) {
      console.error('Error creating size:', err)
      setError('Failed to create size')
    }
  }
  
  const handleUpdateSize = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingSize) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://127.0.0.1:8080/admin/sizes/${editingSize.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingSize.name,
          display_order: editingSize.display_order
        })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update size: ${response.status}`)
      }
      
      setEditingSize(null)
      loadSizes()
    } catch (err) {
      console.error('Error updating size:', err)
      setError('Failed to update size')
    }
  }
  
  const handleDeleteSize = async (sizeId: number) => {
    if (!confirm('Are you sure you want to delete this size? This cannot be undone.')) {
      return
    }
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://127.0.0.1:8080/admin/sizes/${sizeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete size: ${response.status}`)
      }
      
      loadSizes()
    } catch (err: any) {
      console.error('Error deleting size:', err)
      setError(err.message || 'Failed to delete size')
    }
  }
  
  if (loading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12 flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner />
      </div>
    )
  }
  
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-3xl font-bold mb-6">Manage Sizes</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <Button onClick={loadSizes} className="mt-2">Try Again</Button>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Create New Size */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Size</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSize} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Size Name</label>
                <Input 
                  value={newSize.name}
                  onChange={(e) => setNewSize({...newSize, name: e.target.value})}
                  placeholder="e.g. S, M, L, XL"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Order</label>
                <Input 
                  type="number"
                  value={newSize.display_order}
                  onChange={(e) => setNewSize({...newSize, display_order: parseInt(e.target.value) || 0})}
                  placeholder="e.g. 1, 2, 3"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">Add Size</Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Edit Size Form */}
        {editingSize && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Size</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateSize} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size Name</label>
                  <Input 
                    value={editingSize.name}
                    onChange={(e) => setEditingSize({...editingSize, name: e.target.value})}
                    placeholder="e.g. S, M, L, XL"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Order</label>
                  <Input 
                    type="number"
                    value={editingSize.display_order}
                    onChange={(e) => setEditingSize({...editingSize, display_order: parseInt(e.target.value) || 0})}
                    placeholder="e.g. 1, 2, 3"
                    required
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button type="submit">Update Size</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingSize(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Size List */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>All Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          {sizes.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sizes found. Create your first size above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">ID</th>
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Display Order</th>
                    <th className="text-right py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size) => (
                    <tr key={size.id} className="border-b">
                      <td className="py-2 px-4">{size.id}</td>
                      <td className="py-2 px-4">{size.name}</td>
                      <td className="py-2 px-4">{size.display_order}</td>
                      <td className="py-2 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => setEditingSize(size)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteSize(size.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}