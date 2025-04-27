import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background">
      <div className="container flex flex-col items-center justify-center py-16 text-center md:py-24 lg:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Shop from Vendors <br className="hidden sm:inline" />
          Across the Country
        </h1>
        <p className="mt-6 max-w-[600px] text-lg text-muted-foreground md:text-xl">
          Discover unique products from trusted vendors all in one place. Quality products, secure shopping, fast
          delivery.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg">Shop Now</Button>
          </Link>
          <Link href="/vendors">
            <Button variant="outline" size="lg">
              Explore Vendors
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
