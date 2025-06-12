"use client"

import { Suspense } from "react"
import { Header } from "@/components/header"
import { AuthHero } from "@/components/auth-hero"
import { EmailVerificationForm } from "@/components/email-verification-form"
import { Footer } from "@/components/footer"

function EmailVerificationContent() {
  return <EmailVerificationForm />
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AuthHero title="EMAIL VERIFICATION" breadcrumb="Home / Email Verification" />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <Suspense fallback={<div>Loading...</div>}>
            <EmailVerificationContent />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  )
}
