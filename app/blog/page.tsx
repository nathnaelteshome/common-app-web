import { Header } from "@/components/header"
import { BlogHero } from "@/components/blog-hero"
import { BlogGrid } from "@/components/blog-grid"
import { Footer } from "@/components/footer"
import { getFeaturedPosts } from "@/data/blog-data"

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts()

  return (
    <div className="min-h-screen">
      <Header />
      <BlogHero />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <BlogGrid posts={featuredPosts} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
