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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, DollarSign, Clock, CheckCircle, XCircle, Download, Search, Receipt } from "lucide-react"
import { mockPayments, mockApplications } from "@/data/mock-student-data"

interface PaymentRecord {
  id: string
  applicationId: string
  universityName: string
  programName: string
  amount: number
  currency: string
  method: string
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId: string
  timestamp: string
  receipt?: string
  description: string
}

export default function StudentPaymentsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [payments, setPayments] = useState<PaymentRecord[]>([])

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
      return
    }

    fetchPayments()
  }, [isAuthenticated, user, router])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentApi.listPayments({
        page: 1,
        limit: 100,
        sortBy: "createdAt",
        sortOrder: "desc"
      })
      
      if (response.success && response.data) {
        const paymentsData = response.data.payments || []
        
        // Fetch application details for each payment
        const paymentsWithApplications = await Promise.all(
          paymentsData.map(async (payment) => {
            try {
              const appResponse = await applicationApi.getApplication(payment.applicationId)
              return {
                ...payment,
                application: appResponse.success ? appResponse.data : undefined
              }
            } catch (error) {
              console.error(`Error fetching application ${payment.applicationId}:`, error)
              return payment
            }
          })
        )
        
        setPayments(paymentsWithApplications)
      } else {
        toast.error("Failed to load payments")
      }
    } catch (error) {
      console.error("Error fetching payments:", error)
      toast.error("Failed to load payments")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  const filteredPayments = payments.filter((payment) => {
    const universityName = payment.application?.program?.university?.name || "Unknown University"
    const programName = payment.application?.program?.name || "Unknown Program"
    const transactionId = payment.transactionId || ""
    
    const matchesSearch =
      universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transactionId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "refunded":
        return <Receipt className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalPaid = payments.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const completedPayments = payments.filter((p) => p.status === "completed").length
  const failedPayments = payments.filter((p) => p.status === "failed").length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">Track your application fees, payment status, and download receipts.</p>
        </div>

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-green-600">${totalPaid}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${pendingAmount}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedPayments}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-payments" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all-payments">All Payments</TabsTrigger>
            <TabsTrigger value="pending-payments">Pending Payments</TabsTrigger>
            <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="all-payments" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="search">Search Payments</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by university, program, or transaction ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status-filter">Filter by Status</Label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History ({filteredPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No payments found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredPayments.map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{payment.universityName}</h4>
                            <p className="text-sm text-gray-600">{payment.programName}</p>
                            <p className="text-xs text-gray-500 mt-1">{payment.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <Badge className={`${getStatusColor(payment.status)} border-0`}>{payment.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <div className="font-medium">
                              ${payment.amount} {payment.currency}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Method:</span>
                            <div className="font-medium capitalize">{payment.method.replace("_", " ")}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Transaction ID:</span>
                            <div className="font-medium font-mono text-xs">{payment.transactionId}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <div className="font-medium">{new Date(payment.timestamp).toLocaleDateString()}</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {payment.status === "completed" && payment.receipt && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download Receipt
                            </Button>
                          )}
                          {payment.status === "failed" && (
                            <Button variant="outline" size="sm">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Retry Payment
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending-payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments
                    .filter((p) => p.status === "pending")
                    .map((payment) => (
                      <div key={payment.id} className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{payment.universityName}</h4>
                            <p className="text-sm text-gray-600">{payment.programName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-yellow-600">${payment.amount}</div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">
                            <CreditCard className="w-4 h-4 mr-2" />
                            Complete Payment
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  {payments.filter((p) => p.status === "pending").length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pending payments. All payments are up to date!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="make-payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Make a Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600 mb-4">
                    Select an application to make a payment for application fees or other charges.
                  </p>

                  {mockApplications
                    .filter((app) => app.paymentStatus === "pending")
                    .map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{application.universityName}</h4>
                            <p className="text-sm text-gray-600">{application.programName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">${application.applicationFee}</div>
                            <Badge className="bg-red-100 text-red-800 border-0">Payment Due</Badge>
                          </div>
                        </div>
                        <Button>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay ${application.applicationFee}
                        </Button>
                      </div>
                    ))}

                  {mockApplications.filter((app) => app.paymentStatus === "pending").length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-gray-500">No outstanding payments required.</p>
                      <Button className="mt-4" asChild>
                        <a href="/student/applications/new">Start New Application</a>
                      </Button>
                    </div>
                  )}
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
