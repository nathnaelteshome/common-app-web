"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, UserPlus, LogIn, CheckCircle, Clock, Shield, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type University from "@/data/universities-data"

interface GuestApplicationPromptProps {
  university: University | null
  programId: string | null
}

export function GuestApplicationPrompt({ university, programId }: GuestApplicationPromptProps) {
  const selectedProgram = university && programId ? university.programs.find((p) => p.id === programId) : null

  const benefits = [
    {
      icon: FileText,
      title: "Save Your Progress",
      description: "Complete your application at your own pace and save your progress",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security",
    },
    {
      icon: Clock,
      title: "Track Applications",
      description: "Monitor the status of all your applications in one place",
    },
    {
      icon: CheckCircle,
      title: "Quick Apply",
      description: "Apply to multiple programs with saved information",
    },
  ]

  const currentUrl = typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "/apply"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Application?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create an account or sign in to begin your application process. It only takes a few minutes to get started.
          </p>
        </div>

        {/* Selected University/Program Info */}
        {university && (
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={university.image || "/placeholder.svg"}
                    alt={university.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{university.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline">{university.type}</Badge>
                    <Badge variant="secondary">{university.location}</Badge>
                  </div>

                  {selectedProgram ? (
                    <div className="bg-white/50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Selected Program: {selectedProgram.name}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Degree:</span>
                          <div className="font-medium">{selectedProgram.degree}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <div className="font-medium">{selectedProgram.duration}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Tuition:</span>
                          <div className="font-medium">${selectedProgram.tuitionFee.toLocaleString()}/year</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Deadline:</span>
                          <div className="font-medium">
                            {new Date(selectedProgram.applicationDeadline).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">{university.programs.length} programs available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Creation */}
          <Card className="border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
              RECOMMENDED
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <UserPlus className="w-5 h-5" />
                Create New Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                New to CommonApply? Create your account to access all features and start your application journey.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Free account creation</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Apply to multiple universities</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Track application status</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Save and resume applications</span>
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" asChild>
                <Link href={`/auth/create-account?redirect=${encodeURIComponent(currentUrl)}`}>
                  Create Account & Apply
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>

          {/* Sign In */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Already Have an Account?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Sign in to your existing account to continue with your applications.</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Access saved applications</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>View application history</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span>Continue where you left off</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                size="lg"
                asChild
              >
                <Link href={`/auth/sign-in?redirect=${encodeURIComponent(currentUrl)}`}>
                  Sign In to Apply
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>

              <div className="text-center">
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Create an Account?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Continue Browsing */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Want to explore more universities first?</p>
          <Button variant="ghost" asChild>
            <Link href="/colleges" className="text-primary hover:text-primary/80">
              <GraduationCap className="w-4 h-4 mr-2" />
              Browse All Universities
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
