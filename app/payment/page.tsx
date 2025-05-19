import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProtectedRoute from '@/components/ProtectRoute';
import LoadingSpinner from '@/components/ui/Loading-spinner';

interface PaymentInfo {
  status?: string;
  amount?: number;
  qrCodeUrl?: string;
}

export default function PaymentPage() {
  const router = useRouter();
  const { orderId, transactionId } = router.query;
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  
  useEffect(() => {
    if (orderId && transactionId) {
      fetchPaymentInfo();
      
      // Set up polling to check payment status
      const intervalId = setInterval(checkPaymentStatus, 5000);
      
      return () => clearInterval(intervalId);
    }
  }, [orderId, transactionId]);
  
  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/payment/info?transactionId=${transactionId}`);
      const data = await response.json();
      
      setPaymentInfo(data);
      setPaymentStatus(data.status || 'pending');
    } catch (err) {
      console.error('Error fetching payment info:', err);
      setError('Failed to load payment information');
    } finally {
      setLoading(false);
    }
  };
  
  const checkPaymentStatus = async () => {
    try {
      const response = await fetch(`/api/payment/status/${transactionId}`);
      const data = await response.json();
      
      if (data.status !== paymentStatus) {
        setPaymentStatus(data.status);
        
        // If payment is complete, fetch full payment info again
        if (data.status === 'SUCCESS') {
          fetchPaymentInfo();
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="max-w-lg mx-auto border rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Payment Details</h1>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
              <Button onClick={fetchPaymentInfo} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-center mb-2">
                  Order ID: <span className="font-medium">{orderId}</span>
                </p>
                <p className="text-center">
                  Amount: <span className="font-medium">${paymentInfo?.amount?.toFixed(2)}</span>
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <div className={`
                    inline-flex items-center px-4 py-2 rounded-full font-medium
                    ${paymentStatus === 'SUCCESS' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED'
                      ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }
                  `}>
                    {paymentStatus === 'SUCCESS' 
                      ? 'Payment Successful' 
                      : paymentStatus === 'FAILED' 
                      ? 'Payment Failed' 
                      : paymentStatus === 'CANCELLED'
                      ? 'Payment Cancelled'
                      : 'Payment Pending'}
                  </div>
                </div>
                
                {paymentStatus === 'SUCCESS' ? (
                  <div className="text-center">
                    <p className="mb-4">Thank you for your purchase!</p>
                    <Link href="/orders">
                      <Button>View Your Orders</Button>
                    </Link>
                  </div>
                ) : paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED' ? (
                  <div className="text-center">
                    <p className="mb-4">Sorry, there was a problem with your payment.</p>
                    <Link href={`/checkout`}>
                      <Button>Try Again</Button>
                    </Link>
                  </div>
                ) : (
                  paymentInfo?.qrCodeUrl && (
                    <div className="text-center">
                      <p className="mb-4">Scan this QR code to complete your payment:</p>
                      <div className="bg-white p-4 rounded-lg inline-block mb-4">
                        <Image 
                          src={paymentInfo.qrCodeUrl}
                          alt="Payment QR Code"
                          width={200}
                          height={200}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Payment pending. This page will automatically update when payment is received.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}