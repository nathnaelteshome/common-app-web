import { NotFoundBase } from "@/components/not-found-base"
import { Home, GraduationCap, Search, BookOpen } from "lucide-react"

export default function UniversitiesNotFound() {
  const universityIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">🏛️</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="University Not Found"
      description="The university or program you're looking for doesn't exist or may have been moved. Explore our complete list of universities and programs."
      illustration={universityIllustration}
      primaryAction={{
        label: "Browse Universities",
        href: "/colleges",
        icon: <GraduationCap className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "Advanced Search",
          href: "/colleges?search=true",
          icon: <Search className="w-4 h-4" />,
        },
        {
          label: "Programs Guide",
          href: "/blog?category=programs",
          icon: <BookOpen className="w-4 h-4" />,
        },
        {
          label: "Go Home",
          href: "/",
          icon: <Home className="w-4 h-4" />,
        },
      ]}
      showSearch={true}
      searchPlaceholder="Search universities and programs..."
      onSearch={(query) => {
        window.location.href = `/colleges?q=${encodeURIComponent(query)}`
      }}
    />
  )
}
