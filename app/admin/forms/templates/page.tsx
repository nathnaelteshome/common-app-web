"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Trash2, Copy, Star, Download, Settings } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { mockFormTemplates } from "@/data/form-templates"

export default function FormTemplates() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [templates, setTemplates] = useState(mockFormTemplates)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "university") {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "university") {
    return null
  }

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDuplicateTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      const duplicatedTemplate = {
        ...template,
        id: `template_${Date.now()}`,
        name: `${template.name} (Copy)`,
        isDefault: false,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: user?.email || "current-user",
      }
      setTemplates([...templates, duplicatedTemplate])
      toast.success("Template duplicated successfully")
    }
  }

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template?.isDefault) {
      toast.error("Cannot delete default templates")
      return
    }

    if (window.confirm("Are you sure you want to delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== templateId))
      toast.success("Template deleted successfully")
    }
  }

  const handleExportTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      const dataStr = JSON.stringify(template, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${template.name.replace(/\s+/g, "_")}_template.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Template exported successfully")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Form Templates</h1>
            <p className="text-gray-600">Manage and customize your form templates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/forms/create">
                <Plus className="w-4 h-4 mr-2" />
                Create New Form
              </Link>
            </Button>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
              <Link href="/admin/forms/templates/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "undergraduate" ? "default" : "outline"}
              onClick={() => setSelectedCategory("undergraduate")}
            >
              Undergraduate
            </Button>
            <Button
              variant={selectedCategory === "graduate" ? "default" : "outline"}
              onClick={() => setSelectedCategory("graduate")}
            >
              Graduate
            </Button>
            <Button
              variant={selectedCategory === "scholarship" ? "default" : "outline"}
              onClick={() => setSelectedCategory("scholarship")}
            >
              Scholarship
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {template.category}
                      </Badge>
                      {template.isDefault && (
                        <Badge variant="secondary">
                          <Star className="w-3 h-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Fields: {template.fields.length}</span>
                    <span>Used: {template.usageCount} times</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rating: {template.rating}/5</span>
                    <span>Version: {template.version}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/admin/forms/templates/${template.id}/preview`}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDuplicateTemplate(template.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExportTemplate(template.id)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    {!template.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Settings className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Create your first custom template to get started"}
            </p>
            <Button className="bg-[#0a5eb2] hover:bg-[#0a5eb2]/90" asChild>
              <Link href="/admin/forms/templates/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Link>
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
