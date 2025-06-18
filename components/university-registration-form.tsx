"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, Upload, CheckCircle } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { universityRegistrationSchema, type UniversityRegistrationData } from "@/lib/validations/auth"
import { useAuthStore } from "@/store/auth-store"
import { authService } from "@/lib/auth-service"
import { toast } from "sonner"

interface UniversityRegistrationFormProps {
  onBack: () => void
}

export function UniversityRegistrationForm({ onBack }: UniversityRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [documents, setDocuments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { setLoading, setError } = useAuthStore()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UniversityRegistrationData>({
    resolver: zodResolver(universityRegistrationSchema),
    defaultValues: {
      role: "university",
    },
  })

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setDocuments((prev) => [...prev, ...files])
  }

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: UniversityRegistrationData) => {
    try {
      setIsSubmitting(true)
      setLoading(true)
      setError(null)

      // Transform data to match backend API expectations
      const registrationData: UniversityRegistrationData = {
        ...data,
        universityName: data.collegeName,
        universityType: data.documents === "public_university" ? "PUBLIC" : "PRIVATE",
        website: "", // Will be added in future versions
        description: "", // Will be added in future versions
        establishedYear: new Date().getFullYear(), // Default value for now
        address: {
          street: data.address1 + (data.address2 ? `, ${data.address2}` : ""),
          city: data.city,
          state: "", // Will be added in future versions
          zipCode: data.postcode,
          country: data.country.toUpperCase()
        },
        contact: {
          phone: data.phone1,
          email: data.email,
          admissions_email: data.email // Default to same email
        }
      }

      await authService.signUp(registrationData)

      toast.success("Registration submitted successfully!")

      // Redirect to email verification
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      setError(error instanceof Error ? error.message : "Registration failed")
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to role selection
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl text-primary">UNIVERSITY REGISTRATION</CardTitle>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Registration & Verification Process</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Complete the registration form with accurate information</p>
              <p>• Upload required verification documents</p>
              <p>• Your application will be reviewed by our team within 2-3 business days</p>
              <p>• You'll receive email notifications about your verification status</p>
              <p>• Once approved, you'll gain access to the admin dashboard</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Credentials Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                    placeholder="admin@university.edu"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="password">Password (Minimum 8 Characters) *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* University Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">University Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="collegeName">University/College Name *</Label>
                  <Input
                    id="collegeName"
                    {...register("collegeName")}
                    className={errors.collegeName ? "border-red-500" : ""}
                    placeholder="Enter full university name"
                  />
                  {errors.collegeName && <p className="text-red-500 text-sm mt-1">{errors.collegeName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="address1">Address Line 1 *</Label>
                  <Input
                    id="address1"
                    {...register("address1")}
                    className={errors.address1 ? "border-red-500" : ""}
                    placeholder="Street address"
                  />
                  {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>}
                </div>

                <div>
                  <Label htmlFor="address2">Address Line 2</Label>
                  <Input
                    id="address2"
                    {...register("address2")}
                    className={errors.address2 ? "border-red-500" : ""}
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                  {errors.address2 && <p className="text-red-500 text-sm mt-1">{errors.address2.message}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.country ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethiopia">Ethiopia</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                          <SelectItem value="uganda">Uganda</SelectItem>
                          <SelectItem value="tanzania">Tanzania</SelectItem>
                          <SelectItem value="rwanda">Rwanda</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    {...register("city")}
                    className={errors.city ? "border-red-500" : ""}
                    placeholder="City name"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <Label htmlFor="postcode">Postal Code *</Label>
                  <Input
                    id="postcode"
                    {...register("postcode")}
                    className={errors.postcode ? "border-red-500" : ""}
                    placeholder="Postal/ZIP code"
                  />
                  {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone1">Primary Phone *</Label>
                  <Input
                    id="phone1"
                    {...register("phone1")}
                    placeholder="+251911234567"
                    className={errors.phone1 ? "border-red-500" : ""}
                  />
                  {errors.phone1 && <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone2">Secondary Phone</Label>
                  <Input
                    id="phone2"
                    {...register("phone2")}
                    placeholder="+251911234567 (optional)"
                    className={errors.phone2 ? "border-red-500" : ""}
                  />
                  {errors.phone2 && <p className="text-red-500 text-sm mt-1">{errors.phone2.message}</p>}
                </div>

                <div>
                  <Label htmlFor="fieldOfStudies">Primary Field of Studies *</Label>
                  <Controller
                    name="fieldOfStudies"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.fieldOfStudies ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select primary field" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering & Technology</SelectItem>
                          <SelectItem value="medicine">Medicine & Health Sciences</SelectItem>
                          <SelectItem value="business">Business & Economics</SelectItem>
                          <SelectItem value="arts">Arts & Humanities</SelectItem>
                          <SelectItem value="science">Natural Sciences</SelectItem>
                          <SelectItem value="social">Social Sciences</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="law">Law</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fieldOfStudies && (
                    <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudies.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="documents">Institution Type *</Label>
                  <Controller
                    name="documents"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.documents ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select institution type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public_university">Public University</SelectItem>
                          <SelectItem value="private_university">Private University</SelectItem>
                          <SelectItem value="college">College</SelectItem>
                          <SelectItem value="institute">Institute</SelectItem>
                          <SelectItem value="technical_school">Technical School</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents.message}</p>}
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Documents</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Upload verification documents</p>
                    <p className="text-xs text-gray-500 mb-4">
                      Required: Business License, Accreditation Certificate, Tax Certificate
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("document-upload")?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                {documents.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Uploaded Documents:</h4>
                    {documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Information Notice */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">What happens after registration?</h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>• Your registration will be submitted for verification</p>
                <p>• Our team will review your documents within 2-3 business days</p>
                <p>• You'll receive email notifications about your verification status</p>
                <p>• Once approved, you'll gain access to the admin dashboard</p>
                <p>• You can track your verification status at any time</p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
            >
              {isSubmitting ? "Submitting Registration..." : "SUBMIT REGISTRATION"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
