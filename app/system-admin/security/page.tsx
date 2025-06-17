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
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Key, AlertTriangle, CheckCircle, Eye, Activity, Settings, RefreshCw } from "lucide-react"
import { systemAdminService } from "@/lib/services/system-admin-service"
import { toast } from "sonner"

export default function SecurityManagementPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [passwordRecoveryRequests, setPasswordRecoveryRequests] = useState<any[]>([])
  const [securitySettings, setSecuritySettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      loadSecurityData()
    }
  }, [isAuthenticated, user, router])

  const loadSecurityData = async () => {
    try {
      setIsLoading(true)
      const [requests, settings] = await Promise.all([
        systemAdminService.getPasswordRecoveryRequests(),
        loadSecuritySettings(),
      ])

      setPasswordRecoveryRequests(requests)
      setSecuritySettings(settings)
    } catch (error) {
      console.error("Failed to load security data:", error)
      toast.error("Failed to load security data")
    } finally {
      setIsLoading(false)
    }
  }

  const loadSecuritySettings = async () => {
    // Mock security settings
    return {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90,
      },
      accountSecurity: {
        maxLoginAttempts: 5,
        lockoutDuration: 30,
        sessionTimeout: 60,
        twoFactorRequired: false,
      },
      recoverySettings: {
        autoApproval: false,
        requireAdminApproval: true,
        maxRecoveryAttempts: 3,
        recoveryTokenExpiry: 24,
      },
    }
  }

  const handleApproveRecovery = async (requestId: string) => {
    try {
      const success = await systemAdminService.approvePasswordRecovery(requestId)
      if (success) {
        toast.success("Password recovery approved")
        setPasswordRecoveryRequests((prev) =>
          prev.map((req) => (req.id === requestId ? { ...req, status: "approved", approvedBy: user?.email } : req)),
        )
      }
    } catch (error) {
      toast.error("Failed to approve password recovery")
    }
  }

  const handleRejectRecovery = async (requestId: string) => {
    try {
      setPasswordRecoveryRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status: "rejected", rejectedBy: user?.email } : req)),
      )
      toast.success("Password recovery rejected")
    } catch (error) {
      toast.error("Failed to reject password recovery")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const pendingRequests = passwordRecoveryRequests.filter((req) => req.status === "pending")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Security Management</h1>
            <p className="text-gray-600">Manage platform security and password recovery requests</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadSecurityData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
          </div>
        </div>

        {/* Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Security Status</p>
                  <p className="text-2xl font-bold text-green-600">Secure</p>
                  <p className="text-xs text-green-600 mt-1">All systems protected</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Recoveries</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingRequests.length}</p>
                  <p className="text-xs text-orange-600 mt-1">Require approval</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Key className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-xs text-blue-600 mt-1">Currently logged in</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                  <p className="text-2xl font-bold text-purple-600">23</p>
                  <p className="text-xs text-purple-600 mt-1">Last 24 hours</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>{pendingRequests.length} password recovery requests</strong> are pending your approval.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="recovery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recovery">Password Recovery</TabsTrigger>
            <TabsTrigger value="policies">Security Policies</TabsTrigger>
            <TabsTrigger value="monitoring">Security Monitoring</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="recovery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password Recovery Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {passwordRecoveryRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{request.email}</h4>
                          <p className="text-sm text-gray-600">
                            Requested: {new Date(request.requestedAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(request.status)} border-0`}>{request.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-600">IP Address:</span>
                          <span className="ml-2 font-medium">{request.ipAddress}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Security Question:</span>
                          <span className="ml-2 font-medium">
                            {request.securityQuestionAnswered ? "Answered" : "Not Answered"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">User Agent:</span>
                          <span className="ml-2 font-medium">{request.userAgent.substring(0, 30)}...</span>
                        </div>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveRecovery(request.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectRecovery(request.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      )}

                      {request.status === "approved" && (
                        <div className="text-sm text-green-600">Approved by {request.approvedBy}</div>
                      )}
                    </div>
                  ))}

                  {passwordRecoveryRequests.length === 0 && (
                    <div className="text-center py-8">
                      <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recovery Requests</h3>
                      <p className="text-gray-600">All password recovery requests have been processed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-6">
            {securitySettings && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Password Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="min-length">Minimum Length</Label>
                      <Input
                        id="min-length"
                        type="number"
                        value={securitySettings.passwordPolicy.minLength}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              minLength: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-uppercase">Require Uppercase</Label>
                        <Switch
                          id="require-uppercase"
                          checked={securitySettings.passwordPolicy.requireUppercase}
                          onCheckedChange={(checked) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireUppercase: checked,
                              },
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-lowercase">Require Lowercase</Label>
                        <Switch
                          id="require-lowercase"
                          checked={securitySettings.passwordPolicy.requireLowercase}
                          onCheckedChange={(checked) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireLowercase: checked,
                              },
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-numbers">Require Numbers</Label>
                        <Switch
                          id="require-numbers"
                          checked={securitySettings.passwordPolicy.requireNumbers}
                          onCheckedChange={(checked) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireNumbers: checked,
                              },
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="require-special">Require Special Characters</Label>
                        <Switch
                          id="require-special"
                          checked={securitySettings.passwordPolicy.requireSpecialChars}
                          onCheckedChange={(checked) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              passwordPolicy: {
                                ...prev.passwordPolicy,
                                requireSpecialChars: checked,
                              },
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-age">Password Max Age (days)</Label>
                      <Input
                        id="max-age"
                        type="number"
                        value={securitySettings.passwordPolicy.maxAge}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              maxAge: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-attempts">Max Login Attempts</Label>
                      <Input
                        id="max-attempts"
                        type="number"
                        value={securitySettings.accountSecurity.maxLoginAttempts}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            accountSecurity: {
                              ...prev.accountSecurity,
                              maxLoginAttempts: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                      <Input
                        id="lockout-duration"
                        type="number"
                        value={securitySettings.accountSecurity.lockoutDuration}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            accountSecurity: {
                              ...prev.accountSecurity,
                              lockoutDuration: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={securitySettings.accountSecurity.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            accountSecurity: {
                              ...prev.accountSecurity,
                              sessionTimeout: Number.parseInt(e.target.value),
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="two-factor">Require Two-Factor Authentication</Label>
                      <Switch
                        id="two-factor"
                        checked={securitySettings.accountSecurity.twoFactorRequired}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            accountSecurity: {
                              ...prev.accountSecurity,
                              twoFactorRequired: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Security Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        type: "login_failure",
                        message: "Failed login attempt from 192.168.1.100",
                        time: "2 minutes ago",
                        severity: "medium",
                      },
                      {
                        type: "password_reset",
                        message: "Password reset approved for user@example.com",
                        time: "15 minutes ago",
                        severity: "low",
                      },
                      {
                        type: "account_locked",
                        message: "Account locked due to multiple failed attempts",
                        time: "1 hour ago",
                        severity: "high",
                      },
                      {
                        type: "suspicious_activity",
                        message: "Unusual login pattern detected",
                        time: "2 hours ago",
                        severity: "high",
                      },
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              event.severity === "high"
                                ? "bg-red-500"
                                : event.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <div>
                            <p className="font-medium text-sm">{event.message}</p>
                            <p className="text-xs text-gray-500">{event.time}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.type.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Successful Logins (24h)</span>
                      <span className="text-lg font-semibold text-green-600">2,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Failed Logins (24h)</span>
                      <span className="text-lg font-semibold text-red-600">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Blocked IPs</span>
                      <span className="text-lg font-semibold text-orange-600">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Sessions</span>
                      <span className="text-lg font-semibold text-blue-600">1,247</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recovery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {securitySettings && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-approval">Auto-approve Recovery Requests</Label>
                        <p className="text-sm text-gray-600">
                          Automatically approve requests that pass security checks
                        </p>
                      </div>
                      <Switch
                        id="auto-approval"
                        checked={securitySettings.recoverySettings.autoApproval}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            recoverySettings: {
                              ...prev.recoverySettings,
                              autoApproval: checked,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="admin-approval">Require Admin Approval</Label>
                        <p className="text-sm text-gray-600">All recovery requests must be manually approved</p>
                      </div>
                      <Switch
                        id="admin-approval"
                        checked={securitySettings.recoverySettings.requireAdminApproval}
                        onCheckedChange={(checked) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            recoverySettings: {
                              ...prev.recoverySettings,
                              requireAdminApproval: checked,
                            },
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-recovery-attempts">Max Recovery Attempts</Label>
                        <Input
                          id="max-recovery-attempts"
                          type="number"
                          value={securitySettings.recoverySettings.maxRecoveryAttempts}
                          onChange={(e) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              recoverySettings: {
                                ...prev.recoverySettings,
                                maxRecoveryAttempts: Number.parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="token-expiry">Recovery Token Expiry (hours)</Label>
                        <Input
                          id="token-expiry"
                          type="number"
                          value={securitySettings.recoverySettings.recoveryTokenExpiry}
                          onChange={(e) =>
                            setSecuritySettings((prev) => ({
                              ...prev,
                              recoverySettings: {
                                ...prev.recoverySettings,
                                recoveryTokenExpiry: Number.parseInt(e.target.value),
                              },
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button>Save Security Settings</Button>
                  <Button variant="outline">Reset to Defaults</Button>
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
