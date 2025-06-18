import { Card, CardContent } from "@/components/ui/card"
import { Heart, Palette, Atom, Users, Layers, Briefcase, Shield, Scale, Video } from "lucide-react"
import Link from "next/link"

const categories = [
  {
    title: "Health and Medicine",
    icon: Heart,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    searchQuery: "health medicine medical nursing pharmacy",
  },
  {
    title: "Arts and Humanities",
    icon: Palette,
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    searchQuery: "arts humanities literature history philosophy",
  },
  {
    title: "Science and Technology",
    icon: Atom,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    searchQuery: "science technology engineering computer physics chemistry",
  },
  {
    title: "Social Sciences",
    icon: Users,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
    searchQuery: "social sciences psychology sociology anthropology",
  },
  {
    title: "Multidisciplinary",
    icon: Layers,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
    searchQuery: "multidisciplinary interdisciplinary studies",
  },
  {
    title: "Business and Management",
    icon: Briefcase,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
    searchQuery: "business management economics finance accounting",
  },
  {
    title: "Inclusive",
    icon: Shield,
    bgColor: "bg-indigo-100",
    iconColor: "text-indigo-600",
    searchQuery: "inclusive education special needs accessibility",
  },
  {
    title: "Law and Governance",
    icon: Scale,
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    searchQuery: "law legal governance political science",
  },
  {
    title: "Video & Photography",
    icon: Video,
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
    searchQuery: "video photography media arts film production",
  },
]

export function CategoriesSection() {
  return (
    <section className="py-8 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-purple-100 text-purple-800 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium mb-4">
            CATEGORIES
          </div>
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 font-sora">Browse By Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/colleges?search=${encodeURIComponent(category.searchQuery)}&category=${encodeURIComponent(category.title)}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                    >
                      <category.icon className={`w-5 h-5 md:w-6 md:h-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary transition-colors text-sm md:text-base">
                      {category.title}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
