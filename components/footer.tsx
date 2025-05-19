import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">StyleShop</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your one-stop destination for trendy fashion and accessories.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-500 hover:text-primary dark:text-gray-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Charlotte 1 of 1. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
