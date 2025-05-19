"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, X, LogOut } from "lucide-react"
import { useAuth } from "@/app/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/lib/cart-context"
import { ModeToggle } from "./model-toggle"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function Header() {
  // Add a null check for cart
  const { cart = [] } = useCart() || { cart: [] };
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Add safety check with optional chaining and default to empty array if cart is null
  const totalItems = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + item.quantity, 0) 
    : 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          <Link href="/" className="mr-6 flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Charlotte 1 of 1</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link href="/About" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="relative">
              <Input type="search" placeholder="Search..." className="w-[200px] sm:w-[300px]" autoFocus />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <span className="font-medium">{user?.username}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account" className="w-full">My Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/orders" className="w-full">Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
              </Button>
            </Link>
          )}

          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="font-bold">Charlotte 1 of 1</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="grid gap-2 p-4 text-lg font-medium">
            <Link href="/" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link
              href="/products"
              className="flex items-center py-3 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
            <Link href="#" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Categories
            </Link>
            <Link href="/About" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="#" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            {!isAuthenticated && (
              <>
                <div className="h-px bg-border my-2"></div>
                <Link href="/login" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <div className="h-px bg-border my-2"></div>
                <Link href="/account" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  My Account
                </Link>
                <Link href="/orders" className="flex items-center py-3 hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  Orders
                </Link>
                <button 
                  className="flex items-center py-3 hover:text-primary text-left" 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}