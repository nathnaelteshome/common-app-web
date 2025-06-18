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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, RefreshCw, Save, AlertTriangle, CheckCircle, TrendingUp, Activity, Clock, Target } from "lucide-react"
import { systemAdminService } from "@/lib/services/system-admin-service"
import { toast } from "sonner"

interface SortingConfig {
  weights: {
    rating: number
    acceptanceRate: number
    tuitionFee: number
    location: number
    programMatch: number
    scholarships: number
  }
  updateFrequency: "realtime" | "hourly" | "daily"
  dataSource: "live" | "cached"
  fallbackStrategy: "default" | "random" | "popularity"
  performanceThreshold: number
}

export default function SortingAlgorithmPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [config, setConfig] = useState<SortingConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [algorithmStatus, setAlgorithmStatus] = useState<any>(null)
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/auth/sign-in")
    } else {
      loadAlgorithmData()
    }
  }, [isAuthenticated, user, router])

  const loadAlgorithmData = async () => {
    try {
      setIsLoading(true)
      const [configData, statusData] = await Promise.all([
        systemAdminService.getSortingAlgorithmConfig(),
        systemAdminService.getSystemHealth(),
      ])

      setConfig(configData)
      setAlgorithmStatus(statusData.sortingAlgorithm)

      // Simulate performance metrics
      setPerformanceMetrics({
        accuracy: 94.2,
        responseTime: 45,
        throughput: 1250,
        lastUpdate: new Date().toISOString(),
        totalQueries: 15420,
        successRate: 99.8,
      })
    } catch (error) {
      console.error("Failed to load algorithm data:", error)
      toast.error("Failed to load sorting algorithm data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveConfig = async () => {
    if (!config) return

    try {
      setIsSaving(true)
      const success = await systemAdminService.updateSortingAlgorithm(config)
      if (success) {
        toast.success("Sorting algorithm configuration saved successfully")
        await loadAlgorithmData()
      } else {
        toast.error("Failed to save configuration")
      }
    } catch (error) {
      toast.error("An error occurred while saving configuration")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTriggerUpdate = async () => {
    try {
      setIsUpdating(true)
      await systemAdminService.triggerSortingUpdate()
      toast.success("Real-time sorting update triggered successfully")
      await loadAlgorithmData()
    } catch (error) {
      toast.error("Failed to trigger sorting update")
    } finally {
      setIsUpdating(false)
    }
  }

  const updateWeight = (key: keyof SortingConfig["weights"], value: number) => {
    if (!config) return

    setConfig((prev) => ({
      ...prev!,
      weights: {
        ...prev!.weights,
        [key]: value / 100, // Convert percentage to decimal
      },
    }))
  }

  const getTotalWeight = () => {
    if (!config) return 0
    return Object.values(config.weights).reduce((sum, weight) => sum + weight, 0)
  }

  const isWeightValid = () => {
    const total = getTotalWeight()
    return Math.abs(total - 1.0) < 0.01 // Allow small floating point errors
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null
  }

  if (isLoading || !config) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dynamic Sorting Algorithm</h1>
            <p className="text-gray-600">Configure and monitor the university ranking algorithm</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTriggerUpdate} disabled={isUpdating}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? "animate-spin" : ""}`} />
              {isUpdating ? "Updating..." : "Trigger Update"}
            </Button>
            <Button
              onClick={handleSaveConfig}
              disabled={isSaving || !isWeightValid()}
              className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>

        {/* Algorithm Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Algorithm Status</p>
                  <p className="text-2xl font-bold text-green-600">
                    {algorithmStatus?.status === "active" ? "Active" : "Inactive"}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Real-time updates enabled</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">{performanceMetrics?.accuracy}%</p>
                  <p className="text-xs text-blue-600 mt-1">Ranking accuracy</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Time</p>
                  <p className="text-2xl font-bold text-purple-600">{performanceMetrics?.responseTime}ms</p>
                  <p className="text-xs text-purple-600 mt-1">Average query time</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Queries/Hour</p>
                  <p className="text-2xl font-bold text-orange-600">{performanceMetrics?.throughput}</p>
                  <p className="text-xs text-orange-600 mt-1">Current throughput</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weight Validation Alert */}
        {!isWeightValid() && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Warning:</strong> The total weight is {(getTotalWeight() * 100).toFixed(1)}%. All weights must sum
              to exactly 100% for the algorithm to function correctly.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="weights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weights">Weight Configuration</TabsTrigger>
            <TabsTrigger value="settings">Algorithm Settings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="weights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ranking Weight Configuration</CardTitle>
                <p className="text-sm text-gray-600">
                  Adjust the importance of each factor in university ranking. Total must equal 100%.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(config.weights).map(([key, value]) => (
                    <div key={key} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </Label>
                        <span className="text-sm font-medium text-blue-600">{(value * 100).toFixed(1)}%</span>
                      </div>
                      <Slider
                        value={[value * 100]}
                        onValueChange={(values) => updateWeight(key as keyof SortingConfig["weights"], values[0])}
                        max={100}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="text-xs text-gray-500">{getWeightDescription(key)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Weight:</span>
                    <span className={`font-bold ${isWeightValid() ? "text-green-600" : "text-red-600"}`}>
                      {(getTotalWeight() * 100).toFixed(1)}%
                    </span>
                  </div>
                  {isWeightValid() && (
                    <div className="flex items-center gap-2 mt-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Configuration is valid</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="update-frequency">Update Frequency</Label>
                    <Select
                      value={config.updateFrequency}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev!, updateFrequency: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Every Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-source">Data Source</Label>
                    <Select
                      value={config.dataSource}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev!, dataSource: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="live">Live Data</SelectItem>
                        <SelectItem value="cached">Cached Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fallback-strategy">Fallback Strategy</Label>
                    <Select
                      value={config.fallbackStrategy}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev!, fallbackStrategy: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Ranking</SelectItem>
                        <SelectItem value="random">Random Order</SelectItem>
                        <SelectItem value="popularity">Popularity Based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="performance-threshold">Performance Threshold (%)</Label>
                    <Input
                      id="performance-threshold"
                      type="number"
                      value={config.performanceThreshold}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev!,
                          performanceThreshold: Number.parseInt(e.target.value),
                        }))
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Advanced Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="auto-optimization">Auto-optimization</Label>
                        <p className="text-sm text-gray-600">Automatically adjust weights based on user behavior</p>
                      </div>
                      <Switch id="auto-optimization" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="a-b-testing">A/B Testing</Label>
                        <p className="text-sm text-gray-600">Enable A/B testing for algorithm improvements</p>
                      </div>
                      <Switch id="a-b-testing" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="machine-learning">Machine Learning Enhancement</Label>
                        <p className="text-sm text-gray-600">Use ML to improve ranking accuracy</p>
                      </div>
                      <Switch id="machine-learning" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Algorithm Accuracy</span>
                      <span className="text-lg font-semibold text-green-600">{performanceMetrics?.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Response Time</span>
                      <span className="text-lg font-semibold text-blue-600">{performanceMetrics?.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-lg font-semibold text-purple-600">{performanceMetrics?.successRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Queries</span>
                      <span className="text-lg font-semibold text-orange-600">
                        {performanceMetrics?.totalQueries.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">Algorithm weights updated</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Performance optimization applied</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <RefreshCw className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">Real-time data sync completed</p>
                        <p className="text-xs text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Algorithm Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">Live</div>
                      <div className="text-sm text-gray-600">Algorithm Status</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{performanceMetrics?.throughput}/hr</div>
                      <div className="text-sm text-gray-600">Current Throughput</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">0</div>
                      <div className="text-sm text-gray-600">Active Errors</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Live Activity Log</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {[
                        { time: "14:32:15", action: "University ranking updated", status: "success" },
                        { time: "14:32:10", action: "Weight configuration applied", status: "success" },
                        { time: "14:32:05", action: "Data validation completed", status: "success" },
                        { time: "14:31:58", action: "Real-time sync initiated", status: "info" },
                        { time: "14:31:45", action: "Performance metrics collected", status: "success" },
                      ].map((log, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                          <div className="flex items-center gap-3">
                            <Badge variant={log.status === "success" ? "default" : "secondary"}>{log.status}</Badge>
                            <span>{log.action}</span>
                          </div>
                          <span className="text-gray-500">{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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

function getWeightDescription(key: string): string {
  const descriptions = {
    rating: "Overall university rating and reputation score",
    acceptanceRate: "How selective the university is (lower rate = higher ranking)",
    tuitionFee: "Cost of education (lower cost = higher ranking)",
    location: "Geographic location and accessibility",
    programMatch: "How well programs match student preferences",
    scholarships: "Availability of scholarships and financial aid",
  }
  return descriptions[key as keyof typeof descriptions] || ""
}
