"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Clock, DollarSign, Calendar, ArrowLeft } from "lucide-react"
import type University from "@/data/universities-data"

interface ProgramSelectionProps {
  university: University
  selectedProgramId: string | null
  onComplete: (programId: string) => void
  onBack: () => void
}

export function ProgramSelection({ university, selectedProgramId, onComplete, onBack }: ProgramSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selected, setSelected] = useState<string | null>(selectedProgramId)

  // Add null check for university
  if (!university) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No university selected. Please go back and select a university.</p>
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to University Selection
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Add null check for programs
  const programs = university.programs || []

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelect = (programId: string) => {
    setSelected(programId)
  }

  const handleContinue = () => {
    if (selected) {
      onComplete(selected)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <CardTitle>Select Program</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose your program at {university.name}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {filteredPrograms.length > 0 ? (
            filteredPrograms.map((program) => (
              <div
                key={program.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selected === program.id ? "border-primary bg-primary/5" : "border-gray-200"
                }`}
                onClick={() => handleSelect(program.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{program.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{program.type}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {program.degree}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {program.duration}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${program.tuitionFee?.toLocaleString() || "N/A"}/year</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Deadline:{" "}
                          {program.applicationDeadline
                            ? new Date(program.applicationDeadline).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{program.duration || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No programs found matching your search.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Universities
          </Button>
          <Button onClick={handleContinue} disabled={!selected}>
            Continue to Application
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
