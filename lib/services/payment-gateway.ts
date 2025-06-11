export interface PaymentGatewayConfig {
  provider: "stripe" | "paypal" | "razorpay" | "flutterwave"
  apiKey: string
  secretKey: string
  webhookSecret: string
  environment: "sandbox" | "production"
}

export interface TransactionDetails {
  id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled"
  paymentMethod: string
  customerInfo: {
    id: string
    email: string
    name: string
  }
  metadata: Record<string, any>
  createdAt: string
  updatedAt: string
  gatewayTransactionId: string
  receiptUrl?: string
  failureReason?: string
}

export interface PaymentAnalytics {
  totalTransactions: number
  totalRevenue: number
  successRate: number
  averageTransactionValue: number
  topPaymentMethods: Array<{ method: string; count: number; percentage: number }>
  monthlyTrends: Array<{ month: string; revenue: number; transactions: number }>
  failureReasons: Array<{ reason: string; count: number }>
}

export class PaymentGatewayService {
  private config: PaymentGatewayConfig
  private transactions: Map<string, TransactionDetails> = new Map()
  private webhookEvents: Array<{
    id: string
    type: string
    data: any
    timestamp: string
    processed: boolean
  }> = []

  constructor(config: PaymentGatewayConfig) {
    this.config = config
    this.initializeGateway()
  }

  private async initializeGateway() {
    // Initialize payment gateway SDK
    console.log(`Initializing ${this.config.provider} payment gateway`)
  }

  async processPayment(paymentData: {
    amount: number
    currency: string
    paymentMethod: string
    customerInfo: any
    metadata: Record<string, any>
  }): Promise<TransactionDetails> {
    try {
      // Simulate payment processing
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const gatewayTransactionId = `gw_${Date.now()}`

      const transaction: TransactionDetails = {
        id: transactionId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: Math.random() > 0.05 ? "completed" : "failed", // 95% success rate
        paymentMethod: paymentData.paymentMethod,
        customerInfo: paymentData.customerInfo,
        metadata: paymentData.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gatewayTransactionId,
        receiptUrl: `https://receipts.example.com/${transactionId}`,
        failureReason: Math.random() > 0.05 ? undefined : "Insufficient funds",
      }

      this.transactions.set(transactionId, transaction)

      // Generate receipt if successful
      if (transaction.status === "completed") {
        await this.generateReceipt(transaction)
      }

      // Log transaction
      await this.logTransaction(transaction)

      return transaction
    } catch (error) {
      throw new Error(`Payment processing failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async generateReceipt(transaction: TransactionDetails): Promise<string> {
    // Generate detailed receipt
    const receipt = {
      receiptId: `RCP_${transaction.id}`,
      transactionId: transaction.id,
      studentName: transaction.customerInfo.name,
      studentEmail: transaction.customerInfo.email,
      applicationId: transaction.metadata.applicationId,
      universityName: transaction.metadata.universityName,
      programName: transaction.metadata.programName,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentMethod: transaction.paymentMethod,
      transactionDate: transaction.createdAt,
      gatewayTransactionId: transaction.gatewayTransactionId,
      status: transaction.status,
      receiptUrl: transaction.receiptUrl,
      companyInfo: {
        name: "CommonApply",
        address: "Addis Ababa, Ethiopia",
        email: "support@commonapply.com",
        phone: "+251911221122",
      },
    }

    // Store receipt (in real app, this would be saved to database/file storage)
    console.log("Receipt generated:", receipt)

    return receipt.receiptId
  }

  async refundPayment(transactionId: string, amount?: number): Promise<TransactionDetails> {
    const transaction = this.transactions.get(transactionId)
    if (!transaction) {
      throw new Error("Transaction not found")
    }

    if (transaction.status !== "completed") {
      throw new Error("Can only refund completed transactions")
    }

    const refundAmount = amount || transaction.amount
    if (refundAmount > transaction.amount) {
      throw new Error("Refund amount cannot exceed original transaction amount")
    }

    // Process refund
    const refundTransaction: TransactionDetails = {
      ...transaction,
      id: `rfnd_${Date.now()}`,
      amount: -refundAmount,
      status: "refunded",
      updatedAt: new Date().toISOString(),
      metadata: {
        ...transaction.metadata,
        originalTransactionId: transactionId,
        refundReason: "Admin refund",
      },
    }

    this.transactions.set(refundTransaction.id, refundTransaction)
    await this.logTransaction(refundTransaction)

    return refundTransaction
  }

  async getTransactionDetails(transactionId: string): Promise<TransactionDetails | null> {
    return this.transactions.get(transactionId) || null
  }

  async getPaymentAnalytics(dateRange: { from: string; to: string }): Promise<PaymentAnalytics> {
    const transactions = Array.from(this.transactions.values()).filter(
      (t) => t.createdAt >= dateRange.from && t.createdAt <= dateRange.to,
    )

    const completedTransactions = transactions.filter((t) => t.status === "completed")
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
    const successRate = transactions.length > 0 ? (completedTransactions.length / transactions.length) * 100 : 0

    // Calculate payment method distribution
    const paymentMethodCounts = new Map<string, number>()
    completedTransactions.forEach((t) => {
      paymentMethodCounts.set(t.paymentMethod, (paymentMethodCounts.get(t.paymentMethod) || 0) + 1)
    })

    const topPaymentMethods = Array.from(paymentMethodCounts.entries())
      .map(([method, count]) => ({
        method,
        count,
        percentage: (count / completedTransactions.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)

    // Calculate failure reasons
    const failureReasons = new Map<string, number>()
    transactions
      .filter((t) => t.status === "failed")
      .forEach((t) => {
        const reason = t.failureReason || "Unknown"
        failureReasons.set(reason, (failureReasons.get(reason) || 0) + 1)
      })

    return {
      totalTransactions: transactions.length,
      totalRevenue,
      successRate,
      averageTransactionValue: completedTransactions.length > 0 ? totalRevenue / completedTransactions.length : 0,
      topPaymentMethods,
      monthlyTrends: [], // Would calculate from historical data
      failureReasons: Array.from(failureReasons.entries()).map(([reason, count]) => ({ reason, count })),
    }
  }

  private async logTransaction(transaction: TransactionDetails) {
    // Log transaction for auditing
    console.log("Transaction logged:", {
      id: transaction.id,
      amount: transaction.amount,
      status: transaction.status,
      timestamp: transaction.createdAt,
    })
  }

  async handleWebhook(payload: any, signature: string): Promise<void> {
    // Verify webhook signature
    if (!this.verifyWebhookSignature(payload, signature)) {
      throw new Error("Invalid webhook signature")
    }

    const event = {
      id: `evt_${Date.now()}`,
      type: payload.type,
      data: payload.data,
      timestamp: new Date().toISOString(),
      processed: false,
    }

    this.webhookEvents.push(event)

    // Process webhook event
    await this.processWebhookEvent(event)
  }

  private verifyWebhookSignature(payload: any, signature: string): boolean {
    // Implement signature verification logic
    return true // Simplified for demo
  }

  private async processWebhookEvent(event: any) {
    switch (event.type) {
      case "payment.completed":
        // Update transaction status
        break
      case "payment.failed":
        // Handle failed payment
        break
      case "refund.processed":
        // Handle refund
        break
      default:
        console.log("Unhandled webhook event:", event.type)
    }

    event.processed = true
  }

  getGatewayStatus(): {
    isOnline: boolean
    lastChecked: string
    responseTime: number
    errorRate: number
  } {
    return {
      isOnline: true,
      lastChecked: new Date().toISOString(),
      responseTime: Math.random() * 500 + 100, // 100-600ms
      errorRate: Math.random() * 0.05, // 0-5%
    }
  }
}

// Export singleton instance
export const paymentGatewayService = new PaymentGatewayService({
  provider: "stripe",
  apiKey: "pk_test_example",
  secretKey: "sk_test_example",
  webhookSecret: "whsec_example",
  environment: "sandbox",
})
