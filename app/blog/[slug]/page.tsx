import { Header } from "@/components/header"
import { BlogHero } from "@/components/blog-hero"
import { BlogPost } from "@/components/blog-post"
import { BlogSidebar } from "@/components/blog-sidebar"
import { RelatedBlogs } from "@/components/related-blogs"
import { Footer } from "@/components/footer"
import { getBlogPostBySlug, getRelatedPosts } from "@/data/blog-data"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post.id, post.category)

  return (
    <div className="min-h-screen">
      <Header />
      <BlogHero />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <main className="lg:w-2/3">
              <BlogPost post={post} />
              <RelatedBlogs posts={relatedPosts} />
            </main>
            <aside className="lg:w-1/3">
              <BlogSidebar />
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
