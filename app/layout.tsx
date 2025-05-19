import { Inter } from "next/font/google"
import "./globals.css"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { CartProvider } from "@/lib/cart-context"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "./context/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider> 
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}