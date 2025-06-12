import { ResetPasswordForm } from "@/components/reset-password-form"
import { AuthHero } from "@/components/auth-hero"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/2">
        <AuthHero />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
