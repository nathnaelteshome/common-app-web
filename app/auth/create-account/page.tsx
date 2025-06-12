"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { AuthHero } from "@/components/auth-hero"
import { RoleSelection } from "@/components/role-selection"
import { StudentRegistrationForm } from "@/components/student-registration-form"
import { UniversityRegistrationForm } from "@/components/university-registration-form"
import { Footer } from "@/components/footer"
import type { UserRole } from "@/lib/validations/auth"

export default function CreateAccountPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
  }

  const handleBack = () => {
    setSelectedRole(null)
  }

  return (
    <div className="min-h-screen">
      <Header />
      <AuthHero title="CREATE ACCOUNT" breadcrumb="Home / Sign Up" />
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          {!selectedRole ? (
            <RoleSelection onRoleSelect={handleRoleSelect} />
          ) : selectedRole === "student" ? (
            <StudentRegistrationForm onBack={handleBack} />
          ) : (
            <UniversityRegistrationForm onBack={handleBack} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
