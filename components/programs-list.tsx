import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, Users, Calendar, BookOpen, ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import type { University } from "@/lib/api/types"

interface ProgramsListProps {
  university: University
}

export function ProgramsList({ university }: ProgramsListProps) {
  const groupedPrograms = university.programs.reduce(
    (acc, program) => {
      if (!acc[program.type]) {
        acc[program.type] = []
      }
      acc[program.type].push(program)
      return acc
    },
    {} as Record<string, typeof university.programs>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Academic Programs ({university.programs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(groupedPrograms).map(([type, programs]) => (
            <div key={type}>
              <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {type} Programs ({programs.length})
              </h3>

              <div className="grid gap-4">
                {programs.map((program) => (
                  <div
                    key={program.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 text-lg">{program.name}</h4>
                          <Badge variant="outline" className="ml-2">
                            {program.degree}
                          </Badge>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{program.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{program.duration}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">${program.tuition_fee.toLocaleString()}/year</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{program.available_seats} seats</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              Due: {new Date(program.application_deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-700">Requirements: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {program.requirements.map((req, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:w-auto w-full">
                        <Button variant="outline" size="sm" className="w-full md:w-auto" asChild>
                          <Link href={`/universities/${university.slug}/programs/${program.id}`}>
                            View Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>

                        <Button size="sm" className="w-full md:w-auto bg-primary hover:bg-primary/90" asChild>
                          <Link href={`/apply?university=${university.id}&program=${program.id}`}>Apply Now</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
