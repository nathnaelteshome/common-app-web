"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Star } from "lucide-react"
import { universities } from "@/data/universities-data"
import type University from "@/data/universities-data"

interface UniversitySelectionProps {
  selectedUniversity: University | null
  onComplete: (university: University) => void
}

export function UniversitySelection({ selectedUniversity, onComplete }: UniversitySelectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selected, setSelected] = useState<University | null>(selectedUniversity)

  const filteredUniversities = universities.filter(
    (university) =>
      university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      university.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (university: University) => {
    setSelected(university)
  }

  const handleContinue = () => {
    if (selected) {
      onComplete(selected)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select University</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search universities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredUniversities.map((university) => (
            <div
              key={university.id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selected?.id === university.id ? "border-primary bg-primary/5" : "border-gray-200"
              }`}
              onClick={() => handleSelect(university)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={university.image || "/placeholder.svg"}
                  alt={university.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{university.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    {university.location}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {university.rating || "N/A"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {university.totalStudents?.toLocaleString() || "N/A"}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {university.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleContinue} disabled={!selected}>
            Continue to Program Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
