"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CreditCard, Building, Smartphone, Shield } from "lucide-react"
import { paymentSchema, type PaymentData } from "@/lib/validations/payment"
import type University from "@/data/universities-data"

interface PaymentStepProps {
  university: University
  programId: string
  onComplete: (data: PaymentData) => void
  onBack: () => void
}

export function PaymentStep({ university, programId, onComplete, onBack }: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)

  const program = university.programs.find((p) => p.id === programId)
  const applicationFee = 50 // Base application fee
  const processingFee = 5
  const total = applicationFee + processingFee

  const form = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "credit-card",
      amount: total,
      currency: "USD",
    },
  })

  const handleSubmit = async (data: PaymentData) => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentResult = {
        ...data,
        transactionId: `TXN-${Date.now()}`,
        status: "completed",
        timestamp: new Date().toISOString(),
      }

      onComplete(paymentResult)
    } catch (error) {
      console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <CardTitle>Payment</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Application fee for {program?.name} at {university.name}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Summary */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span>Application Fee</span>
                  <span>${applicationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee</span>
                  <span>${processingFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Secure Payment</h4>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                    <Building className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                      Bank Transfer
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="mobile-money" id="mobile-money" />
                    <Smartphone className="w-5 h-5 text-gray-600" />
                    <Label htmlFor="mobile-money" className="flex-1 cursor-pointer">
                      Mobile Money
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Credit Card Form */}
              {paymentMethod === "credit-card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      {...form.register("cardDetails.cardNumber")}
                      className={form.formState.errors.cardDetails?.cardNumber ? "border-red-500" : ""}
                    />
                    {form.formState.errors.cardDetails?.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.cardDetails.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      {...form.register("cardDetails.cardName")}
                      className={form.formState.errors.cardDetails?.cardName ? "border-red-500" : ""}
                    />
                    {form.formState.errors.cardDetails?.cardName && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.cardDetails.cardName.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        {...form.register("cardDetails.expiryDate")}
                        className={form.formState.errors.cardDetails?.expiryDate ? "border-red-500" : ""}
                      />
                      {form.formState.errors.cardDetails?.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {form.formState.errors.cardDetails.expiryDate.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        {...form.register("cardDetails.cvv")}
                        className={form.formState.errors.cardDetails?.cvv ? "border-red-500" : ""}
                      />
                      {form.formState.errors.cardDetails?.cvv && (
                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.cardDetails.cvv.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Instructions */}
              {paymentMethod === "bank-transfer" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Bank Transfer Instructions</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Bank:</strong> CommonApply Bank
                    </p>
                    <p>
                      <strong>Account Number:</strong> 1234567890
                    </p>
                    <p>
                      <strong>Routing Number:</strong> 987654321
                    </p>
                    <p>
                      <strong>Reference:</strong> APP-{university.id}-{programId}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    Please include the reference number in your transfer description.
                  </p>
                </div>
              )}

              {/* Mobile Money Instructions */}
              {paymentMethod === "mobile-money" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Mobile Money Payment</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Service:</strong> M-Pesa, Airtel Money, or MTN Mobile Money
                    </p>
                    <p>
                      <strong>Merchant Code:</strong> 123456
                    </p>
                    <p>
                      <strong>Amount:</strong> ${total}
                    </p>
                    <p>
                      <strong>Reference:</strong> APP-{university.id}-{programId}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6 border-t">
                <Button type="button" variant="outline" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Application
                </Button>

                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : `Pay $${total}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
