"use client"

import { Header } from "@/components/header"
import { AuthHero } from "@/components/auth-hero"
import { VerificationError } from "@/components/verification-error"
import { Footer } from "@/components/footer"

export default function VerificationErrorPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AuthHero title="EMAIL VERIFICATION" breadcrumb="Home / Verification Error" />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <VerificationError />
        </div>
      </div>
      <Footer />
    </div>
  )
}
