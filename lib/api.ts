// lib/api.ts
import axios from 'axios';

// สร้าง axios instance สำหรับเรียกใช้ API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

// เพิ่ม interceptor สำหรับแนบ token ในทุก request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  register: (userData: RegisterFormData) => api.post('/register', userData),
  login: (credentials: LoginFormData) => api.post('/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Products APIs
export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
};

// Cart APIs
export const cartApi = {
getCart: () => api.get('/cart'),
  addToCart: (productId: number, quantity: number, sizeId?: number) => {
    const payload: any = { 
      product_id: productId, 
      quantity
    };
    
    // Only include size_id if it's provided
    if (sizeId !== undefined) {
      payload.size_id = sizeId;
    }
    
    return api.post('/cart/items', payload);
  },
  updateCartItem: (itemId: string, quantity: number) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId: string) => 
    api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Shipping APIs
export const shippingApi = {
  getAddresses: () => api.get('/shipping-addresses'),
  getAddress: (id: string) => api.get(`/shipping-addresses/${id}`),
  addAddress: (address: ShippingAddressInput) => 
    api.post('/shipping-addresses', address),
  updateAddress: (id: string, address: ShippingAddressInput) => 
    api.put(`/shipping-addresses/${id}`, address),
  deleteAddress: (id: string) => 
    api.delete(`/shipping-addresses/${id}`),
};

// Order APIs
export const orderApi = {
  checkout: (checkoutData: CheckoutFormData) => 
    api.post('/checkout', checkoutData),
  getOrders: () => api.get('/orders'),
  getOrderDetails: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.post(`/orders/${id}/cancel`),
};

// Types
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface ShippingAddressInput {
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface CheckoutFormData {
  shipping_address_id?: number;
  shipping_address?: ShippingAddressInput;
}

export default api;