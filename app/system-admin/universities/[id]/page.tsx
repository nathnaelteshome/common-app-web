"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Edit,
  Download,
} from "lucide-react"
import Link from "next/link"
import { verificationService } from "@/lib/services/verification-service"
import { mockUniversityData } from "@/data/mock-data"

export default function UniversityDetail() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const [university, setUniversity] = useState<any>(null)
  const [verificationRequest, setVerificationRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  useEffect(() => {
    const loadUniversityData = async () => {
      try {
        // Find university in mock data
        const universityData = mockUniversityData.find((uni) => uni.id === params.id)

        if (universityData) {
          setUniversity(universityData)

          // Try to find associated verification request
          const verificationRequests = verificationService.getVerificationRequests()
          const associatedRequest = verificationRequests.find(
            (req) => req.universityId === params.id || req.universityName === universityData.name,
          )

          if (associatedRequest) {
            setVerificationRequest(associatedRequest)
          }
        }
      } catch (error) {
        console.error("Failed to load university data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadUniversityData()
    }
  }, [params.id])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">University Not Found</h2>
            <p className="text-gray-600 mb-4">The requested university could not be found.</p>
            <Button asChild>
              <Link href="/system-admin/universities">Back to Universities</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "suspended":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />
      default:
        return <Building className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/system-admin/universities">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Universities
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{university.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(university.status)}
                <Badge className={`${getStatusColor(university.status)} border-0`}>{university.status}</Badge>
                {verificationRequest && (
                  <Badge variant="outline">Verification: {verificationRequest.status.replace("_", " ")}</Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/system-admin/universities/${university.id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>
            {verificationRequest && (
              <Button variant="outline" asChild>
                <Link href={`/system-admin/verification?highlight=${verificationRequest.id}`}>View Verification</Link>
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>University Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{university.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{university.adminContact}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">Ethiopia</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="font-medium">{new Date(university.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{university.totalPrograms}</p>
                    <p className="text-sm text-gray-500">Total Programs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{university.totalApplications}</p>
                    <p className="text-sm text-gray-500">Total Applications</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{university.dataAccuracy}%</p>
                    <p className="text-sm text-gray-500">Data Accuracy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            {verificationRequest ? (
              <Card>
                <CardHeader>
                  <CardTitle>Verification Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Verification Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Verification Status</h4>
                      <p className="text-sm text-gray-500">Current status of university verification</p>
                    </div>
                    <Badge className={`${getStatusColor(verificationRequest.status)} border-0`}>
                      {verificationRequest.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Documents */}
                  <div>
                    <h4 className="font-medium mb-3">Submitted Documents</h4>
                    <div className="space-y-2">
                      {verificationRequest.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gray-500" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{doc.type.replace("_", " ")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(doc.status)} border-0`}>{doc.status}</Badge>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Notes */}
                  {verificationRequest.reviewNotes && (
                    <div>
                      <h4 className="font-medium mb-2">Review Notes</h4>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{verificationRequest.reviewNotes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Verification Request</h3>
                  <p className="text-gray-600">This university doesn't have an associated verification request.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Programs Information</h3>
                  <p className="text-gray-600">Program details will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Data</h3>
                  <p className="text-gray-600">Application statistics will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
