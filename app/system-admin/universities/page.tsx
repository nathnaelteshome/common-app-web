"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building,
  Search,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Shield,
  Database,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { mockUniversityData } from "@/data/mock-data"
import { dataValidationService } from "@/lib/services/data-validation"
import { toast } from "sonner"

export default function UniversityManagement() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const [dataIntegrityReport, setDataIntegrityReport] = useState<any>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const filteredUniversities = mockUniversityData.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || uni.status === statusFilter
    const matchesVerification = verificationFilter === "all" || uni.verificationStatus === verificationFilter
    return matchesSearch && matchesStatus && matchesVerification
  })

  const sortedUniversities = [...filteredUniversities].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "dataAccuracy":
        return b.dataAccuracy - a.dataAccuracy
      case "lastUpdated":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "applications":
        return b.totalApplications - a.totalApplications
      default:
        return 0
    }
  })

  const handleValidateData = async () => {
    setIsValidating(true)
    try {
      // Simulate data validation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const errors = dataValidationService.getValidationErrors(50)
      setValidationErrors(errors)

      const integrityReport = await dataValidationService.checkDataIntegrity("university", mockUniversityData)
      setDataIntegrityReport(integrityReport)

      toast.success("Data validation completed")
    } catch (error) {
      toast.error("Validation failed")
    } finally {
      setIsValidating(false)
    }
  }

  const handleSyncData = async () => {
    toast.info("Starting data synchronization...")
    // Simulate data sync
    await new Promise((resolve) => setTimeout(resolve, 3000))
    toast.success("Data synchronization completed")
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

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">University Data Management</h1>
            <p className="text-gray-600">Monitor and manage university data accuracy and integrity</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleSyncData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Data
            </Button>
            <Button variant="outline" onClick={handleValidateData} disabled={isValidating}>
              <Database className="w-4 h-4 mr-2" />
              {isValidating ? "Validating..." : "Validate Data"}
            </Button>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
              <Link href="/system-admin/universities/create">
                <Plus className="w-4 h-4 mr-2" />
                Add University
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="validation">Data Validation</TabsTrigger>
            <TabsTrigger value="integrity">Data Integrity</TabsTrigger>
            <TabsTrigger value="sync">Synchronization</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search universities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by verification" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="dataAccuracy">Data Accuracy</SelectItem>
                      <SelectItem value="lastUpdated">Last Updated</SelectItem>
                      <SelectItem value="applications">Applications</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Universities Table */}
            <Card>
              <CardHeader>
                <CardTitle>Universities ({sortedUniversities.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>University</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Data Accuracy</TableHead>
                      <TableHead>Programs</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUniversities.map((university) => (
                      <TableRow key={university.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{university.name}</div>
                            <div className="text-sm text-gray-500">{university.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(university.status)}
                            <Badge className={`${getStatusColor(university.status)} border-0`}>
                              {university.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getVerificationColor(university.verificationStatus)} border-0`}>
                            {university.verificationStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={university.dataAccuracy} className="w-16 h-2" />
                            <span className="text-sm font-medium">{university.dataAccuracy}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{university.totalPrograms}</TableCell>
                        <TableCell>{university.totalApplications}</TableCell>
                        <TableCell>{new Date(university.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/system-admin/universities/${university.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/system-admin/universities/${university.id}/edit`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Data Validation Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {validationErrors.length > 0 ? (
                  <div className="space-y-4">
                    {validationErrors.map((error, index) => (
                      <div key={index} className="p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-red-800">
                              {error.entity} - {error.field}
                            </h4>
                            <p className="text-sm text-red-700 mt-1">{error.error}</p>
                            <p className="text-xs text-red-600 mt-2">{new Date(error.timestamp).toLocaleString()}</p>
                          </div>
                          <Badge variant="destructive">Error</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Validation Errors</h3>
                    <p className="text-gray-600">All university data passes validation checks</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Data Integrity Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataIntegrityReport ? (
                  <div className="space-y-6">
                    {/* Duplicates */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Duplicate Records</h4>
                      {dataIntegrityReport.duplicates.length > 0 ? (
                        <div className="space-y-2">
                          {dataIntegrityReport.duplicates.map((dup: any, index: number) => (
                            <div key={index} className="p-3 border border-yellow-200 rounded bg-yellow-50">
                              <p className="text-sm text-yellow-800">
                                Duplicate {dup.field}: {dup.value} (Record #{dup.index})
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">No duplicate records found</p>
                      )}
                    </div>

                    {/* Inconsistencies */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Data Inconsistencies</h4>
                      {dataIntegrityReport.inconsistencies.length > 0 ? (
                        <div className="space-y-2">
                          {dataIntegrityReport.inconsistencies.map((inc: any, index: number) => (
                            <div key={index} className="p-3 border border-red-200 rounded bg-red-50">
                              <p className="text-sm text-red-800">
                                Record #{inc.index}: {inc.issue}
                              </p>
                              <p className="text-xs text-red-600 mt-1">Affected fields: {inc.fields.join(", ")}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">No data inconsistencies found</p>
                      )}
                    </div>

                    {/* Orphaned Records */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Orphaned Records</h4>
                      {dataIntegrityReport.orphanedRecords.length > 0 ? (
                        <div className="space-y-2">
                          {dataIntegrityReport.orphanedRecords.map((orphan: any, index: number) => (
                            <div key={index} className="p-3 border border-orange-200 rounded bg-orange-50">
                              <p className="text-sm text-orange-800">Orphaned record found: {orphan.id}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-green-600">No orphaned records found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Run Data Integrity Check</h3>
                    <p className="text-gray-600 mb-4">Click "Validate Data" to check for integrity issues</p>
                    <Button onClick={handleValidateData} disabled={isValidating}>
                      {isValidating ? "Checking..." : "Check Integrity"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  Data Synchronization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Last Sync</p>
                            <p className="text-lg font-semibold">2 hours ago</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Sync Status</p>
                            <p className="text-lg font-semibold">Healthy</p>
                          </div>
                          <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Records Synced</p>
                            <p className="text-lg font-semibold">1,247</p>
                          </div>
                          <Upload className="w-8 h-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Sync Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Sync Frequency</label>
                        <Select defaultValue="hourly">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="hourly">Every Hour</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Data Sources</label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="university_apis">University APIs</SelectItem>
                            <SelectItem value="government_db">Government Database</SelectItem>
                            <SelectItem value="manual_uploads">Manual Uploads</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleSyncData} className="w-full md:w-auto">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Force Sync Now
                    </Button>
                  </div>
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
