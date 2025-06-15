import { PasswordResetSuccess } from "@/components/password-reset-success"
import { AuthHero } from "@/components/auth-hero"

export default function PasswordResetSuccessPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2">
        <AuthHero />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <PasswordResetSuccess />
        </div>
      </div>
    </div>
  )
}
