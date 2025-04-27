import { Suspense } from "react"
import Link from "next/link"
import { ChevronRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryShowcase } from "@/components/category-showcase"
import { HeroSection } from "@/components/hero-section"
import { VendorShowcase } from "@/components/vendor-showcase"
import { SearchBar } from "@/components/search-bar"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <SearchBar />
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />

        <section className="container py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Featured Categories</h2>
            <Link href="/categories" className="flex items-center text-sm font-medium text-primary">
              View all categories <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <CategoryShowcase />
          </Suspense>
        </section>

        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
              <Link href="/products" className="flex items-center text-sm font-medium text-primary">
                View all products <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedProducts />
            </Suspense>
          </div>
        </section>

        <section className="container py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Popular Vendors</h2>
            <Link href="/vendors" className="flex items-center text-sm font-medium text-primary">
              View all vendors <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <VendorShowcase />
          </Suspense>
        </section>
      </main>
      <Footer />
    </div>
  )
}
