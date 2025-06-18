import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Camera, Play, ExternalLink, MapPin } from "lucide-react"
import Image from "next/image"
import type University from "@/data/universities-data"

interface UniversityGalleryProps {
  university: University
}

export function UniversityGallery({ university }: UniversityGalleryProps) {
  // Mock gallery data - in a real app, this would come from the university data
  const galleryItems = [
    {
      id: 1,
      type: "image" as const,
      title: "Main Campus Building",
      url: "/placeholder.svg?height=300&width=400&text=Main+Campus",
      description: "The iconic main building housing administrative offices and lecture halls",
    },
    {
      id: 2,
      type: "image" as const,
      title: "Library Complex",
      url: "/placeholder.svg?height=300&width=400&text=Library",
      description: "State-of-the-art library with over 100,000 books and digital resources",
    },
    {
      id: 3,
      type: "video" as const,
      title: "Campus Tour",
      url: "/placeholder.svg?height=300&width=400&text=Campus+Tour+Video",
      description: "Take a virtual tour of our beautiful campus",
    },
    {
      id: 4,
      type: "image" as const,
      title: "Student Center",
      url: "/placeholder.svg?height=300&width=400&text=Student+Center",
      description: "Modern student center with dining, recreation, and study spaces",
    },
    {
      id: 5,
      type: "image" as const,
      title: "Science Laboratories",
      url: "/placeholder.svg?height=300&width=400&text=Science+Labs",
      description: "Cutting-edge laboratories for research and practical learning",
    },
    {
      id: 6,
      type: "image" as const,
      title: "Sports Complex",
      url: "/placeholder.svg?height=300&width=400&text=Sports+Complex",
      description: "Complete sports facilities including gym, pool, and outdoor courts",
    },
  ]

  const campusStats = [
    { label: "Campus Area", value: university.profile.campus_size || "150 acres" },
    { label: "Buildings", value: "25+" },
    { label: "Dormitories", value: "8" },
    { label: "Research Centers", value: "12" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Campus Gallery & Virtual Tour
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Campus Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {campusStats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="font-semibold text-lg text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video">
                <Image
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Type Badge */}
                <div className="absolute top-2 left-2">
                  <Badge variant={item.type === "video" ? "default" : "secondary"} className="text-xs">
                    {item.type === "video" ? (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        Video
                      </>
                    ) : (
                      <>
                        <Camera className="w-3 h-3 mr-1" />
                        Photo
                      </>
                    )}
                  </Badge>
                </div>

                {/* Play Button for Videos */}
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                      <Play className="w-6 h-6 text-gray-900 ml-0.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Camera className="w-4 h-4 mr-2" />
              View Full Gallery
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>

          <Button variant="outline" className="flex-1" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Play className="w-4 h-4 mr-2" />
              360° Virtual Tour
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>

          <Button variant="outline" className="flex-1" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <MapPin className="w-4 h-4 mr-2" />
              Campus Map
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* Campus Location */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Campus Location
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Located in the heart of {university.profile.address.city}, our campus is easily accessible by public transportation and
            offers a vibrant learning environment in one of Ethiopia's most dynamic cities.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Public Transport Access
            </Badge>
            <Badge variant="outline" className="text-xs">
              Parking Available
            </Badge>
            <Badge variant="outline" className="text-xs">
              City Center Location
            </Badge>
            <Badge variant="outline" className="text-xs">
              Safe Neighborhood
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
