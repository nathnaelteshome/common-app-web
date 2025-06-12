"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff, Upload } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { universityRegistrationSchema, type UniversityRegistrationData } from "@/lib/validations/auth"
import { authService } from "@/lib/auth-service"
import { useAuthStore } from "@/store/auth-store"

interface UniversityRegistrationFormProps {
  onBack: () => void
}

export function UniversityRegistrationForm({ onBack }: UniversityRegistrationFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const { setLoading, setError } = useAuthStore()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UniversityRegistrationData>({
    resolver: zodResolver(universityRegistrationSchema),
    defaultValues: {
      role: "university",
    },
  })

  const onSubmit = async (data: UniversityRegistrationData) => {
    try {
      setLoading(true)
      setError(null)

      // Submit registration
      await authService.signUp(data)

      // Submit verification request (in real app, this would be part of registration)
      // For now, we'll simulate this step

      // Redirect to verification status page instead of email verification
      router.push(`/admin/verification/status`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
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
          <CardTitle className="text-2xl text-primary">COLLEGE REGISTRATION</CardTitle>
          <div className="mt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Fields With Are Required</h3>
            <p className="text-sm text-gray-600">
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et
              Dolore Magna Aliqua. Ut Enim Ad Minim
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Credentials Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
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

            {/* College Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">College Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="collegeName">College Name *</Label>
                  <Input
                    id="collegeName"
                    {...register("collegeName")}
                    className={errors.collegeName ? "border-red-500" : ""}
                  />
                  {errors.collegeName && <p className="text-red-500 text-sm mt-1">{errors.collegeName.message}</p>}
                </div>

                <div>
                  <Label htmlFor="address1">Address 1 *</Label>
                  <Controller
                    name="address1"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.address1 ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="address1">Address Option 1</SelectItem>
                          <SelectItem value="address2">Address Option 2</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1.message}</p>}
                </div>

                <div>
                  <Label htmlFor="address2">Address 2 *</Label>
                  <Input id="address2" {...register("address2")} className={errors.address2 ? "border-red-500" : ""} />
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
                          <SelectValue placeholder="Bangladesh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bangladesh">Bangladesh</SelectItem>
                          <SelectItem value="ethiopia">Ethiopia</SelectItem>
                          <SelectItem value="kenya">Kenya</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" {...register("city")} className={errors.city ? "border-red-500" : ""} />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                </div>

                <div>
                  <Label htmlFor="postcode">Postcode / ZIP (Optional)</Label>
                  <Input id="postcode" {...register("postcode")} className={errors.postcode ? "border-red-500" : ""} />
                  {errors.postcode && <p className="text-red-500 text-sm mt-1">{errors.postcode.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone1">Phone *</Label>
                  <Input
                    id="phone1"
                    {...register("phone1")}
                    placeholder="+1234567890"
                    className={errors.phone1 ? "border-red-500" : ""}
                  />
                  {errors.phone1 && <p className="text-red-500 text-sm mt-1">{errors.phone1.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone2">Phone 2 *</Label>
                  <Input
                    id="phone2"
                    {...register("phone2")}
                    placeholder="+1234567890"
                    className={errors.phone2 ? "border-red-500" : ""}
                  />
                  {errors.phone2 && <p className="text-red-500 text-sm mt-1">{errors.phone2.message}</p>}
                </div>

                <div>
                  <Label htmlFor="documents">Document *</Label>
                  <Controller
                    name="documents"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.documents ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="license">Business License</SelectItem>
                          <SelectItem value="accreditation">Accreditation Certificate</SelectItem>
                          <SelectItem value="registration">Registration Document</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents.message}</p>}
                </div>

                <div>
                  <Label htmlFor="fieldOfStudies">Field Of Studies*</Label>
                  <Controller
                    name="fieldOfStudies"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={errors.fieldOfStudies ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="medicine">Medicine</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="arts">Arts & Humanities</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.fieldOfStudies && (
                    <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudies.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="campusImage">Campus Image *</Label>
                  <Controller
                    name="campusImage"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upload">Upload Image</SelectItem>
                          <SelectItem value="url">Image URL</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Choose File</p>
                    <p className="text-xs text-gray-400">No File Chosen</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Fields With Are Required</h3>
              <p className="text-sm text-gray-600">
                Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et
                Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip
                Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu
                Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia
                Deserunt Mollit Anim Id Est Laborum.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
            >
              {isSubmitting ? "Creating Account..." : "CREATE ACCOUNT"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">What happens next?</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>• Your registration will be submitted for verification</p>
          <p>• Our team will review your documents within 2-3 business days</p>
          <p>• You'll receive email notifications about your verification status</p>
          <p>• Once approved, you'll gain access to the admin dashboard</p>
        </div>
      </div>
    </div>
  )
}
