import { z } from "zod"

// General Platform Settings
export const generalSettingsSchema = z.object({
  platformName: z.string().min(2, "Platform name must be at least 2 characters"),
  platformDescription: z.string().min(10, "Description must be at least 10 characters"),
  supportEmail: z.string().email("Invalid email format"),
  supportPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().optional(),
  allowRegistrations: z.boolean(),
  requireEmailVerification: z.boolean(),
  defaultLanguage: z.enum(["en", "am", "or", "ti"]),
  timezone: z.string(),
  dateFormat: z.enum(["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]),
  currency: z.enum(["USD", "EUR", "ETB"]),
})

// Security Settings
export const securitySettingsSchema = z.object({
  passwordMinLength: z.number().min(6).max(32),
  passwordRequireUppercase: z.boolean(),
  passwordRequireLowercase: z.boolean(),
  passwordRequireNumbers: z.boolean(),
  passwordRequireSymbols: z.boolean(),
  passwordExpiryDays: z.number().min(0).max(365),
  maxLoginAttempts: z.number().min(3).max(10),
  lockoutDuration: z.number().min(5).max(1440), // minutes
  sessionTimeout: z.number().min(15).max(480), // minutes
  twoFactorRequired: z.boolean(),
  allowedDomains: z.array(z.string()).optional(),
  blockedIPs: z.array(z.string()).optional(),
  enableAuditLog: z.boolean(),
  auditLogRetention: z.number().min(30).max(2555), // days
})

// Email Settings
export const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().min(1).max(65535),
  smtpUsername: z.string().min(1, "SMTP username is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  smtpEncryption: z.enum(["none", "tls", "ssl"]),
  fromEmail: z.string().email("Invalid from email"),
  fromName: z.string().min(1, "From name is required"),
  replyToEmail: z.string().email("Invalid reply-to email"),
  emailTemplateTheme: z.enum(["default", "modern", "classic"]),
  enableEmailTracking: z.boolean(),
  bounceHandling: z.boolean(),
  unsubscribeLink: z.boolean(),
})

// Payment Settings
export const paymentSettingsSchema = z.object({
  stripePublicKey: z.string().optional(),
  stripeSecretKey: z.string().optional(),
  paypalClientId: z.string().optional(),
  paypalClientSecret: z.string().optional(),
  enableStripe: z.boolean(),
  enablePaypal: z.boolean(),
  enableBankTransfer: z.boolean(),
  enableMobileMoney: z.boolean(),
  defaultCurrency: z.enum(["USD", "EUR", "ETB"]),
  applicationFeeRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }),
  refundPolicy: z.string().min(10, "Refund policy must be at least 10 characters"),
  taxRate: z.number().min(0).max(100),
  processingFee: z.number().min(0).max(100),
})

// System Settings
export const systemSettingsSchema = z.object({
  maxFileUploadSize: z.number().min(1).max(100), // MB
  allowedFileTypes: z.array(z.string()),
  enableCaching: z.boolean(),
  cacheExpiration: z.number().min(5).max(1440), // minutes
  enableCompression: z.boolean(),
  enableCDN: z.boolean(),
  cdnUrl: z.string().url().optional(),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]),
  backupRetention: z.number().min(7).max(365), // days
  enableMonitoring: z.boolean(),
  logLevel: z.enum(["error", "warn", "info", "debug"]),
  maxConcurrentUsers: z.number().min(100).max(10000),
})

// API Settings
export const apiSettingsSchema = z.object({
  enableApiAccess: z.boolean(),
  apiRateLimit: z.number().min(10).max(10000), // requests per hour
  apiKeyExpiration: z.number().min(30).max(365), // days
  enableWebhooks: z.boolean(),
  webhookSecret: z.string().optional(),
  enableCors: z.boolean(),
  allowedOrigins: z.array(z.string()).optional(),
  apiVersion: z.enum(["v1", "v2"]),
  enableApiDocumentation: z.boolean(),
})

// Notification Settings
export const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  enableSmsNotifications: z.boolean(),
  enablePushNotifications: z.boolean(),
  enableInAppNotifications: z.boolean(),
  notificationFrequency: z.enum(["immediate", "hourly", "daily", "weekly"]),
  digestEnabled: z.boolean(),
  digestTime: z.string(), // HH:MM format
  enableNotificationHistory: z.boolean(),
  historyRetention: z.number().min(30).max(365), // days
  defaultNotificationPreferences: z.object({
    applications: z.boolean(),
    payments: z.boolean(),
    system: z.boolean(),
    marketing: z.boolean(),
  }),
})

// Branding Settings
export const brandingSettingsSchema = z.object({
  logoUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
  fontFamily: z.enum(["Inter", "Roboto", "Open Sans", "Lato", "Poppins"]),
  customCss: z.string().optional(),
  footerText: z.string().optional(),
  privacyPolicyUrl: z.string().url().optional(),
  termsOfServiceUrl: z.string().url().optional(),
  enableCustomBranding: z.boolean(),
})

export type GeneralSettings = z.infer<typeof generalSettingsSchema>
export type SecuritySettings = z.infer<typeof securitySettingsSchema>
export type EmailSettings = z.infer<typeof emailSettingsSchema>
export type PaymentSettings = z.infer<typeof paymentSettingsSchema>
export type SystemSettings = z.infer<typeof systemSettingsSchema>
export type ApiSettings = z.infer<typeof apiSettingsSchema>
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>
export type BrandingSettings = z.infer<typeof brandingSettingsSchema>

export interface AllSettings {
  general: GeneralSettings
  security: SecuritySettings
  email: EmailSettings
  payment: PaymentSettings
  system: SystemSettings
  api: ApiSettings
  notifications: NotificationSettings
  branding: BrandingSettings
}
