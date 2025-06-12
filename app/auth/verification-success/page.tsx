"use client"

import { Header } from "@/components/header"
import { AuthHero } from "@/components/auth-hero"
import { VerificationSuccess } from "@/components/verification-success"
import { Footer } from "@/components/footer"

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AuthHero title="EMAIL VERIFICATION" breadcrumb="Home / Verification Success" />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <VerificationSuccess />
        </div>
      </div>
      <Footer />
    </div>
  )
}
