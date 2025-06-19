"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, CreditCard, Receipt, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
import { paymentApi, type Payment } from "@/lib/api/payments"
import { applicationApi, type Application } from "@/lib/api/applications"
import { toast } from "sonner"

export default function PaymentDetailsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const [payment, setPayment] = useState<Payment | null>(null)
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "student") {
      router.push("/auth/sign-in")
      return
    }

    fetchPaymentDetails()
  }, [isAuthenticated, user, router, params.id])

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true)
      const paymentId = params.id as string
      
      const paymentResponse = await paymentApi.getPayment(paymentId)
      
      if (!paymentResponse.success || !paymentResponse.data) {
        toast.error("Payment not found")
        router.push("/student/payments")
        return
      }
      
      setPayment(paymentResponse.data)
      
      // Fetch related application
      try {
        const appResponse = await applicationApi.getApplication(paymentResponse.data.applicationId)
        if (appResponse.success) {
          setApplication(appResponse.data)
        }
      } catch (error) {
        console.error("Error fetching application:", error)
      }
      
    } catch (error) {
      console.error("Error fetching payment details:", error)
      toast.error("Failed to load payment details")
      router.push("/student/payments")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated || user?.role !== "student") {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading payment details...</span>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Payment not found</p>
            <Button onClick={() => router.push("/student/payments")} className="mt-4">
              Back to Payments
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Receipt className="w-5 h-5 text-gray-600" />
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.push("/student/payments")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Payments
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600">Transaction ID: {payment.transactionId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payment Information</CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <Badge className={`${getStatusColor(payment.status)} border-0`}>
                      {payment.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Amount</label>
                    <p className="text-2xl font-bold text-gray-900">
                      ${payment.amount} {payment.currency}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Method</label>
                    <p className="text-lg font-medium capitalize">{payment.method.replace("_", " ")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction Date</label>
                    <p className="text-lg font-medium">
                      {new Date(payment.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                    <p className="text-lg font-mono font-medium">{payment.transactionId}</p>
                  </div>
                </div>

                <Separator />

                {application && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Application Details</label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900">{application.universityName}</h4>
                      <p className="text-gray-600">{application.programName}</p>
                      <p className="text-sm text-gray-500 mt-1">Application ID: {application.id}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Receipt */}
            {payment.status === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Receipt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">CommonApply</h3>
                      <p className="text-gray-600">Payment Receipt</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Application Fee</span>
                        <span>${payment.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee</span>
                        <span>$0.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${payment.amount}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                      <p>Thank you for your payment!</p>
                      <p>Receipt generated on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button variant="outline">
                      <Receipt className="w-4 h-4 mr-2" />
                      Print Receipt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {payment.status === "completed" && (
                  <>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Receipt className="w-4 h-4 mr-2" />
                      Email Receipt
                    </Button>
                  </>
                )}

                {payment.status === "failed" && (
                  <Button className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Retry Payment
                  </Button>
                )}

                {payment.status === "pending" && (
                  <Button className="w-full">
                    <Clock className="w-4 h-4 mr-2" />
                    Check Status
                  </Button>
                )}

                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            {/* Payment Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Payment Initiated</p>
                      <p className="text-sm text-gray-500">{new Date(payment.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {payment.status === "completed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Payment Completed</p>
                        <p className="text-sm text-gray-500">{new Date(payment.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}

                  {payment.status === "failed" && (
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Payment Failed</p>
                        <p className="text-sm text-gray-500">{new Date(payment.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
