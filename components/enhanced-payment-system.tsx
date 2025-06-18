"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Shield, Lock, CheckCircle, AlertCircle, Smartphone, Building, Wallet } from "lucide-react"
import { toast } from "sonner"

interface PaymentMethod {
  id: string
  type: "credit_card" | "debit_card" | "mobile_money" | "bank_transfer" | "digital_wallet"
  name: string
  icon: React.ReactNode
  fees: number
  processingTime: string
  isAvailable: boolean
}

interface PaymentData {
  amount: number
  currency: string
  applicationId: string
  universityName: string
  programName: string
  description: string
}

interface EnhancedPaymentSystemProps {
  paymentData: PaymentData
  onPaymentComplete: (paymentResult: any) => void
  onCancel: () => void
}

export function EnhancedPaymentSystem({ paymentData, onPaymentComplete, onCancel }: EnhancedPaymentSystemProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [paymentDetails, setPaymentDetails] = useState<Record<string, any>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<"method" | "details" | "confirmation" | "processing" | "success">("method")

  const paymentMethods: PaymentMethod[] = [
    {
      id: "credit_card",
      type: "credit_card",
      name: "Credit Card",
      icon: <CreditCard className="w-5 h-5" />,
      fees: 2.5,
      processingTime: "Instant",
      isAvailable: true,
    },
    {
      id: "debit_card",
      type: "debit_card",
      name: "Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      fees: 1.5,
      processingTime: "Instant",
      isAvailable: true,
    },
    {
      id: "mobile_money",
      type: "mobile_money",
      name: "Mobile Money (M-Pesa, Telebirr)",
      icon: <Smartphone className="w-5 h-5" />,
      fees: 1.0,
      processingTime: "1-2 minutes",
      isAvailable: true,
    },
    {
      id: "bank_transfer",
      type: "bank_transfer",
      name: "Bank Transfer",
      icon: <Building className="w-5 h-5" />,
      fees: 0.5,
      processingTime: "1-3 business days",
      isAvailable: true,
    },
    {
      id: "digital_wallet",
      type: "digital_wallet",
      name: "Digital Wallet",
      icon: <Wallet className="w-5 h-5" />,
      fees: 1.0,
      processingTime: "Instant",
      isAvailable: false,
    },
  ]

  const selectedPaymentMethod = paymentMethods.find((m) => m.id === selectedMethod)
  const processingFee = selectedPaymentMethod ? (paymentData.amount * selectedPaymentMethod.fees) / 100 : 0
  const totalAmount = paymentData.amount + processingFee

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    setStep("details")
  }

  const handlePaymentDetailsSubmit = () => {
    setStep("confirmation")
  }

  const handleConfirmPayment = async () => {
    setStep("processing")
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate payment success (90% success rate)
      if (Math.random() > 0.1) {
        const paymentResult = {
          id: `pay_${Date.now()}`,
          status: "completed",
          amount: totalAmount,
          currency: paymentData.currency,
          method: selectedMethod,
          transactionId: `TXN${Date.now()}`,
          timestamp: new Date().toISOString(),
          receipt: `receipt_${Date.now()}.pdf`,
        }

        setStep("success")
        toast.success("Payment completed successfully!")

        setTimeout(() => {
          onPaymentComplete(paymentResult)
        }, 2000)
      } else {
        throw new Error("Payment failed. Please try again.")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed")
      setStep("details")
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentDetails = () => {
    if (!selectedPaymentMethod) return null

    switch (selectedPaymentMethod.type) {
      case "credit_card":
      case "debit_card":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentDetails.cardNumber || ""}
                  onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate || ""}
                  onChange={(e) => setPaymentDetails((prev) => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv || ""}
                  onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cvv: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={paymentDetails.cardName || ""}
                  onChange={(e) => setPaymentDetails((prev) => ({ ...prev, cardName: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )

      case "mobile_money":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="provider">Mobile Money Provider</Label>
              <Select
                value={paymentDetails.provider || ""}
                onValueChange={(value) => setPaymentDetails((prev) => ({ ...prev, provider: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telebirr">Telebirr</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="ebirr">eBirr</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="+251 9XX XXX XXX"
                value={paymentDetails.phoneNumber || ""}
                onChange={(e) => setPaymentDetails((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              />
            </div>
          </div>
        )

      case "bank_transfer":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Select
                value={paymentDetails.bankName || ""}
                onValueChange={(value) => setPaymentDetails((prev) => ({ ...prev, bankName: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cbe">Commercial Bank of Ethiopia</SelectItem>
                  <SelectItem value="dashen">Dashen Bank</SelectItem>
                  <SelectItem value="awash">Awash Bank</SelectItem>
                  <SelectItem value="boa">Bank of Abyssinia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="1234567890"
                value={paymentDetails.accountNumber || ""}
                onChange={(e) => setPaymentDetails((prev) => ({ ...prev, accountNumber: e.target.value }))}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (step === "success") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your application fee has been processed successfully.</p>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-700">
              <strong>Amount Paid:</strong> {paymentData.currency} {totalAmount.toFixed(2)}
            </p>
            <p className="text-sm text-green-700">
              <strong>Transaction ID:</strong> TXN{Date.now()}
            </p>
          </div>
          <p className="text-xs text-gray-500">A receipt has been sent to your email address.</p>
        </CardContent>
      </Card>
    )
  }

  if (step === "processing") {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Payment...</h2>
          <p className="text-gray-600">Please wait while we process your payment. Do not close this window.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Secure Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Application to {paymentData.universityName}</span>
              <span>
                {paymentData.currency} {paymentData.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Program: {paymentData.programName}</span>
            </div>
            {selectedPaymentMethod && (
              <>
                <Separator />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Processing Fee ({selectedPaymentMethod.fees}%)</span>
                  <span>
                    {paymentData.currency} {processingFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Amount</span>
                  <span>
                    {paymentData.currency} {totalAmount.toFixed(2)}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      {step === "method" && (
        <Card>
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => method.isAvailable && handleMethodSelect(method.id)}
                  disabled={!method.isAvailable}
                  className={`w-full p-4 border rounded-lg text-left transition-colors ${
                    method.isAvailable ? "hover:bg-gray-50 border-gray-200" : "opacity-50 cursor-not-allowed bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-600">
                          Fee: {method.fees}% • {method.processingTime}
                        </p>
                      </div>
                    </div>
                    {!method.isAvailable && <Badge variant="secondary">Coming Soon</Badge>}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Details */}
      {step === "details" && selectedPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {selectedPaymentMethod.icon}
              {selectedPaymentMethod.name} Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {renderPaymentDetails()}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("method")}>
                  Back
                </Button>
                <Button onClick={handlePaymentDetailsSubmit} className="flex-1">
                  Continue to Confirmation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Confirmation */}
      {step === "confirmation" && selectedPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Payment Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span>{selectedPaymentMethod.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span>
                      {paymentData.currency} {totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Time:</span>
                    <span>{selectedPaymentMethod.processingTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Important:</p>
                  <p>Once confirmed, this payment cannot be cancelled. Please review all details carefully.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("details")}>
                  Back
                </Button>
                <Button onClick={handleConfirmPayment} className="flex-1 bg-green-600 hover:bg-green-700">
                  Confirm Payment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Button */}
      <div className="text-center">
        <Button variant="ghost" onClick={onCancel}>
          Cancel Payment
        </Button>
      </div>
    </div>
  )
}
