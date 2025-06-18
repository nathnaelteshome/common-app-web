import { NotFoundBase } from "@/components/not-found-base"
import { Home, LogIn, UserPlus, Mail } from "lucide-react"

export default function AuthNotFound() {
  const authIllustration = (
    <div className="relative w-64 h-64 mx-auto mb-8">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-full opacity-20" />
      <div className="absolute inset-8 bg-gradient-to-br from-indigo-200 to-cyan-200 rounded-full opacity-30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">🔐</div>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-2xl font-bold text-gray-400">404</div>
      </div>
    </div>
  )

  return (
    <NotFoundBase
      title="Authentication Page Not Found"
      description="The authentication page you're looking for doesn't exist. Try signing in or creating a new account."
      illustration={authIllustration}
      primaryAction={{
        label: "Sign In",
        href: "/auth/sign-in",
        icon: <LogIn className="w-4 h-4" />,
      }}
      secondaryActions={[
        {
          label: "Create Account",
          href: "/auth/create-account",
          icon: <UserPlus className="w-4 h-4" />,
        },
        {
          label: "Forgot Password",
          href: "/auth/forgot-password",
          icon: <Mail className="w-4 h-4" />,
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
