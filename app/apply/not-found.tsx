import { NotFoundBase } from "@/components/not-found-base"
import { Home, FileText, GraduationCap, HelpCircle } from "lucide-react"

export default function ApplyNotFound() {
  const applyIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-violet-200 to-purple-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">📋</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="Application Not Found"
      description="The application or application page you're looking for doesn't exist. Start a new application or check your existing applications."
      illustration={applyIllustration}
      primaryAction={{
        label: "Start Application",
        href: "/apply",
        icon: <FileText className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "Browse Universities",
          href: "/colleges",
          icon: <GraduationCap className="w-4 h-4" />,
        },
        {
          label: "Application Help",
          href: "/blog?category=application-guide",
          icon: <HelpCircle className="w-4 h-4" />,
        },
        {
          label: "Go Home",
          href: "/",
          icon: <Home className="w-4 h-4" />,
        },
      ]}
    />
  )
}
