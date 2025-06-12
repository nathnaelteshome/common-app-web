"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, User, Building2 } from "lucide-react"
import { toast } from "sonner"

interface TestCredential {
  role: "student" | "university"
  email: string
  password: string
  name: string
  description: string
}

const testCredentials: TestCredential[] = [
  {
    role: "student",
    email: "student@test.com",
    password: "Student123",
    name: "John Doe",
    description: "Computer Science student with active applications",
  },
  {
    role: "student",
    email: "jane.smith@test.com",
    password: "Student456",
    name: "Jane Smith",
    description: "Pre-med student exploring university options",
  },
  {
    role: "university",
    email: "admin@aait.edu.et",
    password: "Admin123",
    name: "AAiT Admin",
    description: "Addis Ababa Institute of Technology administrator",
  },
  {
    role: "university",
    email: "admin@mu.edu.et",
    password: "Admin456",
    name: "Mekelle University Admin",
    description: "Mekelle University administrator",
  },
]

export function TestCredentials() {
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Credentials</h2>
        <p className="text-gray-600">Use these credentials to test different user roles and features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testCredentials.map((credential, index) => (
          <Card key={index} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {credential.role === "student" ? (
                    <User className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Building2 className="w-5 h-5 text-green-600" />
                  )}
                  <CardTitle className="text-lg">{credential.name}</CardTitle>
                </div>
                <Badge variant={credential.role === "student" ? "default" : "secondary"}>
                  {credential.role === "student" ? "Student" : "University Admin"}
                </Badge>
              </div>
              <CardDescription>{credential.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Email:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(credential.email, "Email")}
                    className="h-auto p-1 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="block w-full p-2 bg-gray-100 rounded text-sm font-mono">{credential.email}</code>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Password:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(credential.password, "Password")}
                    className="h-auto p-1 text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <code className="block w-full p-2 bg-gray-100 rounded text-sm font-mono">{credential.password}</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use student credentials to access student dashboard and application features</li>
          <li>• Use university admin credentials to access admin dashboard and management tools</li>
          <li>• All accounts are pre-verified and ready to use</li>
          <li>• Mock data is already populated for testing various scenarios</li>
        </ul>
      </div>
    </div>
  )
}
