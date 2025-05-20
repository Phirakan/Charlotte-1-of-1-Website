export interface ProductSize {
  id?: number;
  size_id: number;
  size_name: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock?: number;
  sizes?: ProductSize[];
  created_at?: string;
  updated_at?: string;
  
  // Add these for cart operationsw
  quantity?: number;
  selectedSizeId?: number;
}

export interface Size {
  id: number;
  name: string;
  display_order: number;
}