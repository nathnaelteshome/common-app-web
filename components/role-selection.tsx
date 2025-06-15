"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { GraduationCap, Building } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/lib/validations/auth"

interface RoleSelectionProps {
  onRoleSelect: (role: UserRole) => void
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")

  const handleContinue = () => {
    onRoleSelect(selectedRole)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">Create account.</h2>
        <p className="text-gray-600">
          Already have account?{" "}
          <Link href="/auth/sign-in" className="text-primary hover:underline">
            Sign-In
          </Link>
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8">
          <RadioGroup value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="student" id="student" />
                <Label htmlFor="student" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium">Register as a Student</span>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="university" id="university" />
                <Label htmlFor="university" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-medium">Register as a Universities/Colleges</span>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button onClick={handleContinue} className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg">
        CREATE ACCOUNT
      </Button>
    </div>
  )
}
