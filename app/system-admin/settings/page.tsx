"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Settings,
  Shield,
  Mail,
  CreditCard,
  Server,
  Code,
  Bell,
  Palette,
  Save,
  RefreshCw,
  Download,
  Upload,
  TestTube,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { systemSettingsService } from "@/lib/services/system-settings-service"
import type { AllSettings } from "@/lib/validations/system-settings"

export default function SystemAdminSettingsPage() {
  const [settings, setSettings] = useState<AllSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [testing, setTesting] = useState<string | null>(null)
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    loadSettings()
    loadSystemStatus()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await systemSettingsService.getSettings()
      setSettings(data)
    } catch (error) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const loadSystemStatus = async () => {
    try {
      const status = await systemSettingsService.getSystemStatus()
      setSystemStatus(status)
    } catch (error) {
      console.error("Failed to load system status:", error)
    }
  }

  const handleSaveSection = async (section: keyof AllSettings, data: any) => {
    try {
      setSaving(section)
      const success = await systemSettingsService.updateSettings(section, data)

      if (success) {
        setSettings((prev) => (prev ? { ...prev, [section]: { ...prev[section], ...data } } : null))
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully`)
      } else {
        toast.error("Failed to save settings")
      }
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setSaving(null)
    }
  }

  const handleTestConnection = async (type: "email" | "stripe" | "paypal") => {
    try {
      setTesting(type)
      let success = false

      switch (type) {
        case "email":
          success = await systemSettingsService.testEmailConnection(settings?.email)
          break
        case "stripe":
          success = await systemSettingsService.testPaymentGateway("stripe", {
            publicKey: settings?.payment.stripePublicKey,
            secretKey: settings?.payment.stripeSecretKey,
          })
          break
        case "paypal":
          success = await systemSettingsService.testPaymentGateway("paypal", {
            clientId: settings?.payment.paypalClientId,
            clientSecret: settings?.payment.paypalClientSecret,
          })
          break
      }

      if (success) {
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} connection test successful`)
      } else {
        toast.error(`${type.charAt(0).toUpperCase() + type.slice(1)} connection test failed`)
      }
    } catch (error) {
      toast.error("Connection test failed")
    } finally {
      setTesting(null)
    }
  }

  const handleExportSettings = async () => {
    try {
      const settingsJson = await systemSettingsService.exportSettings()
      const blob = new Blob([settingsJson], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `commonapply-settings-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Settings exported successfully")
    } catch (error) {
      toast.error("Failed to export settings")
    }
  }

  const handleImportSettings = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const success = await systemSettingsService.importSettings(text)

      if (success) {
        await loadSettings()
        toast.success("Settings imported successfully")
      } else {
        toast.error("Failed to import settings")
      }
    } catch (error) {
      toast.error("Failed to import settings")
    }
  }

  const handleResetSection = async (section: keyof AllSettings) => {
    try {
      const success = await systemSettingsService.resetToDefaults(section)

      if (success) {
        await loadSettings()
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings reset to defaults`)
      } else {
        toast.error("Failed to reset settings")
      }
    } catch (error) {
      toast.error("Failed to reset settings")
    }
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => document.getElementById("import-file")?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <input id="import-file" type="file" accept=".json" className="hidden" onChange={handleImportSettings} />
        </div>
      </div>

      {/* System Status */}
      {systemStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="flex items-center space-x-2">
                  {status ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="capitalize">{key}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general" className="flex items-center space-x-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center space-x-1">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-1">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-1">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center space-x-1">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Branding</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <GeneralSettingsTab
            settings={settings.general}
            onSave={(data) => handleSaveSection("general", data)}
            onReset={() => handleResetSection("general")}
            saving={saving === "general"}
          />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <SecuritySettingsTab
            settings={settings.security}
            onSave={(data) => handleSaveSection("security", data)}
            onReset={() => handleResetSection("security")}
            saving={saving === "security"}
          />
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <EmailSettingsTab
            settings={settings.email}
            onSave={(data) => handleSaveSection("email", data)}
            onReset={() => handleResetSection("email")}
            onTest={() => handleTestConnection("email")}
            saving={saving === "email"}
            testing={testing === "email"}
          />
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <PaymentSettingsTab
            settings={settings.payment}
            onSave={(data) => handleSaveSection("payment", data)}
            onReset={() => handleResetSection("payment")}
            onTestStripe={() => handleTestConnection("stripe")}
            onTestPaypal={() => handleTestConnection("paypal")}
            saving={saving === "payment"}
            testing={testing}
          />
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <SystemSettingsTab
            settings={settings.system}
            onSave={(data) => handleSaveSection("system", data)}
            onReset={() => handleResetSection("system")}
            saving={saving === "system"}
          />
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api">
          <ApiSettingsTab
            settings={settings.api}
            onSave={(data) => handleSaveSection("api", data)}
            onReset={() => handleResetSection("api")}
            saving={saving === "api"}
          />
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <NotificationSettingsTab
            settings={settings.notifications}
            onSave={(data) => handleSaveSection("notifications", data)}
            onReset={() => handleResetSection("notifications")}
            saving={saving === "notifications"}
          />
        </TabsContent>

        {/* Branding Settings */}
        <TabsContent value="branding">
          <BrandingSettingsTab
            settings={settings.branding}
            onSave={(data) => handleSaveSection("branding", data)}
            onReset={() => handleResetSection("branding")}
            saving={saving === "branding"}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// General Settings Tab Component
function GeneralSettingsTab({ settings, onSave, onReset, saving }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure basic platform settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                value={formData.platformName}
                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                placeholder="Enter platform name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                placeholder="support@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={formData.supportPhone}
                onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                placeholder="+251911000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultLanguage">Default Language</Label>
              <Select
                value={formData.defaultLanguage}
                onValueChange={(value) => setFormData({ ...formData, defaultLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="am">Amharic</SelectItem>
                  <SelectItem value="or">Oromo</SelectItem>
                  <SelectItem value="ti">Tigrinya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => setFormData({ ...formData, timezone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Addis_Ababa">Africa/Addis_Ababa</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">America/New_York</SelectItem>
                  <SelectItem value="Europe/London">Europe/London</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformDescription">Platform Description</Label>
            <Textarea
              id="platformDescription"
              value={formData.platformDescription}
              onChange={(e) => setFormData({ ...formData, platformDescription: e.target.value })}
              placeholder="Enter platform description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Enable maintenance mode to prevent user access</p>
              </div>
              <Switch
                checked={formData.maintenanceMode}
                onCheckedChange={(checked) => setFormData({ ...formData, maintenanceMode: checked })}
              />
            </div>

            {formData.maintenanceMode && (
              <div className="space-y-2">
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={formData.maintenanceMessage || ""}
                  onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                  placeholder="Enter maintenance message"
                  rows={2}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Registrations</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
              </div>
              <Switch
                checked={formData.allowRegistrations}
                onCheckedChange={(checked) => setFormData({ ...formData, allowRegistrations: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Email Verification</Label>
                <p className="text-sm text-muted-foreground">Require users to verify their email addresses</p>
              </div>
              <Switch
                checked={formData.requireEmailVerification}
                onCheckedChange={(checked) => setFormData({ ...formData, requireEmailVerification: checked })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Security Settings Tab Component
function SecuritySettingsTab({ settings, onSave, onReset, saving }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Configure security policies and authentication settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Password Policy</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  min="6"
                  max="32"
                  value={formData.passwordMinLength}
                  onChange={(e) => setFormData({ ...formData, passwordMinLength: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordExpiryDays">Password Expiry (Days)</Label>
                <Input
                  id="passwordExpiryDays"
                  type="number"
                  min="0"
                  max="365"
                  value={formData.passwordExpiryDays}
                  onChange={(e) => setFormData({ ...formData, passwordExpiryDays: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Uppercase</Label>
                  <p className="text-sm text-muted-foreground">At least one uppercase letter</p>
                </div>
                <Switch
                  checked={formData.passwordRequireUppercase}
                  onCheckedChange={(checked) => setFormData({ ...formData, passwordRequireUppercase: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Lowercase</Label>
                  <p className="text-sm text-muted-foreground">At least one lowercase letter</p>
                </div>
                <Switch
                  checked={formData.passwordRequireLowercase}
                  onCheckedChange={(checked) => setFormData({ ...formData, passwordRequireLowercase: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Numbers</Label>
                  <p className="text-sm text-muted-foreground">At least one number</p>
                </div>
                <Switch
                  checked={formData.passwordRequireNumbers}
                  onCheckedChange={(checked) => setFormData({ ...formData, passwordRequireNumbers: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Symbols</Label>
                  <p className="text-sm text-muted-foreground">At least one special character</p>
                </div>
                <Switch
                  checked={formData.passwordRequireSymbols}
                  onCheckedChange={(checked) => setFormData({ ...formData, passwordRequireSymbols: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Login Security</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  min="3"
                  max="10"
                  value={formData.maxLoginAttempts}
                  onChange={(e) => setFormData({ ...formData, maxLoginAttempts: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lockoutDuration">Lockout Duration (Minutes)</Label>
                <Input
                  id="lockoutDuration"
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.lockoutDuration}
                  onChange={(e) => setFormData({ ...formData, lockoutDuration: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="15"
                  max="480"
                  value={formData.sessionTimeout}
                  onChange={(e) => setFormData({ ...formData, sessionTimeout: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all user accounts</p>
              </div>
              <Switch
                checked={formData.twoFactorRequired}
                onCheckedChange={(checked) => setFormData({ ...formData, twoFactorRequired: checked })}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Audit & Monitoring</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Audit Logging</Label>
                <p className="text-sm text-muted-foreground">Log all user actions and system events</p>
              </div>
              <Switch
                checked={formData.enableAuditLog}
                onCheckedChange={(checked) => setFormData({ ...formData, enableAuditLog: checked })}
              />
            </div>

            {formData.enableAuditLog && (
              <div className="space-y-2">
                <Label htmlFor="auditLogRetention">Audit Log Retention (Days)</Label>
                <Input
                  id="auditLogRetention"
                  type="number"
                  min="30"
                  max="2555"
                  value={formData.auditLogRetention}
                  onChange={(e) => setFormData({ ...formData, auditLogRetention: Number.parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Email Settings Tab Component
function EmailSettingsTab({ settings, onSave, onReset, onTest, saving, testing }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Settings</CardTitle>
        <CardDescription>Configure SMTP settings and email preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">SMTP Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={formData.smtpHost}
                  onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  min="1"
                  max="65535"
                  value={formData.smtpPort}
                  onChange={(e) => setFormData({ ...formData, smtpPort: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUsername">SMTP Username</Label>
                <Input
                  id="smtpUsername"
                  value={formData.smtpUsername}
                  onChange={(e) => setFormData({ ...formData, smtpUsername: e.target.value })}
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={formData.smtpPassword}
                  onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpEncryption">Encryption</Label>
                <Select
                  value={formData.smtpEncryption}
                  onValueChange={(value) => setFormData({ ...formData, smtpEncryption: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button type="button" variant="outline" onClick={onTest} disabled={testing} className="w-full">
                  {testing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TestTube className="h-4 w-4 mr-2" />}
                  Test Connection
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Identity</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.fromEmail}
                  onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                  placeholder="noreply@commonapply.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={formData.fromName}
                  onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  placeholder="CommonApply"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyToEmail">Reply-To Email</Label>
                <Input
                  id="replyToEmail"
                  type="email"
                  value={formData.replyToEmail}
                  onChange={(e) => setFormData({ ...formData, replyToEmail: e.target.value })}
                  placeholder="support@commonapply.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailTemplateTheme">Template Theme</Label>
                <Select
                  value={formData.emailTemplateTheme}
                  onValueChange={(value) => setFormData({ ...formData, emailTemplateTheme: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Features</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Tracking</Label>
                  <p className="text-sm text-muted-foreground">Track email opens and clicks</p>
                </div>
                <Switch
                  checked={formData.enableEmailTracking}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableEmailTracking: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bounce Handling</Label>
                  <p className="text-sm text-muted-foreground">Handle bounced emails</p>
                </div>
                <Switch
                  checked={formData.bounceHandling}
                  onCheckedChange={(checked) => setFormData({ ...formData, bounceHandling: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Unsubscribe Link</Label>
                  <p className="text-sm text-muted-foreground">Include unsubscribe links</p>
                </div>
                <Switch
                  checked={formData.unsubscribeLink}
                  onCheckedChange={(checked) => setFormData({ ...formData, unsubscribeLink: checked })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Payment Settings Tab Component
function PaymentSettingsTab({ settings, onSave, onReset, onTestStripe, onTestPaypal, saving, testing }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Settings</CardTitle>
        <CardDescription>Configure payment gateways and processing options</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Gateways</h3>

            {/* Stripe Configuration */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Stripe</Label>
                  <p className="text-sm text-muted-foreground">Credit card processing</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enableStripe}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableStripe: checked })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onTestStripe}
                    disabled={testing === "stripe" || !formData.enableStripe}
                  >
                    {testing === "stripe" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {formData.enableStripe && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stripePublicKey">Public Key</Label>
                    <Input
                      id="stripePublicKey"
                      value={formData.stripePublicKey}
                      onChange={(e) => setFormData({ ...formData, stripePublicKey: e.target.value })}
                      placeholder="pk_test_..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stripeSecretKey">Secret Key</Label>
                    <Input
                      id="stripeSecretKey"
                      type="password"
                      value={formData.stripeSecretKey}
                      onChange={(e) => setFormData({ ...formData, stripeSecretKey: e.target.value })}
                      placeholder="sk_test_..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PayPal Configuration */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">PayPal</Label>
                  <p className="text-sm text-muted-foreground">PayPal payments</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.enablePaypal}
                    onCheckedChange={(checked) => setFormData({ ...formData, enablePaypal: checked })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onTestPaypal}
                    disabled={testing === "paypal" || !formData.enablePaypal}
                  >
                    {testing === "paypal" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {formData.enablePaypal && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paypalClientId">Client ID</Label>
                    <Input
                      id="paypalClientId"
                      value={formData.paypalClientId}
                      onChange={(e) => setFormData({ ...formData, paypalClientId: e.target.value })}
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paypalClientSecret">Client Secret</Label>
                    <Input
                      id="paypalClientSecret"
                      type="password"
                      value={formData.paypalClientSecret}
                      onChange={(e) => setFormData({ ...formData, paypalClientSecret: e.target.value })}
                      placeholder="PayPal Client Secret"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Other Payment Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bank Transfer</Label>
                  <p className="text-sm text-muted-foreground">Enable bank transfers</p>
                </div>
                <Switch
                  checked={formData.enableBankTransfer}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableBankTransfer: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mobile Money</Label>
                  <p className="text-sm text-muted-foreground">Enable mobile money payments</p>
                </div>
                <Switch
                  checked={formData.enableMobileMoney}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableMobileMoney: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select
                  value={formData.defaultCurrency}
                  onValueChange={(value) => setFormData({ ...formData, defaultCurrency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ETB">Ethiopian Birr (ETB)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: Number.parseFloat(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.processingFee}
                  onChange={(e) => setFormData({ ...formData, processingFee: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minFee">Minimum Application Fee</Label>
                <Input
                  id="minFee"
                  type="number"
                  min="0"
                  value={formData.applicationFeeRange.min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationFeeRange: {
                        ...formData.applicationFeeRange,
                        min: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFee">Maximum Application Fee</Label>
                <Input
                  id="maxFee"
                  type="number"
                  min="0"
                  value={formData.applicationFeeRange.max}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      applicationFeeRange: {
                        ...formData.applicationFeeRange,
                        max: Number.parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refundPolicy">Refund Policy</Label>
              <Textarea
                id="refundPolicy"
                value={formData.refundPolicy}
                onChange={(e) => setFormData({ ...formData, refundPolicy: e.target.value })}
                placeholder="Enter refund policy details"
                rows={3}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// System Settings Tab Component
function SystemSettingsTab({ settings, onSave, onReset, saving }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure system performance and storage settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">File Upload Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                <Input
                  id="maxFileUploadSize"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxFileUploadSize}
                  onChange={(e) => setFormData({ ...formData, maxFileUploadSize: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={formData.allowedFileTypes.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowedFileTypes: e.target.value.split(",").map((type) => type.trim()),
                    })
                  }
                  placeholder="pdf, doc, docx, jpg, png"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Caching</Label>
                  <p className="text-sm text-muted-foreground">Improve performance with caching</p>
                </div>
                <Switch
                  checked={formData.enableCaching}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableCaching: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">Compress responses for faster loading</p>
                </div>
                <Switch
                  checked={formData.enableCompression}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableCompression: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable CDN</Label>
                  <p className="text-sm text-muted-foreground">Use CDN for static assets</p>
                </div>
                <Switch
                  checked={formData.enableCDN}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableCDN: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Monitoring</Label>
                  <p className="text-sm text-muted-foreground">Monitor system performance</p>
                </div>
                <Switch
                  checked={formData.enableMonitoring}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableMonitoring: checked })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cacheExpiration">Cache Expiration (Minutes)</Label>
                <Input
                  id="cacheExpiration"
                  type="number"
                  min="5"
                  max="1440"
                  value={formData.cacheExpiration}
                  onChange={(e) => setFormData({ ...formData, cacheExpiration: Number.parseInt(e.target.value) })}
                  disabled={!formData.enableCaching}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxConcurrentUsers">Max Concurrent Users</Label>
                <Input
                  id="maxConcurrentUsers"
                  type="number"
                  min="100"
                  max="10000"
                  value={formData.maxConcurrentUsers}
                  onChange={(e) => setFormData({ ...formData, maxConcurrentUsers: Number.parseInt(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logLevel">Log Level</Label>
                <Select
                  value={formData.logLevel}
                  onValueChange={(value) => setFormData({ ...formData, logLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.enableCDN && (
              <div className="space-y-2">
                <Label htmlFor="cdnUrl">CDN URL</Label>
                <Input
                  id="cdnUrl"
                  type="url"
                  value={formData.cdnUrl || ""}
                  onChange={(e) => setFormData({ ...formData, cdnUrl: e.target.value })}
                  placeholder="https://cdn.example.com"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Backup Settings</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select
                  value={formData.backupFrequency}
                  onValueChange={(value) => setFormData({ ...formData, backupFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupRetention">Backup Retention (Days)</Label>
                <Input
                  id="backupRetention"
                  type="number"
                  min="7"
                  max="365"
                  value={formData.backupRetention}
                  onChange={(e) => setFormData({ ...formData, backupRetention: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// API Settings Tab Component
function ApiSettingsTab({ settings, onSave, onReset, saving }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Settings</CardTitle>
        <CardDescription>Configure API access and security settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">API Access</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable API Access</Label>
                <p className="text-sm text-muted-foreground">Allow external API access</p>
              </div>
              <Switch
                checked={formData.enableApiAccess}
                onCheckedChange={(checked) => setFormData({ ...formData, enableApiAccess: checked })}
              />
            </div>

            {formData.enableApiAccess && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="apiRateLimit">Rate Limit (requests/hour)</Label>
                  <Input
                    id="apiRateLimit"
                    type="number"
                    min="10"
                    max="10000"
                    value={formData.apiRateLimit}
                    onChange={(e) => setFormData({ ...formData, apiRateLimit: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKeyExpiration">API Key Expiration (Days)</Label>
                  <Input
                    id="apiKeyExpiration"
                    type="number"
                    min="30"
                    max="365"
                    value={formData.apiKeyExpiration}
                    onChange={(e) => setFormData({ ...formData, apiKeyExpiration: Number.parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiVersion">API Version</Label>
                  <Select
                    value={formData.apiVersion}
                    onValueChange={(value) => setFormData({ ...formData, apiVersion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1</SelectItem>
                      <SelectItem value="v2">Version 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Webhooks</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Webhooks</Label>
                <p className="text-sm text-muted-foreground">Allow webhook notifications</p>
              </div>
              <Switch
                checked={formData.enableWebhooks}
                onCheckedChange={(checked) => setFormData({ ...formData, enableWebhooks: checked })}
              />
            </div>

            {formData.enableWebhooks && (
              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <Input
                  id="webhookSecret"
                  type="password"
                  value={formData.webhookSecret || ""}
                  onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                  placeholder="Enter webhook secret"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">CORS Settings</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable CORS</Label>
                <p className="text-sm text-muted-foreground">Allow cross-origin requests</p>
              </div>
              <Switch
                checked={formData.enableCors}
                onCheckedChange={(checked) => setFormData({ ...formData, enableCors: checked })}
              />
            </div>

            {formData.enableCors && (
              <div className="space-y-2">
                <Label htmlFor="allowedOrigins">Allowed Origins</Label>
                <Input
                  id="allowedOrigins"
                  value={formData.allowedOrigins?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allowedOrigins: e.target.value
                        .split(",")
                        .map((origin) => origin.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="https://example.com, https://app.example.com"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Documentation</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable API Documentation</Label>
                <p className="text-sm text-muted-foreground">Provide public API documentation</p>
              </div>
              <Switch
                checked={formData.enableApiDocumentation}
                onCheckedChange={(checked) => setFormData({ ...formData, enableApiDocumentation: checked })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Notification Settings Tab Component
function NotificationSettingsTab({ settings, onSave, onReset, saving }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure notification channels and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Channels</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via email</p>
                </div>
                <Switch
                  checked={formData.enableEmailNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableEmailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                </div>
                <Switch
                  checked={formData.enableSmsNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableSmsNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send push notifications</p>
                </div>
                <Switch
                  checked={formData.enablePushNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enablePushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In-App Notifications</Label>
                  <p className="text-sm text-muted-foreground">Show in-app notifications</p>
                </div>
                <Switch
                  checked={formData.enableInAppNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableInAppNotifications: checked })}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Frequency</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="notificationFrequency">Frequency</Label>
                <Select
                  value={formData.notificationFrequency}
                  onValueChange={(value) => setFormData({ ...formData, notificationFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="digestTime">Daily Digest Time</Label>
                <Input
                  id="digestTime"
                  type="time"
                  value={formData.digestTime}
                  onChange={(e) => setFormData({ ...formData, digestTime: e.target.value })}
                  disabled={!formData.digestEnabled}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Daily Digest</Label>
                <p className="text-sm text-muted-foreground">Send daily summary of notifications</p>
              </div>
              <Switch
                checked={formData.digestEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, digestEnabled: checked })}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Default Preferences</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Application Notifications</Label>
                  <p className="text-sm text-muted-foreground">Application status updates</p>
                </div>
                <Switch
                  checked={formData.defaultNotificationPreferences.applications}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      defaultNotificationPreferences: {
                        ...formData.defaultNotificationPreferences,
                        applications: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Notifications</Label>
                  <p className="text-sm text-muted-foreground">Payment confirmations and receipts</p>
                </div>
                <Switch
                  checked={formData.defaultNotificationPreferences.payments}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      defaultNotificationPreferences: {
                        ...formData.defaultNotificationPreferences,
                        payments: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Notifications</Label>
                  <p className="text-sm text-muted-foreground">System updates and maintenance</p>
                </div>
                <Switch
                  checked={formData.defaultNotificationPreferences.system}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      defaultNotificationPreferences: {
                        ...formData.defaultNotificationPreferences,
                        system: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Notifications</Label>
                  <p className="text-sm text-muted-foreground">Promotional content and updates</p>
                </div>
                <Switch
                  checked={formData.defaultNotificationPreferences.marketing}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      defaultNotificationPreferences: {
                        ...formData.defaultNotificationPreferences,
                        marketing: checked,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">History & Retention</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notification History</Label>
                  <p className="text-sm text-muted-foreground">Keep history of sent notifications</p>
                </div>
                <Switch
                  checked={formData.enableNotificationHistory}
                  onCheckedChange={(checked) => setFormData({ ...formData, enableNotificationHistory: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="historyRetention">History Retention (Days)</Label>
                <Input
                  id="historyRetention"
                  type="number"
                  min="30"
                  max="365"
                  value={formData.historyRetention}
                  onChange={(e) => setFormData({ ...formData, historyRetention: Number.parseInt(e.target.value) })}
                  disabled={!formData.enableNotificationHistory}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Branding Settings Tab Component
function BrandingSettingsTab({ settings, onSave, onReset, saving }: any) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branding Settings</CardTitle>
        <CardDescription>Customize the platform's appearance and branding</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Brand Assets</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={formData.logoUrl || ""}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  type="url"
                  value={formData.faviconUrl || ""}
                  onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Color Scheme</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    placeholder="#64748B"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    placeholder="#10B981"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Typography</h3>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Font Family</Label>
              <Select
                value={formData.fontFamily}
                onValueChange={(value) => setFormData({ ...formData, fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Custom Styling</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Custom Branding</Label>
                <p className="text-sm text-muted-foreground">Apply custom branding across the platform</p>
              </div>
              <Switch
                checked={formData.enableCustomBranding}
                onCheckedChange={(checked) => setFormData({ ...formData, enableCustomBranding: checked })}
              />
            </div>

            {formData.enableCustomBranding && (
              <div className="space-y-2">
                <Label htmlFor="customCss">Custom CSS</Label>
                <Textarea
                  id="customCss"
                  value={formData.customCss || ""}
                  onChange={(e) => setFormData({ ...formData, customCss: e.target.value })}
                  placeholder="/* Add your custom CSS here */"
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Footer & Legal</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="privacyPolicyUrl">Privacy Policy URL</Label>
                <Input
                  id="privacyPolicyUrl"
                  type="url"
                  value={formData.privacyPolicyUrl || ""}
                  onChange={(e) => setFormData({ ...formData, privacyPolicyUrl: e.target.value })}
                  placeholder="https://example.com/privacy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="termsOfServiceUrl">Terms of Service URL</Label>
                <Input
                  id="termsOfServiceUrl"
                  type="url"
                  value={formData.termsOfServiceUrl || ""}
                  onChange={(e) => setFormData({ ...formData, termsOfServiceUrl: e.target.value })}
                  placeholder="https://example.com/terms"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={formData.footerText || ""}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                placeholder="© 2024 CommonApply. All rights reserved."
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6">
            <Button type="button" variant="outline" onClick={onReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
