"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to returnTo or home
    if (isAuthenticated) {
      router.push(returnTo);
    }
  }, [isAuthenticated, router, returnTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      username,
      password,
    });
    // No need to redirect here, the useEffect will handle that
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Login</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <p className="text-center text-sm mt-6 text-gray-500 dark:text-gray-400">
          Dont have an account yet?{' '}
          <Link href="/register" className="text-primary font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}