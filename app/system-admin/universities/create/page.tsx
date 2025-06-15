"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building, Upload, FileText, AlertCircle } from "lucide-react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { verificationRequestSchema, type VerificationRequestData } from "@/lib/validations/verification"
import { verificationService } from "@/lib/services/verification-service"
import { toast } from "sonner"
import Link from "next/link"

export default function CreateUniversity() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<VerificationRequestData>({
    resolver: zodResolver(verificationRequestSchema),
  })

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const onSubmit = async (data: VerificationRequestData) => {
    try {
      // Create verification request
      const requestId = await verificationService.submitVerificationRequest(data.universityData, uploadedFiles)

      toast.success("University verification request created successfully!")
      router.push(`/system-admin/verification?highlight=${requestId}`)
    } catch (error) {
      toast.error("Failed to create university verification request")
      console.error(error)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/system-admin/verification">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Verification Management
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New University</h1>
            <p className="text-gray-600">Create a new university verification request</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                University Information
              </CardTitle>
              <p className="text-sm text-gray-600">
                Enter the university details and upload required documents for verification
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="collegeName">University Name *</Label>
                      <Input
                        id="collegeName"
                        {...register("universityData.collegeName")}
                        className={errors.universityData?.collegeName ? "border-red-500" : ""}
                        placeholder="Enter university name"
                      />
                      {errors.universityData?.collegeName && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.collegeName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Official Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("universityData.email")}
                        className={errors.universityData?.email ? "border-red-500" : ""}
                        placeholder="admin@university.edu"
                      />
                      {errors.universityData?.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="fieldOfStudies">Field of Studies *</Label>
                      <Controller
                        name="universityData.fieldOfStudies"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.universityData?.fieldOfStudies ? "border-red-500" : ""}>
                              <SelectValue placeholder="Select field of studies" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="engineering">Engineering & Technology</SelectItem>
                              <SelectItem value="medicine">Medicine & Health Sciences</SelectItem>
                              <SelectItem value="business">Business & Economics</SelectItem>
                              <SelectItem value="arts">Arts & Humanities</SelectItem>
                              <SelectItem value="science">Natural Sciences</SelectItem>
                              <SelectItem value="social">Social Sciences</SelectItem>
                              <SelectItem value="agriculture">Agriculture & Life Sciences</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.universityData?.fieldOfStudies && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.fieldOfStudies.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="address1">Address Line 1 *</Label>
                      <Input
                        id="address1"
                        {...register("universityData.address1")}
                        className={errors.universityData?.address1 ? "border-red-500" : ""}
                        placeholder="Main campus address"
                      />
                      {errors.universityData?.address1 && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.address1.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input
                        id="address2"
                        {...register("universityData.address2")}
                        placeholder="Additional address info (optional)"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Controller
                        name="universityData.country"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.universityData?.country ? "border-red-500" : ""}>
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
                      {errors.universityData?.country && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.country.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        {...register("universityData.city")}
                        className={errors.universityData?.city ? "border-red-500" : ""}
                        placeholder="City name"
                      />
                      {errors.universityData?.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.city.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postcode">Postal Code *</Label>
                      <Input
                        id="postcode"
                        {...register("universityData.postcode")}
                        className={errors.universityData?.postcode ? "border-red-500" : ""}
                        placeholder="Postal/ZIP code"
                      />
                      {errors.universityData?.postcode && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.postcode.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone1">Primary Phone *</Label>
                      <Input
                        id="phone1"
                        {...register("universityData.phone1")}
                        className={errors.universityData?.phone1 ? "border-red-500" : ""}
                        placeholder="+251911234567"
                      />
                      {errors.universityData?.phone1 && (
                        <p className="text-red-500 text-sm mt-1">{errors.universityData.phone1.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone2">Secondary Phone</Label>
                      <Input
                        id="phone2"
                        {...register("universityData.phone2")}
                        placeholder="+251911234568 (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Required Documents</h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-gray-600">Upload required documents</p>
                        <p className="text-sm text-gray-500">
                          Business License, Accreditation Certificate, Tax Certificate
                        </p>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" className="mt-2">
                            Choose Files
                          </Button>
                        </Label>
                      </div>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Uploaded Documents:</h4>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-gray-500" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {errors.documents && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <p className="text-sm">{errors.documents.message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Information Notice */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Verification Process</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• This will create a new verification request in the system</p>
                    <p>• All documents will be reviewed for authenticity and validity</p>
                    <p>• The university will be notified of the verification status</p>
                    <p>• Approved universities will gain access to the admin dashboard</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || uploadedFiles.length === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? "Creating Request..." : "Create Verification Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
