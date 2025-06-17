import { NotFoundBase } from "@/components/not-found-base"
import { Home, FileText, Settings, BarChart3 } from "lucide-react"

export default function AdminNotFound() {
  const adminIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">⚙️</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="Admin Page Not Found"
      description="The administrative page you're looking for doesn't exist. Return to your admin dashboard or explore other management features."
      illustration={adminIllustration}
      primaryAction={{
        label: "Admin Dashboard",
        href: "/admin/dashboard",
        icon: <Home className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "Applications",
          href: "/admin/applications",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: "Forms",
          href: "/admin/forms",
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          label: "Settings",
          href: "/admin/settings",
          icon: <Settings className="w-4 h-4" />,
        },
      ]}
      showSearch={true}
      searchPlaceholder="Search admin features..."
    />
  )
}
