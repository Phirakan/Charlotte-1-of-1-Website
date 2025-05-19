// lib/products.ts
import { Product, Size, ProductSize } from './types';

// Export an empty array as the default products
export const products: Product[] = [];

// Function to fetch all available sizes
export async function fetchSizes(): Promise<Size[]> {
  try {
    const response = await fetch('http://127.0.0.1:8080/sizes', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && Array.isArray(data.sizes)) {
      return data.sizes;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

// Function to fetch products from the API
export async function fetchProducts(): Promise<Product[]> {
  try {
    console.log('Fetching products from API...');
    const response = await fetch('http://127.0.0.1:8080/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API response data:', data);
    
    // API returns { products: [...] }
    if (data && Array.isArray(data.products)) {
      // Transform the API response to match our expected Product interface
      return data.products.map((item: any) => ({
        id: String(item.id), // Convert number to string
        name: item.name,
        price: parseFloat(item.price) || 0, // Ensure price is a number
        description: item.description || '',
        // Use placeholder image since API doesn't provide images
        image: "/placeholder.svg?height=300&width=300",
        // Set a default category since API doesn't provide one
        category: "clothing",
        // Add size information
        sizes: Array.isArray(item.sizes) ? item.sizes.map((size: any) => ({
          size_id: size.size_id,
          size_name: size.size_name,
          stock: size.stock
        })) : [],
        // Add any other fields needed
        stock: item.stock || 0
      }));
    }
    
    // If data exists but isn't in the expected format, log it and return empty array
    console.error('Unexpected data format:', data);
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Function to fetch a single product by ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    console.log(`Fetching product with ID ${id}...`);
    const response = await fetch(`http://127.0.0.1:8080/products/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Product data:', data);
    
    // API might return { product: {...} }
    let productData = data;
    if (data && data.product) {
      productData = data.product;
    }
    
    // Transform the API response to match our expected Product interface
    if (productData && typeof productData === 'object') {
      return {
        id: String(productData.id), // Convert number to string
        name: productData.name || '',
        price: parseFloat(productData.price) || 0,
        description: productData.description || '',
        // Use placeholder image since API doesn't provide images
        image: "/placeholder.svg?height=300&width=300",
        // Set a default category since API doesn't provide one
        category: "clothing",
        // Add size information
        sizes: Array.isArray(productData.sizes) ? productData.sizes.map((size: any) => ({
          size_id: size.size_id,
          size_name: size.size_name,
          stock: size.stock
        })) : [],
        // Add any other fields needed
        stock: productData.stock || 0
      };
    }
    
    console.error('Unexpected product data format:', data);
    return null;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}