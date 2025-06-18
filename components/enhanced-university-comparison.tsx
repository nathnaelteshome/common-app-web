"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, MapPin, GraduationCap, Award, X, Plus, Share, Download } from "lucide-react"
import type University from "@/data/universities-data"
import { universitiesData } from "@/data/universities-data"

interface ComparisonMetric {
  label: string
  key: string
  type: "rating" | "number" | "currency" | "percentage" | "text" | "list"
  weight: number
}

const comparisonMetrics: ComparisonMetric[] = [
  { label: "Overall Rating", key: "rating", type: "rating", weight: 0.2 },
  { label: "Tuition Fee", key: "tuitionFee", type: "currency", weight: 0.15 },
  { label: "Acceptance Rate", key: "acceptanceRate", type: "percentage", weight: 0.1 },
  { label: "Student Population", key: "studentCount", type: "number", weight: 0.1 },
  { label: "Faculty Count", key: "facultyCount", type: "number", weight: 0.1 },
  { label: "Campus Size", key: "campusSize", type: "text", weight: 0.05 },
  { label: "Established", key: "established", type: "number", weight: 0.05 },
  { label: "Programs Offered", key: "programsCount", type: "number", weight: 0.15 },
  { label: "Research Focus", key: "researchFocus", type: "list", weight: 0.1 },
]

export function EnhancedUniversityComparison() {
  const [selectedUniversities, setSelectedUniversities] = useState<University[]>([])
  const [availableUniversities, setAvailableUniversities] = useState<University[]>([])
  const [comparisonScores, setComparisonScores] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    setAvailableUniversities(universitiesData)
  }, [])

  useEffect(() => {
    if (selectedUniversities.length > 1) {
      calculateComparisonScores()
    }
  }, [selectedUniversities])

  const calculateComparisonScores = () => {
    const scores: Record<string, number> = {}

    selectedUniversities.forEach((university) => {
      let totalScore = 0
      let totalWeight = 0

      comparisonMetrics.forEach((metric) => {
        const value = getMetricValue(university, metric.key)
        const normalizedScore = normalizeMetricValue(value, metric.type, metric.key)
        totalScore += normalizedScore * metric.weight
        totalWeight += metric.weight
      })

      scores[university.id] = (totalScore / totalWeight) * 100
    })

    setComparisonScores(scores)
  }

  const getMetricValue = (university: University, key: string): any => {
    switch (key) {
      case "rating":
        return university.rating
      case "tuitionFee":
        return university.tuitionRange?.min || 0
      case "acceptanceRate":
        return university.acceptanceRate || 50
      case "studentCount":
        return university.studentCount || 10000
      case "facultyCount":
        return university.facultyCount || 500
      case "campusSize":
        return university.campusSize || "Medium"
      case "established":
        return university.established || 1950
      case "programsCount":
        return university.programs?.length || 0
      case "researchFocus":
        return university.researchAreas || []
      default:
        return 0
    }
  }

  const normalizeMetricValue = (value: any, type: string, key: string): number => {
    switch (type) {
      case "rating":
        return (value / 5) * 100
      case "percentage":
        return key === "acceptanceRate" ? 100 - value : value // Lower acceptance rate is better
      case "number":
        if (key === "established") {
          return ((2024 - value) / 100) * 100 // Older is better, but cap at 100 years
        }
        return Math.min((value / 50000) * 100, 100) // Normalize to 0-100
      case "currency":
        return Math.max(100 - value / 1000, 0) // Lower cost is better
      case "list":
        return Math.min((value.length / 10) * 100, 100)
      default:
        return 50
    }
  }

  const addUniversity = (university: University) => {
    if (selectedUniversities.length < 4 && !selectedUniversities.find((u) => u.id === university.id)) {
      setSelectedUniversities((prev) => [...prev, university])
    }
  }

  const removeUniversity = (universityId: string) => {
    setSelectedUniversities((prev) => prev.filter((u) => u.id !== universityId))
  }

  const getBestValue = (metric: ComparisonMetric) => {
    if (selectedUniversities.length === 0) return null

    const values = selectedUniversities.map((uni) => getMetricValue(uni, metric.key))

    switch (metric.type) {
      case "rating":
        return Math.max(...values)
      case "currency":
        return Math.min(...values.filter((v) => v > 0))
      case "percentage":
        return metric.key === "acceptanceRate" ? Math.max(...values) : Math.min(...values)
      case "number":
        if (metric.key === "established") {
          return Math.min(...values)
        }
        return Math.max(...values)
      default:
        return values[0]
    }
  }

  const formatMetricValue = (value: any, type: string): string => {
    switch (type) {
      case "rating":
        return `${value}/5 ⭐`
      case "currency":
        return `$${value.toLocaleString()}`
      case "percentage":
        return `${value}%`
      case "number":
        return value.toLocaleString()
      case "list":
        return Array.isArray(value) ? value.join(", ") : value
      default:
        return String(value)
    }
  }

  const exportComparison = () => {
    const data = {
      universities: selectedUniversities.map((uni) => ({
        name: uni.name,
        score: comparisonScores[uni.id],
        metrics: comparisonMetrics.reduce(
          (acc, metric) => {
            acc[metric.label] = getMetricValue(uni, metric.key)
            return acc
          },
          {} as Record<string, any>,
        ),
      })),
      timestamp: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "university-comparison.json"
    a.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">University Comparison</h1>
          <p className="text-gray-600 mt-1">Compare up to 4 universities side by side</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportComparison} disabled={selectedUniversities.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" disabled={selectedUniversities.length === 0}>
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* University Selection */}
      {selectedUniversities.length < 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Universities to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableUniversities
                .filter((uni) => !selectedUniversities.find((selected) => selected.id === uni.id))
                .slice(0, 6)
                .map((university) => (
                  <div key={university.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{university.name}</h3>
                      <Button size="sm" variant="outline" onClick={() => addUniversity(university)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{university.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{university.rating}/5</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Table */}
      {selectedUniversities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparison Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="academics">Academics</TabsTrigger>
                <TabsTrigger value="costs">Costs</TabsTrigger>
                <TabsTrigger value="campus">Campus Life</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* University Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedUniversities.map((university) => (
                    <Card key={university.id} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => removeUniversity(university.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <CardContent className="p-4">
                        <div className="text-center space-y-3">
                          <img
                            src={university.image || "/placeholder.svg"}
                            alt={university.name}
                            className="w-16 h-16 rounded-full mx-auto object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-sm">{university.name}</h3>
                            <p className="text-xs text-gray-600">{university.location}</p>
                          </div>
                          {comparisonScores[university.id] && (
                            <div className="space-y-2">
                              <div className="text-center">
                                <span className="text-2xl font-bold text-blue-600">
                                  {Math.round(comparisonScores[university.id])}
                                </span>
                                <span className="text-sm text-gray-500">/100</span>
                              </div>
                              <Progress value={comparisonScores[university.id]} className="h-2" />
                              <p className="text-xs text-gray-600">Overall Score</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Comparison */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Metric</th>
                        {selectedUniversities.map((university) => (
                          <th key={university.id} className="text-center p-3 font-medium min-w-32">
                            {university.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonMetrics.map((metric) => {
                        const bestValue = getBestValue(metric)
                        return (
                          <tr key={metric.key} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{metric.label}</td>
                            {selectedUniversities.map((university) => {
                              const value = getMetricValue(university, metric.key)
                              const isBest = value === bestValue
                              return (
                                <td key={university.id} className="p-3 text-center">
                                  <div className={`${isBest ? "text-green-600 font-semibold" : ""}`}>
                                    {formatMetricValue(value, metric.type)}
                                    {isBest && <Award className="w-4 h-4 inline ml-1" />}
                                  </div>
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="academics">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Academic Programs & Rankings</h3>
                  {selectedUniversities.map((university) => (
                    <Card key={university.id}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{university.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Programs Offered</p>
                            <p>{university.programs?.length || 0} programs</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Student-Faculty Ratio</p>
                            <p>1:{Math.round((university.studentCount || 10000) / (university.facultyCount || 500))}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Research Areas</p>
                            <p>{university.researchAreas?.slice(0, 3).join(", ") || "N/A"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="costs">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tuition & Fees</h3>
                  {selectedUniversities.map((university) => (
                    <Card key={university.id}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{university.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Tuition Range</p>
                            <p>
                              ${university.tuitionRange?.min || 0} - ${university.tuitionRange?.max || 0}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Application Fee</p>
                            <p>${university.applicationFee || 50}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Financial Aid</p>
                            <p>{university.financialAid ? "Available" : "Limited"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="campus">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Campus Life & Facilities</h3>
                  {selectedUniversities.map((university) => (
                    <Card key={university.id}>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">{university.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Campus Size</p>
                            <p>{university.campusSize || "Medium"}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Student Population</p>
                            <p>{(university.studentCount || 10000).toLocaleString()} students</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Facilities</p>
                            <p>{university.facilities?.slice(0, 3).join(", ") || "Standard facilities"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedUniversities.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Start Your Comparison</h3>
            <p className="text-gray-600 mb-4">
              Select universities from the list above to begin comparing their features, costs, and programs.
            </p>
            <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Add Universities</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
