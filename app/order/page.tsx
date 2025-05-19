// pages/orders/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { orderApi } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectRoute';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/Loading-spinner';

interface Order {
  id: number;
  order_id: string;
  total_amount: number;
  status: string;
  transaction_id: string | null;
  created_at: string;
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrders();
      setOrders(response.data.orders || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
            Pending
          </span>
        );
      case 'shipped':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            Shipped
          </span>
        );
      case 'delivered':
        return (
          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
            Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
            {status}
          </span>
        );
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container px-4 py-8 md:px-6 md:py-12 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }
  
  if (error) {
    return (
      <ProtectedRoute>
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error: {error}</p>
            <Button onClick={fetchOrders} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }
  
  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">You dont have any orders yet.</p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        Order #{order.order_id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="font-medium">Payment ID</p>
                      <p className="text-gray-500 dark:text-gray-400 truncate">
                        {order.transaction_id || 'N/A'}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <Link href={`/orders/${order.order_id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}