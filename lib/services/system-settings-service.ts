import type { AllSettings } from "@/lib/validations/system-settings"

class SystemSettingsService {
  private static instance: SystemSettingsService
  private settings: AllSettings = this.getDefaultSettings()

  static getInstance(): SystemSettingsService {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService()
    }
    return SystemSettingsService.instance
  }

  private getDefaultSettings(): AllSettings {
    return {
      general: {
        platformName: "CommonApply",
        platformDescription: "Streamlined university application platform for Ethiopian students",
        supportEmail: "support@commonapply.com",
        supportPhone: "+251911000000",
        maintenanceMode: false,
        maintenanceMessage: "We are currently performing scheduled maintenance. Please check back soon.",
        allowRegistrations: true,
        requireEmailVerification: true,
        defaultLanguage: "en",
        timezone: "Africa/Addis_Ababa",
        dateFormat: "DD/MM/YYYY",
        currency: "ETB",
      },
      security: {
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireLowercase: true,
        passwordRequireNumbers: true,
        passwordRequireSymbols: false,
        passwordExpiryDays: 90,
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        sessionTimeout: 120,
        twoFactorRequired: false,
        allowedDomains: [],
        blockedIPs: [],
        enableAuditLog: true,
        auditLogRetention: 365,
      },
      email: {
        smtpHost: "smtp.gmail.com",
        smtpPort: 587,
        smtpUsername: "",
        smtpPassword: "",
        smtpEncryption: "tls",
        fromEmail: "noreply@commonapply.com",
        fromName: "CommonApply",
        replyToEmail: "support@commonapply.com",
        emailTemplateTheme: "modern",
        enableEmailTracking: true,
        bounceHandling: true,
        unsubscribeLink: true,
      },
      payment: {
        stripePublicKey: "",
        stripeSecretKey: "",
        paypalClientId: "",
        paypalClientSecret: "",
        enableStripe: true,
        enablePaypal: true,
        enableBankTransfer: true,
        enableMobileMoney: true,
        defaultCurrency: "ETB",
        applicationFeeRange: {
          min: 100,
          max: 2000,
        },
        refundPolicy: "Refunds are processed within 5-7 business days upon approval.",
        taxRate: 15,
        processingFee: 2.5,
      },
      system: {
        maxFileUploadSize: 10,
        allowedFileTypes: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
        enableCaching: true,
        cacheExpiration: 60,
        enableCompression: true,
        enableCDN: false,
        cdnUrl: "",
        backupFrequency: "daily",
        backupRetention: 30,
        enableMonitoring: true,
        logLevel: "info",
        maxConcurrentUsers: 1000,
      },
      api: {
        enableApiAccess: true,
        apiRateLimit: 1000,
        apiKeyExpiration: 365,
        enableWebhooks: true,
        webhookSecret: "",
        enableCors: true,
        allowedOrigins: [],
        apiVersion: "v1",
        enableApiDocumentation: true,
      },
      notifications: {
        enableEmailNotifications: true,
        enableSmsNotifications: false,
        enablePushNotifications: true,
        enableInAppNotifications: true,
        notificationFrequency: "immediate",
        digestEnabled: true,
        digestTime: "09:00",
        enableNotificationHistory: true,
        historyRetention: 90,
        defaultNotificationPreferences: {
          applications: true,
          payments: true,
          system: true,
          marketing: false,
        },
      },
      branding: {
        logoUrl: "",
        faviconUrl: "",
        primaryColor: "#3B82F6",
        secondaryColor: "#64748B",
        accentColor: "#10B981",
        fontFamily: "Inter",
        customCss: "",
        footerText: "© 2024 CommonApply. All rights reserved.",
        privacyPolicyUrl: "",
        termsOfServiceUrl: "",
        enableCustomBranding: false,
      },
    }
  }

  async getSettings(): Promise<AllSettings> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return this.settings
  }

  async updateSettings(section: keyof AllSettings, data: any): Promise<boolean> {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update settings
      this.settings[section] = { ...this.settings[section], ...data }

      // Apply settings immediately
      await this.applySettings(section, data)

      console.log(`Settings updated for section: ${section}`)
      return true
    } catch (error) {
      console.error(`Failed to update settings for section ${section}:`, error)
      return false
    }
  }

  private async applySettings(section: keyof AllSettings, data: any): Promise<void> {
    switch (section) {
      case "general":
        if (data.maintenanceMode !== undefined) {
          console.log(`Maintenance mode ${data.maintenanceMode ? "enabled" : "disabled"}`)
        }
        break

      case "security":
        if (data.maxLoginAttempts !== undefined) {
          console.log(`Max login attempts updated to: ${data.maxLoginAttempts}`)
        }
        break

      case "email":
        if (data.smtpHost) {
          console.log("Email configuration updated, testing connection...")
          await this.testEmailConnection(data)
        }
        break

      case "payment":
        if (data.enableStripe !== undefined || data.enablePaypal !== undefined) {
          console.log("Payment gateway configuration updated")
        }
        break

      case "system":
        if (data.enableCaching !== undefined) {
          console.log(`Caching ${data.enableCaching ? "enabled" : "disabled"}`)
        }
        break

      case "api":
        if (data.enableApiAccess !== undefined) {
          console.log(`API access ${data.enableApiAccess ? "enabled" : "disabled"}`)
        }
        break

      case "notifications":
        if (data.notificationFrequency) {
          console.log(`Notification frequency updated to: ${data.notificationFrequency}`)
        }
        break

      case "branding":
        if (data.primaryColor || data.secondaryColor) {
          console.log("Branding colors updated, applying theme changes...")
        }
        break
    }
  }

  async testEmailConnection(emailSettings: any): Promise<boolean> {
    try {
      // Simulate email connection test
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Email connection test successful")
      return true
    } catch (error) {
      console.error("Email connection test failed:", error)
      return false
    }
  }

  async testPaymentGateway(gateway: "stripe" | "paypal", credentials: any): Promise<boolean> {
    try {
      // Simulate payment gateway test
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log(`${gateway} connection test successful`)
      return true
    } catch (error) {
      console.error(`${gateway} connection test failed:`, error)
      return false
    }
  }

  async exportSettings(): Promise<string> {
    // Export settings as JSON
    return JSON.stringify(this.settings, null, 2)
  }

  async importSettings(settingsJson: string): Promise<boolean> {
    try {
      const importedSettings = JSON.parse(settingsJson)

      // Validate imported settings structure
      if (!this.validateSettingsStructure(importedSettings)) {
        throw new Error("Invalid settings structure")
      }

      this.settings = { ...this.settings, ...importedSettings }
      console.log("Settings imported successfully")
      return true
    } catch (error) {
      console.error("Failed to import settings:", error)
      return false
    }
  }

  private validateSettingsStructure(settings: any): boolean {
    const requiredSections = ["general", "security", "email", "payment", "system", "api", "notifications", "branding"]
    return requiredSections.every((section) => section in settings)
  }

  async resetToDefaults(section?: keyof AllSettings): Promise<boolean> {
    try {
      const defaultSettings = this.getDefaultSettings()

      if (section) {
        this.settings[section] = defaultSettings[section]
        console.log(`Settings reset to defaults for section: ${section}`)
      } else {
        this.settings = defaultSettings
        console.log("All settings reset to defaults")
      }

      return true
    } catch (error) {
      console.error("Failed to reset settings:", error)
      return false
    }
  }

  async getSystemStatus(): Promise<{
    database: boolean
    email: boolean
    payment: boolean
    storage: boolean
    cache: boolean
  }> {
    // Simulate system status check
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      database: true,
      email: true,
      payment: true,
      storage: true,
      cache: this.settings.system.enableCaching,
    }
  }
}

export const systemSettingsService = SystemSettingsService.getInstance()
