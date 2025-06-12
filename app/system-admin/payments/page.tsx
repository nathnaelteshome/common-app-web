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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  Shield,
  Activity,
  TrendingUp,
  Receipt,
} from "lucide-react"
import { mockPaymentLogs } from "@/data/mock-data"
import { paymentGatewayService } from "@/lib/services/payment-gateway"
import { toast } from "sonner"

export default function PaymentManagement() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateRange, setDateRange] = useState("7d")
  const [gatewayStatus, setGatewayStatus] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      loadGatewayStatus()
      loadAnalytics()
    }
  }, [isAuthenticated, user, router])

  const loadGatewayStatus = async () => {
    const status = paymentGatewayService.getGatewayStatus()
    setGatewayStatus(status)
  }

  const loadAnalytics = async () => {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 30) // Last 30 days

    const analyticsData = await paymentGatewayService.getPaymentAnalytics({
      from: startDate.toISOString(),
      to: endDate.toISOString(),
    })
    setAnalytics(analyticsData)
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  const filteredPayments = mockPaymentLogs.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.studentEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case "refunded":
        return <RefreshCw className="w-4 h-4 text-blue-600" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />
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

  const handleRefund = async (transactionId: string) => {
    try {
      await paymentGatewayService.refundPayment(transactionId)
      toast.success("Refund processed successfully")
      // Refresh data
      loadAnalytics()
    } catch (error) {
      toast.error("Failed to process refund")
    }
  }

  const handleGenerateReceipt = async (transaction: any) => {
    try {
      const receiptId = await paymentGatewayService.generateReceipt(transaction)
      toast.success(`Receipt generated: ${receiptId}`)
    } catch (error) {
      toast.error("Failed to generate receipt")
    }
  }

  const handleTestGateway = async () => {
    try {
      const testPayment = await paymentGatewayService.processPayment({
        amount: 1,
        currency: "USD",
        paymentMethod: "test_card",
        customerInfo: {
          id: "test_customer",
          email: "test@example.com",
          name: "Test Customer",
        },
        metadata: {
          type: "gateway_test",
        },
      })
      toast.success("Gateway test successful")
    } catch (error) {
      toast.error("Gateway test failed")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Gateway Management</h1>
            <p className="text-gray-600">Monitor transactions, manage refunds, and ensure payment security</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleTestGateway}>
              <Shield className="w-4 h-4 mr-2" />
              Test Gateway
            </Button>
            <Button variant="outline" onClick={loadGatewayStatus}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Gateway Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gateway Status</p>
                  <p className="text-2xl font-bold text-green-600">{gatewayStatus?.isOnline ? "Online" : "Offline"}</p>
                  <p className="text-xs text-green-600 mt-1">Response: {gatewayStatus?.responseTime?.toFixed(0)}ms</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics?.successRate?.toFixed(1)}%</p>
                  <p className="text-xs text-blue-600 mt-1">Last 30 days</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">${analytics?.totalRevenue?.toLocaleString()}</p>
                  <p className="text-xs text-purple-600 mt-1">This month</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics?.totalTransactions?.toLocaleString()}</p>
                  <p className="text-xs text-orange-600 mt-1">This month</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search transactions..."
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-mono text-sm">{payment.transactionId}</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{payment.studentName}</div>
                            <div className="text-sm text-gray-500">{payment.studentEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{payment.universityName}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${payment.amount} {payment.currency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{payment.paymentMethod}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(payment.status)}
                            <Badge className={`${getStatusColor(payment.status)} border-0`}>{payment.status}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(payment.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(payment)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Transaction Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information for transaction {payment.transactionId}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedTransaction && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Transaction ID</label>
                                        <p className="font-mono text-sm">{selectedTransaction.transactionId}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Gateway Response</label>
                                        <p className="text-sm">{selectedTransaction.gatewayResponse}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Student Name</label>
                                        <p className="text-sm">{selectedTransaction.studentName}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Application ID</label>
                                        <p className="text-sm">{selectedTransaction.applicationId}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Amount</label>
                                        <p className="text-sm font-medium">
                                          ${selectedTransaction.amount} {selectedTransaction.currency}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Receipt Generated</label>
                                        <p className="text-sm">{selectedTransaction.receiptGenerated ? "Yes" : "No"}</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2 pt-4">
                                      {selectedTransaction.status === "completed" && (
                                        <>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRefund(selectedTransaction.id)}
                                          >
                                            Process Refund
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleGenerateReceipt(selectedTransaction)}
                                          >
                                            <Receipt className="w-4 h-4 mr-2" />
                                            Generate Receipt
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.topPaymentMethods?.map((method: any) => (
                    <div key={method.method} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">{method.method}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#0a5eb2] h-2 rounded-full"
                            style={{ width: `${method.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{method.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Failure Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics?.failureReasons?.map((reason: any) => (
                    <div key={reason.reason} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">{reason.reason}</span>
                      <Badge variant="destructive">{reason.count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">PCI DSS Compliance</p>
                            <p className="text-lg font-semibold text-green-600">Compliant</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">SSL Certificate</p>
                            <p className="text-lg font-semibold text-green-600">Valid</p>
                          </div>
                          <Shield className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Fraud Detection</p>
                            <p className="text-lg font-semibold text-blue-600">Active</p>
                          </div>
                          <Activity className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Security Logs</h4>
                    <div className="space-y-2">
                      <div className="p-3 border border-green-200 rounded bg-green-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-800">Security scan completed successfully</span>
                          <span className="text-xs text-green-600">2 hours ago</span>
                        </div>
                      </div>
                      <div className="p-3 border border-yellow-200 rounded bg-yellow-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-yellow-800">Suspicious activity detected and blocked</span>
                          <span className="text-xs text-yellow-600">1 day ago</span>
                        </div>
                      </div>
                      <div className="p-3 border border-blue-200 rounded bg-blue-50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-blue-800">Payment gateway security update applied</span>
                          <span className="text-xs text-blue-600">3 days ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gateway Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Primary Gateway</label>
                      <Select defaultValue="stripe">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="stripe">Stripe</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="razorpay">Razorpay</SelectItem>
                          <SelectItem value="flutterwave">Flutterwave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Environment</label>
                      <Select defaultValue="production">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Webhook Configuration</h4>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Webhook URL</label>
                      <Input type="url" defaultValue="https://api.commonapply.com/webhooks/payments" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Webhook Secret</label>
                      <Input type="password" defaultValue="whsec_example_secret_key" readOnly />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button>Save Configuration</Button>
                    <Button variant="outline" onClick={handleTestGateway}>
                      Test Connection
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
