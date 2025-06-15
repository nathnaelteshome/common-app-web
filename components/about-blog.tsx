import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MessageCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getFeaturedPosts } from "@/data/blog-data"

const blogPosts = getFeaturedPosts()

export function AboutBlog() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              BLOG POST
            </div>
            <h2 className="text-4xl font-bold text-primary font-sora">Most Popular Post.</h2>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-white hidden sm:flex">
            All Blog Post
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>Comment ({post.comments})</span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 mb-4 line-clamp-3">{post.title}</h3>

                <Link href={`/blog/${post.slug}`}>
                  <Button variant="outline" className="w-full">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            All Blog Post
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
