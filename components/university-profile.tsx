import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, GraduationCap, Star, Globe, Phone, Mail, Building, Award, BookOpen } from "lucide-react"
import Image from "next/image"
import type { University } from "@/data/universities-data"

interface UniversityProfileProps {
  university: University
}

export function UniversityProfile({ university }: UniversityProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden">
            <Image src={university.image || "/placeholder.svg"} alt={university.name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{university.name}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {university.location}, {university.region}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(university.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {university.rating} ({university.totalApplicants.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Badge variant={university.type === "Public" ? "default" : "secondary"}>
                  {university.type} University
                </Badge>
                <Badge variant="outline">Est. {university.establishedYear}</Badge>
              </div>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{university.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-900">{university.totalStudents.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Students</div>
              </div>

              <div className="text-center">
                <GraduationCap className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-900">{university.programs.length}</div>
                <div className="text-xs text-gray-500">Programs</div>
              </div>

              <div className="text-center">
                <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-900">{university.studentToFacultyRatio}</div>
                <div className="text-xs text-gray-500">Student:Faculty</div>
              </div>

              <div className="text-center">
                <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-sm font-semibold text-gray-900">{university.acceptanceRate}%</div>
                <div className="text-xs text-gray-500">Acceptance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {university.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">admissions@{university.slug}.edu.et</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">+251-11-{Math.floor(Math.random() * 900000 + 100000)}</span>
              </div>
            </div>
          </div>

          {/* Campus Information */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4" />
              Campus Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Campus Size:</span>
                <span className="font-medium">{university.campusSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Founded:</span>
                <span className="font-medium">{university.establishedYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{university.type}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Campus Facilities</h3>
          <div className="flex flex-wrap gap-2">
            {university.facilities.map((facility, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {facility}
              </Badge>
            ))}
          </div>
        </div>

        {/* Accreditations */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Accreditations</h3>
          <div className="flex flex-wrap gap-2">
            {university.accreditations.map((accreditation, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {accreditation}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
