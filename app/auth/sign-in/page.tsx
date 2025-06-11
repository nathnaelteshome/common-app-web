"use client"

import { Header } from "@/components/header"
import { AuthHero } from "@/components/auth-hero"
import { SignInForm } from "@/components/sign-in-form"
import { Footer } from "@/components/footer"

export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <AuthHero title="SIGN IN" breadcrumb="Home / Sign In" />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <SignInForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
