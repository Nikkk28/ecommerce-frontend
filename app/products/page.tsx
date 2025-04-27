import { Suspense } from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { SearchBar } from "@/components/search-bar"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <SearchBar />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">All Products</h1>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
            <aside className="hidden md:block">
              <ProductFilters />
            </aside>
            <div>
              <Suspense fallback={<LoadingSpinner />}>
                <ProductGrid />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
