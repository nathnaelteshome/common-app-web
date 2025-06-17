import { NotFoundBase } from "@/components/not-found-base"
import { Home, Shield, Database, Settings } from "lucide-react"

export default function SystemAdminNotFound() {
  const systemAdminIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-red-100 to-orange-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-red-200 to-orange-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">🔧</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="System Admin Page Not Found"
      description="The system administration page you're looking for doesn't exist. Access your system dashboard or other administrative tools."
      illustration={systemAdminIllustration}
      primaryAction={{
        label: "System Dashboard",
        href: "/system-admin/dashboard",
        icon: <Home className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "Universities",
          href: "/system-admin/universities",
          icon: <Database className="w-4 h-4" />,
        },
        {
          label: "Verification",
          href: "/system-admin/verification",
          icon: <Shield className="w-4 h-4" />,
        },
        {
          label: "System Settings",
          href: "/system-admin/settings",
          icon: <Settings className="w-4 h-4" />,
        },
      ]}
      showSearch={true}
      searchPlaceholder="Search system features..."
    />
  )
}
