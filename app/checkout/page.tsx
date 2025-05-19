// pages/checkout.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectRoute';
import { useCart } from '@/lib/cart-context';
import { shippingApi, orderApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group.tsx";
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/ui/Loading-spinner';

interface ShippingAddress {
  id: number;
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

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await shippingApi.getAddresses();
      setAddresses(response.data.addresses);
      
      // Set default address if available
      const defaultAddress = response.data.addresses.find((addr: ShippingAddress) => addr.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (response.data.addresses.length > 0) {
        setSelectedAddressId(response.data.addresses[0].id);
      }
    } catch (err) {
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }
    
    if (!selectedAddressId && !isNewAddress) {
      setError('Please select a shipping address');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const checkoutData = {
        shipping_address_id: selectedAddressId,
      };
      
      // If using a new address, we would include shipping_address data
      // from a form, but we're not implementing the full form in this example
      
      const response = await orderApi.checkout(checkoutData);
      
      // Clear the cart
      clearCart();
      
      // Redirect to payment page or order confirmation
      router.push(`/payment?orderId=${response.data.order_id}&transactionId=${response.data.payment.transactionId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process checkout');
      console.error('Checkout error:', err);
    } finally {
      setIsSubmitting(false);
    }
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

  if (cart.length === 0) {
    return (
      <ProtectedRoute>
        <div className="container px-4 py-8 md:px-6 md:py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-500 mb-6">You need to add items to your cart before checkout.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Select Address</h3>
                    <Link href="/account/addresses">
                      <Button variant="outline" size="sm">
                        Manage Addresses
                      </Button>
                    </Link>
                  </div>

                  {addresses.length > 0 ? (
                    <RadioGroup 
                      value={selectedAddressId?.toString() || ""} 
                      onValueChange={(value: string) => {
                        setSelectedAddressId(parseInt(value));
                        setIsNewAddress(false);
                      }}
                      className="space-y-3"
                    >
                      {addresses.map((address) => (
                        <div 
                          key={address.id} 
                          className={`border rounded-lg p-4 ${
                            selectedAddressId === address.id ? 'border-primary' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <RadioGroupItem 
                              value={address.id.toString()} 
                              id={`address-${address.id}`}
                              className="mt-1"
                            />
                            <div className="ml-3">
                              <Label 
                                htmlFor={`address-${address.id}`} 
                                className="font-medium"
                              >
                                {address.recipient_name} {address.is_default && ' (Default)'}
                              </Label>
                              <p className="text-sm text-gray-500">
                                {address.address_line1}
                                {address.address_line2 && `, ${address.address_line2}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {address.city}, {address.state} {address.postal_code}, {address.country}
                              </p>
                              <p className="text-sm text-gray-500">
                                Phone: {address.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <div 
                        className={`border rounded-lg p-4 ${
                          isNewAddress ? 'border-primary' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <RadioGroupItem 
                            value="new" 
                            id="address-new"
                            onClick={() => {
                              setIsNewAddress(true);
                              setSelectedAddressId(null);
                            }}
                            className="mt-1"
                          />
                          <div className="ml-3">
                            <Label 
                              htmlFor="address-new" 
                              className="font-medium"
                            >
                              Add a new address
                            </Label>
                            <p className="text-sm text-gray-500">
                              Use a new shipping address for this order
                            </p>
                            
                            {isNewAddress && (
                              <Button 
                                variant="link" 
                                className="px-0 py-1"
                                onClick={() => router.push('/account/addresses/new?returnTo=checkout')}
                              >
                                Add a new address
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  ) : (
                    <div className="border rounded-lg p-4 text-center">
                      <p className="mb-4">You dont have any saved addresses.</p>
                      <Link href="/account/addresses/new?returnTo=checkout">
                        <Button>Add Address</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="border rounded-lg p-6 h-fit space-y-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.product.name}</span>
                    <span className="text-gray-500 block text-sm">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}