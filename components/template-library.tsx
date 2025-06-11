"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Star,
  Users,
  Eye,
  Copy,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  FileText,
  Award,
  Globe,
  GraduationCap,
  RefreshCw,
} from "lucide-react"
import { type FormTemplate, mockFormTemplates, templateCategories } from "@/data/form-templates"

interface TemplateLibraryProps {
  onSelectTemplate: (template: FormTemplate) => void
  onPreviewTemplate: (template: FormTemplate) => void
  selectedTemplateId?: string
}

export function TemplateLibrary({ onSelectTemplate, onPreviewTemplate, selectedTemplateId }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredTemplates = mockFormTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.usageCount - a.usageCount
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "undergraduate":
        return <GraduationCap className="w-4 h-4" />
      case "graduate":
        return <Award className="w-4 h-4" />
      case "international":
        return <Globe className="w-4 h-4" />
      case "scholarship":
        return <Award className="w-4 h-4" />
      case "transfer":
        return <RefreshCw className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const renderTemplateCard = (template: FormTemplate) => (
    <Card
      key={template.id}
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selectedTemplateId === template.id ? "ring-2 ring-[#0a5eb2]" : ""
      }`}
      onClick={() => onSelectTemplate(template)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(template.category)}
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            </div>
          </div>
          {template.isDefault && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Official
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {template.thumbnail && (
          <div className="mb-4">
            <img
              src={template.thumbnail || "/placeholder.svg"}
              alt={template.name}
              className="w-full h-32 object-cover rounded-lg border"
            />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="font-medium">{template.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Users className="w-4 h-4" />
              <span>{template.usageCount.toLocaleString()} uses</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <span>{template.fields.length} fields</span>
            <span className="mx-2">•</span>
            <span>v{template.version}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPreviewTemplate(template)
              }}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelectTemplate(template)
              }}
              className="flex-1 bg-[#0a5eb2] hover:bg-[#0a5eb2]/90"
            >
              <Copy className="w-4 h-4 mr-1" />
              Use Template
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderTemplateList = (template: FormTemplate) => (
    <Card
      key={template.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedTemplateId === template.id ? "ring-2 ring-[#0a5eb2]" : ""
      }`}
      onClick={() => onSelectTemplate(template)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {template.thumbnail && (
              <img
                src={template.thumbnail || "/placeholder.svg"}
                alt={template.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {getCategoryIcon(template.category)}
                <h3 className="font-semibold">{template.name}</h3>
                {template.isDefault && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Official
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{template.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{template.usageCount.toLocaleString()}</span>
                </div>
                <span>{template.fields.length} fields</span>
                <span>v{template.version}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onPreviewTemplate(template)
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelectTemplate(template)
              }}
              className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90"
            >
              <Copy className="w-4 h-4 mr-1" />
              Use Template
            </Button>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Form Templates</h2>
          <p className="text-gray-600">Choose from our library of pre-designed forms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {templateCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {templateCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Templates Grid/List */}
      {sortedTemplates.length > 0 ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {sortedTemplates.map((template) =>
            viewMode === "grid" ? renderTemplateCard(template) : renderTemplateList(template),
          )}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No templates available in this category"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
