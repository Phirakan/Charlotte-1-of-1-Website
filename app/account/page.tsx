"use client"
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '@/components/ProtectRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountPage() {
  const { user, logout } = useAuth();
  
  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Username</div>
                    <div className="font-medium">{user?.username}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Orders</CardTitle>
                  <CardDescription>View and manage your orders</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full">View Orders</Button>
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Addresses</CardTitle>
                  <CardDescription>Manage your shipping addresses</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Link href="/account/addresses">
                    <Button variant="outline" className="w-full">Manage Addresses</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}