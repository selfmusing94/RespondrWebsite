import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { StatsCounter } from "@/components/stats-counter"
import { TestimonialSlider } from "@/components/testimonial-slider"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 md:px-12 container mx-auto">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
            </div>
      <span className="text-xl font-bold text-red-600">Respondr</span>
    </div>

    {/* Navigation links */}
    <nav className="hidden md:flex items-center gap-6">
       <Link href="/" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        Home
      </Link>
       <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        About Us
      </Link>
       <Link href="/careers" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        Careers
      </Link>
      <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        Features
      </Link>
      <Link href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        How It Works
      </Link>
      <Link href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        Testimonials
      </Link>
       <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
        Contact Us
      </Link>
    </nav>

    {/* Auth Buttons */}
    <div className="flex items-center gap-4">
      <Link href="/login">
        <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700">
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button className="bg-red-600 text-white hover:bg-red-700">Sign Up</Button>
      </Link>
    </div>
  </div>
</header>


      <main className="flex-1">
        <HeroSection />

        <section id="features" className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  Cutting-Edge Features
                </h2>
                <p className="mx-auto text-gray-700 md:text-xl/relaxed">
                  Our platform combines advanced technology with user-friendly design to save lives
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon="brain"
                title="AI-Powered Analysis"
                description="Advanced algorithms analyze emergency photos to determine severity and dispatch appropriate resources."
                delay={0.1}
              />
              <FeatureCard
                icon="clock"
                title="Rapid Response"
                description="Automated dispatch and real-time location tracking significantly reduce emergency response times."
                delay={0.2}
              />
              <FeatureCard
                icon="map-pin"
                title="Precise Location"
                description="GPS technology pinpoints your exact location, ensuring help arrives exactly where it's needed."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-red-600">
                  How It Works
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl/relaxed">
                  A simple process designed for emergencies when every second counts
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-24 left-1/2 h-[calc(100%-6rem)] w-1 -translate-x-1/2 bg-red-200 hidden md:block"></div>

              <div className="grid gap-12 md:gap-24 relative">
                <div className="grid md:grid-cols-2 items-center gap-6">
                  <div className="order-2 md:order-1">
                    <div className="space-y-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
                        1
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Tap SOS & Capture</h3>
                      <p className="text-gray-700">
                        Press the SOS button to immediately begin the emergency reporting process. Take a photo of the
                        incident to help emergency services assess the situation.
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 bg-white p-2 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105">
                    <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src="/img1.png?height=400&width=600"
                        width={600}
                        height={400}
                        alt="SOS Button"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 items-center gap-6">
                  <div className="bg-white p-2 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105">
                    <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src="/img2.png?height=400&width=600"
                        width={600}
                        height={400}
                        alt="AI Analysis"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
                        2
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">AI Analysis & Dispatch</h3>
                      <p className="text-gray-700">
                        Our AI system analyzes the photo and your location data to determine the severity of the
                        emergency and automatically dispatches the nearest available ambulance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 items-center gap-6">
                  <div className="order-2 md:order-1">
                    <div className="space-y-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
                        3
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Real-time Tracking</h3>
                      <p className="text-gray-700">
                        Track the ambulance in real-time as it approaches your location. The driver receives your exact
                        coordinates and the fastest route to reach you.
                      </p>
                    </div>
                  </div>
                  <div className="order-1 md:order-2 bg-white p-2 rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105">
                    <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src="/img3.png?height=400&width=600"
                        width={600}
                        height={400}
                        alt="Real-time Tracking"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6">
            <StatsCounter />
          </div>
        </section>

        <section id="testimonials" className="w-full py-20 bg-red-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Emergency Responders
                </h2>
                <p className="mx-auto max-w-[700px] md:text-xl/relaxed">
                  See what medical professionals and users have to say about our platform
                </p>
              </div>
            </div>

            <TestimonialSlider />
          </div>
        </section>

        <section className="w-full py-20 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="space-y-4 max-w-xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-red-600">Ready to Save Lives?</h2>
                <p className="text-gray-700 md:text-xl/relaxed">
                  Join Respondr today and be part of a network that's revolutionizing emergency response. Every second
                  counts.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <Button className="bg-red-600 text-white hover:bg-red-700 transition-transform hover:scale-105">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative w-full max-w-md">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-red-200 rounded-full opacity-50"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-red-300 rounded-full opacity-50"></div>
                <div className="relative bg-white p-3 rounded-xl shadow-xl">
                  <Image
                    src="/ready.png?height=400&width=400"
                    width={400}
                    height={400}
                    alt="Mobile app"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t bg-white py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative h-8 w-8 overflow-hidden rounded-full bg-red-600">
                  <div className="absolute inset-0 flex items-center justify-center text-white font-bold">R</div>
                </div>
                <span className="text-xl font-bold text-red-600">Respondr</span>
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Revolutionizing emergency response with AI-powered technology and real-time tracking.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
            <p className="text-center text-sm text-gray-600 md:text-left">© 2025 Respondr. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-red-600 transition-colors">
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-red-600 transition-colors">
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-red-600 transition-colors">
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
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
