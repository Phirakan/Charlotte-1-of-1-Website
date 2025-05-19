import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('/charrlott.png')",
            backgroundSize: "cover",
            backgroundPosition: "center 45%",
            opacity: 0.3,
          }}
        ></div>

        <div className="container px-4 md:px-6 relative z-20">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Who are we?
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Our journey, mission, and the team behind your favorite fashion destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Story</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Founded in 2020 by Phirakan Khongpheat, Charlotte 1 of 1 began as a small online boutique with a passion for
                curating high-quality, trendy fashion pieces at accessible prices.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                What started as a small operation run from a home office has grown into a beloved fashion destination
                serving customers worldwide. Our commitment to quality, sustainability, and customer satisfaction has
                remained unchanged throughout our journey.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Today, Charlotte 1 of 1 offers thousands of products across multiple categories, but we still personally select
                each item with the same care and attention to detail as we did on day one.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Charlotte 1 of 1 founder working in the early days"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Mission</h2>
            <p className="max-w-[800px] text-gray-500 dark:text-gray-400">
              At Charlotte 1 of 1, we believe that fashion should be accessible, sustainable, and empowering. Our mission is to
              help you express your unique style while making responsible choices.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z" />
                  <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z" />
                  <line x1="12" y1="22" x2="12" y2="13" />
                  <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality First</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We carefully select each product for its quality, durability, and style, ensuring you receive items that
                exceed your expectations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainability</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We are committed to reducing our environmental impact by partnering with eco-conscious brands and
                implementing sustainable practices.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-gray-500 dark:text-gray-400">
                We believe in building a community of fashion enthusiasts who share our values and vision for a more
                stylish and sustainable world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Meet Our Team</h2>
            <p className="max-w-[800px] text-gray-500 dark:text-gray-400">
              The passionate individuals behind Charlotte 1 of 1 who work tirelessly to bring you the best fashion experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Phirakan Khongpheat - Founder & CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Phirakan Khongpheat</h3>
              <p className="text-gray-500 dark:text-gray-400">Founder & CEO</p>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Sarah Johnson - Creative Director"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-gray-500 dark:text-gray-400">Creative Director</p>
            </div>

            {/* Team Member 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="David Chen - Head of Operations"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">David Chen</h3>
              <p className="text-gray-500 dark:text-gray-400">Head of Operations</p>
            </div>

            {/* Team Member 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src="/placeholder.svg?height=128&width=128"
                  alt="Maya Patel - Customer Experience"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Maya Patel</h3>
              <p className="text-gray-500 dark:text-gray-400">Customer Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter">Get in Touch</h2>
            <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
              Have questions or feedback? We d love to hear from you. Our team is always ready to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button size="lg">Contact Us</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
