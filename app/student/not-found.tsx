import { NotFoundBase } from "@/components/not-found-base"
import { Home, FileText, Bell, CreditCard } from "lucide-react"

export default function StudentNotFound() {
  const studentIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">🎓</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="Student Page Not Found"
      description="The student resource you're looking for doesn't exist. Let's get you back to your dashboard or explore other student features."
      illustration={studentIllustration}
      primaryAction={{
        label: "Student Dashboard",
        href: "/student/dashboard",
        icon: <Home className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "My Applications",
          href: "/student/applications",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          label: "Notifications",
          href: "/student/notifications",
          icon: <Bell className="w-4 h-4" />,
        },
        {
          label: "Payments",
          href: "/student/payments",
          icon: <CreditCard className="w-4 h-4" />,
        },
      ]}
      showSearch={true}
      searchPlaceholder="Search student resources..."
    />
  )
}
