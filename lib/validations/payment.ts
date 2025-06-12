import { z } from "zod"

export const paymentSchema = z.object({
  paymentMethod: z.enum(["credit-card", "bank-transfer", "mobile-money"]),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  cardDetails: z
    .object({
      cardNumber: z.string().min(1, "Card number is required").optional(),
      cardName: z.string().min(1, "Cardholder name is required").optional(),
      expiryDate: z.string().min(1, "Expiry date is required").optional(),
      cvv: z.string().min(3, "CVV must be at least 3 digits").optional(),
    })
    .optional(),
  bankDetails: z
    .object({
      accountNumber: z.string().optional(),
      routingNumber: z.string().optional(),
      bankName: z.string().optional(),
    })
    .optional(),
  mobileDetails: z
    .object({
      phoneNumber: z.string().optional(),
      provider: z.string().optional(),
    })
    .optional(),
})

export type PaymentData = z.infer<typeof paymentSchema>
