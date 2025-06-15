export interface Program {
  id: string
  name: string
  type: string
  duration: string
  degree: string
  description: string
  requirements: string[]
  tuitionFee: number
  availableSeats: number
  applicationDeadline: string
}

export interface University {
  id: string
  name: string
  shortName: string
  slug: string
  location: string
  city: string
  region: string
  type: "Public" | "Private"
  establishedYear: number
  rating: number
  totalStudents: number
  totalApplicants: number
  acceptanceRate: number
  image: string
  description: string
  website: string
  programs: Program[]
  facilities: string[]
  accreditations: string[]
  campusSize: string
  studentToFacultyRatio: string
}

export const universities: University[] = [
  {
    id: "1",
    name: "Addis Ababa Institute of Technology University",
    shortName: "AAiT",
    slug: "addis-ababa-institute-technology",
    location: "Addis Ababa",
    city: "Addis Ababa",
    region: "Addis Ababa",
    type: "Public",
    establishedYear: 1950,
    rating: 5.0,
    totalStudents: 25000,
    totalApplicants: 45000,
    acceptanceRate: 55,
    image: "/placeholder.svg?height=300&width=400&query=modern university building with glass facade",
    description: "Leading technological university in Ethiopia, known for engineering and technology programs.",
    website: "https://www.aait.edu.et",
    facilities: ["Library", "Laboratory", "Sports Complex", "Dormitory", "Cafeteria", "Research Centers"],
    accreditations: ["Ministry of Education", "Engineering Accreditation Board"],
    campusSize: "150 hectares",
    studentToFacultyRatio: "15:1",
    programs: [
      {
        id: "1",
        name: "Computer Science and Engineering",
        type: "Engineering",
        duration: "4 years",
        degree: "Bachelor",
        description: "Comprehensive program covering software development, algorithms, and computer systems.",
        requirements: ["Mathematics", "Physics", "English"],
        tuitionFee: 15000,
        availableSeats: 120,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "2",
        name: "Electrical Engineering",
        type: "Engineering",
        duration: "4 years",
        degree: "Bachelor",
        description: "Focus on electrical systems, power generation, and electronics.",
        requirements: ["Mathematics", "Physics", "Chemistry"],
        tuitionFee: 14000,
        availableSeats: 100,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "3",
        name: "Civil Engineering",
        type: "Engineering",
        duration: "4 years",
        degree: "Bachelor",
        description: "Infrastructure development, construction, and urban planning.",
        requirements: ["Mathematics", "Physics", "Technical Drawing"],
        tuitionFee: 13000,
        availableSeats: 80,
        applicationDeadline: "2024-08-15",
      },
    ],
  },
  {
    id: "2",
    name: "Mekelle University",
    shortName: "MU",
    slug: "mekelle-university",
    location: "Mekelle",
    city: "Mekelle",
    region: "Tigray",
    type: "Public",
    establishedYear: 1993,
    rating: 4.5,
    totalStudents: 32000,
    totalApplicants: 38000,
    acceptanceRate: 84,
    image: "/placeholder.svg?height=300&width=400&query=university entrance gate with arch",
    description: "Comprehensive university offering diverse programs in northern Ethiopia.",
    website: "https://www.mu.edu.et",
    facilities: ["Central Library", "Medical Center", "Sports Facilities", "Student Housing"],
    accreditations: ["Ministry of Education", "Medical Council"],
    campusSize: "200 hectares",
    studentToFacultyRatio: "18:1",
    programs: [
      {
        id: "4",
        name: "Medicine",
        type: "Health Sciences",
        duration: "6 years",
        degree: "Doctor of Medicine",
        description: "Comprehensive medical education with clinical training.",
        requirements: ["Biology", "Chemistry", "Physics", "Mathematics"],
        tuitionFee: 25000,
        availableSeats: 60,
        applicationDeadline: "2024-07-30",
      },
      {
        id: "5",
        name: "Business Administration",
        type: "Business",
        duration: "4 years",
        degree: "Bachelor",
        description: "Management, finance, marketing, and entrepreneurship.",
        requirements: ["Mathematics", "English", "Economics"],
        tuitionFee: 12000,
        availableSeats: 150,
        applicationDeadline: "2024-08-20",
      },
    ],
  },
  {
    id: "3",
    name: "Gonder University",
    shortName: "UoG",
    slug: "gonder-university",
    location: "Gonder",
    city: "Gonder",
    region: "Amhara",
    type: "Public",
    establishedYear: 1954,
    rating: 4.5,
    totalStudents: 28000,
    totalApplicants: 35000,
    acceptanceRate: 80,
    image: "/placeholder.svg?height=300&width=400&query=historic university building with stone architecture",
    description: "Historic university with strong programs in health sciences and agriculture.",
    website: "https://www.uog.edu.et",
    facilities: ["Hospital", "Agricultural Research Center", "Library", "Student Services"],
    accreditations: ["Ministry of Education", "Health Professions Council"],
    campusSize: "180 hectares",
    studentToFacultyRatio: "16:1",
    programs: [
      {
        id: "6",
        name: "Veterinary Medicine",
        type: "Health Sciences",
        duration: "5 years",
        degree: "Doctor of Veterinary Medicine",
        description: "Animal health, veterinary surgery, and livestock management.",
        requirements: ["Biology", "Chemistry", "Mathematics"],
        tuitionFee: 20000,
        availableSeats: 40,
        applicationDeadline: "2024-08-10",
      },
      {
        id: "7",
        name: "Agriculture",
        type: "Agriculture",
        duration: "4 years",
        degree: "Bachelor",
        description: "Crop production, soil science, and agricultural technology.",
        requirements: ["Biology", "Chemistry", "Mathematics"],
        tuitionFee: 11000,
        availableSeats: 100,
        applicationDeadline: "2024-08-25",
      },
    ],
  },
  {
    id: "4",
    name: "Jimma University",
    shortName: "JU",
    slug: "jimma-university",
    location: "Jimma",
    city: "Jimma",
    region: "Oromia",
    type: "Public",
    establishedYear: 1983,
    rating: 4.5,
    totalStudents: 30000,
    totalApplicants: 42000,
    acceptanceRate: 71,
    image: "/placeholder.svg?height=300&width=400&query=green university campus with mountains",
    description: "Leading university in southwestern Ethiopia with excellent health programs.",
    website: "https://www.ju.edu.et",
    facilities: ["Teaching Hospital", "Research Institute", "Digital Library", "Recreation Center"],
    accreditations: ["Ministry of Education", "WHO Collaboration"],
    campusSize: "220 hectares",
    studentToFacultyRatio: "17:1",
    programs: [
      {
        id: "8",
        name: "Public Health",
        type: "Health Sciences",
        duration: "4 years",
        degree: "Bachelor",
        description: "Community health, epidemiology, and health promotion.",
        requirements: ["Biology", "Chemistry", "Mathematics", "English"],
        tuitionFee: 16000,
        availableSeats: 80,
        applicationDeadline: "2024-08-05",
      },
      {
        id: "9",
        name: "Pharmacy",
        type: "Health Sciences",
        duration: "5 years",
        degree: "Bachelor of Pharmacy",
        description: "Pharmaceutical sciences, drug development, and clinical pharmacy.",
        requirements: ["Chemistry", "Biology", "Physics", "Mathematics"],
        tuitionFee: 18000,
        availableSeats: 50,
        applicationDeadline: "2024-07-25",
      },
    ],
  },
  {
    id: "5",
    name: "Bahirdar University",
    shortName: "BDU",
    slug: "bahirdar-university",
    location: "Bahirdar",
    city: "Bahirdar",
    region: "Amhara",
    type: "Public",
    establishedYear: 1963,
    rating: 4.5,
    totalStudents: 26000,
    totalApplicants: 31000,
    acceptanceRate: 84,
    image: "/placeholder.svg?height=300&width=400&query=modern university building with red brick",
    description: "Comprehensive university located by Lake Tana with diverse academic programs.",
    website: "https://www.bdu.edu.et",
    facilities: ["Lake Campus", "Technology Park", "Cultural Center", "Sports Complex"],
    accreditations: ["Ministry of Education", "Engineering Board"],
    campusSize: "160 hectares",
    studentToFacultyRatio: "19:1",
    programs: [
      {
        id: "10",
        name: "Mechanical Engineering",
        type: "Engineering",
        duration: "4 years",
        degree: "Bachelor",
        description: "Machine design, thermodynamics, and manufacturing processes.",
        requirements: ["Mathematics", "Physics", "Technical Drawing"],
        tuitionFee: 14500,
        availableSeats: 90,
        applicationDeadline: "2024-08-18",
      },
    ],
  },
  {
    id: "6",
    name: "Aksum University",
    shortName: "AkU",
    slug: "aksum-university",
    location: "Aksum",
    city: "Aksum",
    region: "Tigray",
    type: "Public",
    establishedYear: 2006,
    rating: 4.5,
    totalStudents: 18000,
    totalApplicants: 22000,
    acceptanceRate: 82,
    image: "/placeholder.svg?height=300&width=400&query=ancient university building with traditional architecture",
    description: "Historic city university focusing on archaeology, history, and modern sciences.",
    website: "https://www.aku.edu.et",
    facilities: ["Archaeological Museum", "Research Center", "Modern Library", "Student Center"],
    accreditations: ["Ministry of Education", "Archaeological Society"],
    campusSize: "120 hectares",
    studentToFacultyRatio: "14:1",
    programs: [
      {
        id: "11",
        name: "Archaeology",
        type: "Social Sciences",
        duration: "4 years",
        degree: "Bachelor",
        description: "Ancient civilizations, excavation techniques, and cultural heritage.",
        requirements: ["History", "Geography", "English"],
        tuitionFee: 10000,
        availableSeats: 30,
        applicationDeadline: "2024-08-30",
      },
    ],
  },
]

export const programTypes = [
  "Engineering",
  "Health Sciences",
  "Business",
  "Agriculture",
  "Social Sciences",
  "Natural Sciences",
  "Arts and Humanities",
  "Education",
  "Law",
  "Technology",
]

export const regions = ["Addis Ababa", "Tigray", "Amhara", "Oromia", "SNNP", "Somali", "Afar", "Gambela", "Harari"]

export const degreeTypes = ["Bachelor", "Master", "Doctor of Medicine", "Doctor of Veterinary Medicine", "PhD"]

export function getUniversities(): University[] {
  return universities
}

export function getUniversityBySlug(slug: string): University | undefined {
  return universities.find((uni) => uni.slug === slug)
}

export function searchUniversities(query: string): University[] {
  const lowercaseQuery = query.toLowerCase()
  return universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(lowercaseQuery) ||
      uni.shortName.toLowerCase().includes(lowercaseQuery) ||
      uni.location.toLowerCase().includes(lowercaseQuery) ||
      uni.programs.some((program) => program.name.toLowerCase().includes(lowercaseQuery)),
  )
}

export function filterUniversities(filters: {
  programType?: string
  location?: string
  type?: string
  degreeType?: string
}): University[] {
  return universities.filter((uni) => {
    if (filters.programType && !uni.programs.some((program) => program.type === filters.programType)) {
      return false
    }
    if (filters.location && uni.region !== filters.location) {
      return false
    }
    if (filters.type && uni.type !== filters.type) {
      return false
    }
    if (filters.degreeType && !uni.programs.some((program) => program.degree === filters.degreeType)) {
      return false
    }
    return true
  })
}

export function sortUniversities(universities: University[], sortBy: string): University[] {
  const sorted = [...universities]

  switch (sortBy) {
    case "applicants-desc":
      return sorted.sort((a, b) => b.totalApplicants - a.totalApplicants)
    case "applicants-asc":
      return sorted.sort((a, b) => a.totalApplicants - b.totalApplicants)
    case "rating-desc":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "rating-asc":
      return sorted.sort((a, b) => a.rating - b.rating)
    case "students-desc":
      return sorted.sort((a, b) => b.totalStudents - a.totalStudents)
    case "students-asc":
      return sorted.sort((a, b) => a.totalStudents - b.totalStudents)
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    default:
      return sorted
  }
}

export function getAllPrograms(): Program[] {
  return universities.flatMap((uni) => uni.programs)
}

export function searchPrograms(query: string): Program[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllPrograms().filter(
    (program) =>
      program.name.toLowerCase().includes(lowercaseQuery) ||
      program.type.toLowerCase().includes(lowercaseQuery) ||
      program.description.toLowerCase().includes(lowercaseQuery),
  )
}

export function getUniversitiesByRegion(region: string): University[] {
  return universities.filter((uni) => uni.region === region)
}
