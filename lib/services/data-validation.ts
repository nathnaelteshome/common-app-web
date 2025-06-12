import { z } from "zod"
import { universityDataSchema, paymentTransactionSchema } from "@/lib/validations/system-admin"

export class DataValidationService {
  private static instance: DataValidationService
  private validationRules: Map<string, z.ZodSchema> = new Map()
  private validationErrors: Array<{
    timestamp: string
    entity: string
    field: string
    error: string
    value: any
  }> = []

  constructor() {
    this.initializeValidationRules()
  }

  static getInstance(): DataValidationService {
    if (!DataValidationService.instance) {
      DataValidationService.instance = new DataValidationService()
    }
    return DataValidationService.instance
  }

  private initializeValidationRules() {
    this.validationRules.set("university", universityDataSchema)
    this.validationRules.set("payment", paymentTransactionSchema)

    // Custom validation rules
    this.validationRules.set(
      "email_domain",
      z.string().refine(
        (email) => {
          const domain = email.split("@")[1]
          return domain && !["tempmail.com", "10minutemail.com"].includes(domain)
        },
        { message: "Temporary email domains not allowed" },
      ),
    )

    this.validationRules.set(
      "phone_international",
      z
        .string()
        .refine((phone) => /^\+[1-9]\d{1,14}$/.test(phone), { message: "Phone must be in international format" }),
    )
  }

  async validateData<T>(
    entityType: string,
    data: T,
  ): Promise<{
    isValid: boolean
    errors: string[]
    sanitizedData?: T
  }> {
    try {
      const schema = this.validationRules.get(entityType)
      if (!schema) {
        throw new Error(`No validation schema found for entity type: ${entityType}`)
      }

      const result = schema.safeParse(data)

      if (result.success) {
        return {
          isValid: true,
          errors: [],
          sanitizedData: result.data as T,
        }
      } else {
        const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)

        // Log validation errors
        result.error.errors.forEach((err) => {
          this.logValidationError(entityType, err.path.join("."), err.message, data)
        })

        return {
          isValid: false,
          errors,
        }
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : "Unknown error"}`],
      }
    }
  }

  private logValidationError(entity: string, field: string, error: string, value: any) {
    this.validationErrors.push({
      timestamp: new Date().toISOString(),
      entity,
      field,
      error,
      value,
    })

    // Keep only last 1000 errors
    if (this.validationErrors.length > 1000) {
      this.validationErrors = this.validationErrors.slice(-1000)
    }
  }

  getValidationErrors(limit = 100) {
    return this.validationErrors.slice(-limit).reverse()
  }

  // Data integrity checks
  async checkDataIntegrity(
    entityType: string,
    data: any[],
  ): Promise<{
    duplicates: any[]
    orphanedRecords: any[]
    inconsistencies: any[]
  }> {
    const duplicates: any[] = []
    const orphanedRecords: any[] = []
    const inconsistencies: any[] = []

    if (entityType === "university") {
      // Check for duplicate emails
      const emailMap = new Map()
      data.forEach((item, index) => {
        if (emailMap.has(item.email)) {
          duplicates.push({ index, field: "email", value: item.email })
        } else {
          emailMap.set(item.email, index)
        }
      })

      // Check for inconsistent data
      data.forEach((item, index) => {
        if (item.totalStudents < 0 || item.totalFaculty < 0) {
          inconsistencies.push({
            index,
            issue: "Negative values not allowed",
            fields: ["totalStudents", "totalFaculty"],
          })
        }

        if (item.establishedYear > new Date().getFullYear()) {
          inconsistencies.push({
            index,
            issue: "Established year cannot be in the future",
            fields: ["establishedYear"],
          })
        }
      })
    }

    return { duplicates, orphanedRecords, inconsistencies }
  }

  // Sanitize data
  sanitizeData(data: any): any {
    if (typeof data === "string") {
      return data.trim().replace(/[<>]/g, "")
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeData(item))
    }

    if (typeof data === "object" && data !== null) {
      const sanitized: any = {}
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeData(value)
      }
      return sanitized
    }

    return data
  }
}

export const dataValidationService = DataValidationService.getInstance()
