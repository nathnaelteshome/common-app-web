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

export interface ProfileAddress {
  city: string
  region: string
  country: string
  address1: string
  address2?: string
  postcode: string
}

export interface ProfileContact {
  email: string
  phone1: string
  phone2?: string
}

export interface ProfileLocation {
  latitude: number
  longitude: number
}

export interface ProfileRankings {
  rating: number
  national_rank: number
  international_rank: number
}

export default interface UniversityProfile {
  acceptance_rate: number
  accreditation: string[]
  address: ProfileAddress
  campus_image: string
  campus_size: string
  college_name: string
  contact: ProfileContact
  created_at: string
  description: string
  established_year: number
  facilities: string[]
  field_of_studies: string
  id: string
  is_active: boolean
  is_verified: boolean
  location: ProfileLocation
  rankings: ProfileRankings
  short_name: string
  slug: string
  student_to_faculty_ratio: string
  total_applicants: number
  total_students: number
  university_type: "Public" | "Private"
  updated_at: string
  user_id: string
  verification_documents: string[]
  website: string
}


export default interface University {
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
  applicationCount: number
  campusImage: string
  programCount: number
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
  profile: UniversityProfile
  
}

export const universities: any = [
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
    image: "/placeholder.svg?height=300&width=400",
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
        type: "Science and Technology",
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
        type: "Science and Technology",
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
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Infrastructure development, construction, and urban planning.",
        requirements: ["Mathematics", "Physics", "Technical Drawing"],
        tuitionFee: 13000,
        availableSeats: 80,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "4",
        name: "Mechanical Engineering",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Machine design, thermodynamics, and manufacturing processes.",
        requirements: ["Mathematics", "Physics", "Technical Drawing"],
        tuitionFee: 14500,
        availableSeats: 90,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "5",
        name: "Information Technology",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "IT systems, network administration, and cybersecurity.",
        requirements: ["Mathematics", "Physics", "English"],
        tuitionFee: 13500,
        availableSeats: 110,
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
    image: "/placeholder.svg?height=300&width=400",
    description: "Comprehensive university offering diverse programs in northern Ethiopia.",
    website: "https://www.mu.edu.et",
    facilities: ["Central Library", "Medical Center", "Sports Facilities", "Student Housing"],
    accreditations: ["Ministry of Education", "Medical Council"],
    campusSize: "200 hectares",
    studentToFacultyRatio: "18:1",
    programs: [
      {
        id: "6",
        name: "Medicine",
        type: "Health and Medicine",
        duration: "6 years",
        degree: "Doctor of Medicine",
        description: "Comprehensive medical education with clinical training.",
        requirements: ["Biology", "Chemistry", "Physics", "Mathematics"],
        tuitionFee: 25000,
        availableSeats: 60,
        applicationDeadline: "2024-07-30",
      },
      {
        id: "7",
        name: "Business Administration",
        type: "Business and Management",
        duration: "4 years",
        degree: "Bachelor",
        description: "Management, finance, marketing, and entrepreneurship.",
        requirements: ["Mathematics", "English", "Economics"],
        tuitionFee: 12000,
        availableSeats: 150,
        applicationDeadline: "2024-08-20",
      },
      {
        id: "8",
        name: "Nursing",
        type: "Health and Medicine",
        duration: "4 years",
        degree: "Bachelor",
        description: "Patient care, health promotion, and clinical nursing practice.",
        requirements: ["Biology", "Chemistry", "English"],
        tuitionFee: 16000,
        availableSeats: 80,
        applicationDeadline: "2024-07-30",
      },
      {
        id: "9",
        name: "Psychology",
        type: "Social Sciences",
        duration: "4 years",
        degree: "Bachelor",
        description: "Human behavior, mental processes, and psychological research.",
        requirements: ["English", "Mathematics", "Biology"],
        tuitionFee: 11000,
        availableSeats: 70,
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
    image: "/placeholder.svg?height=300&width=400",
    description: "Historic university with strong programs in health sciences and agriculture.",
    website: "https://www.uog.edu.et",
    facilities: ["Hospital", "Agricultural Research Center", "Library", "Student Services"],
    accreditations: ["Ministry of Education", "Health Professions Council"],
    campusSize: "180 hectares",
    studentToFacultyRatio: "16:1",
    programs: [
      {
        id: "10",
        name: "Veterinary Medicine",
        type: "Health and Medicine",
        duration: "5 years",
        degree: "Doctor of Veterinary Medicine",
        description: "Animal health, veterinary surgery, and livestock management.",
        requirements: ["Biology", "Chemistry", "Mathematics"],
        tuitionFee: 20000,
        availableSeats: 40,
        applicationDeadline: "2024-08-10",
      },
      {
        id: "11",
        name: "Agriculture",
        type: "Multidisciplinary",
        duration: "4 years",
        degree: "Bachelor",
        description: "Crop production, soil science, and agricultural technology.",
        requirements: ["Biology", "Chemistry", "Mathematics"],
        tuitionFee: 11000,
        availableSeats: 100,
        applicationDeadline: "2024-08-25",
      },
      {
        id: "12",
        name: "Pharmacy",
        type: "Health and Medicine",
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
    image: "/placeholder.svg?height=300&width=400",
    description: "Leading university in southwestern Ethiopia with excellent health programs.",
    website: "https://www.ju.edu.et",
    facilities: ["Teaching Hospital", "Research Institute", "Digital Library", "Recreation Center"],
    accreditations: ["Ministry of Education", "WHO Collaboration"],
    campusSize: "220 hectares",
    studentToFacultyRatio: "17:1",
    programs: [
      {
        id: "13",
        name: "Public Health",
        type: "Health and Medicine",
        duration: "4 years",
        degree: "Bachelor",
        description: "Community health, epidemiology, and health promotion.",
        requirements: ["Biology", "Chemistry", "Mathematics", "English"],
        tuitionFee: 16000,
        availableSeats: 80,
        applicationDeadline: "2024-08-05",
      },
      {
        id: "14",
        name: "Environmental Science",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Environmental conservation, pollution control, and sustainability.",
        requirements: ["Biology", "Chemistry", "Geography"],
        tuitionFee: 12500,
        availableSeats: 60,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "15",
        name: "Law",
        type: "Law and Governance",
        duration: "5 years",
        degree: "Bachelor of Laws",
        description: "Legal studies, jurisprudence, and legal practice.",
        requirements: ["English", "History", "Civics"],
        tuitionFee: 14000,
        availableSeats: 90,
        applicationDeadline: "2024-08-10",
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
    image: "/placeholder.svg?height=300&width=400",
    description: "Comprehensive university located by Lake Tana with diverse academic programs.",
    website: "https://www.bdu.edu.et",
    facilities: ["Lake Campus", "Technology Park", "Cultural Center", "Sports Complex"],
    accreditations: ["Ministry of Education", "Engineering Board"],
    campusSize: "160 hectares",
    studentToFacultyRatio: "19:1",
    programs: [
      {
        id: "16",
        name: "Economics",
        type: "Business and Management",
        duration: "4 years",
        degree: "Bachelor",
        description: "Economic theory, policy analysis, and development economics.",
        requirements: ["Mathematics", "English", "Economics"],
        tuitionFee: 10500,
        availableSeats: 120,
        applicationDeadline: "2024-08-20",
      },
      {
        id: "17",
        name: "Education",
        type: "Inclusive",
        duration: "4 years",
        degree: "Bachelor",
        description: "Teaching methods, curriculum development, and educational psychology.",
        requirements: ["English", "Mathematics", "Subject Specialization"],
        tuitionFee: 9500,
        availableSeats: 200,
        applicationDeadline: "2024-08-25",
      },
      {
        id: "18",
        name: "Chemistry",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Organic, inorganic, and physical chemistry with laboratory work.",
        requirements: ["Chemistry", "Mathematics", "Physics"],
        tuitionFee: 11500,
        availableSeats: 80,
        applicationDeadline: "2024-08-15",
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
    image: "/placeholder.svg?height=300&width=400",
    description: "Historic city university focusing on archaeology, history, and modern sciences.",
    website: "https://www.aku.edu.et",
    facilities: ["Archaeological Museum", "Research Center", "Modern Library", "Student Center"],
    accreditations: ["Ministry of Education", "Archaeological Society"],
    campusSize: "120 hectares",
    studentToFacultyRatio: "14:1",
    programs: [
      {
        id: "19",
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
      {
        id: "20",
        name: "History",
        type: "Arts and Humanities",
        duration: "4 years",
        degree: "Bachelor",
        description: "Ethiopian and world history, historical research methods.",
        requirements: ["History", "English", "Geography"],
        tuitionFee: 9000,
        availableSeats: 50,
        applicationDeadline: "2024-08-30",
      },
      {
        id: "21",
        name: "Tourism and Hotel Management",
        type: "Business and Management",
        duration: "4 years",
        degree: "Bachelor",
        description: "Tourism industry, hospitality management, and cultural tourism.",
        requirements: ["English", "Geography", "Mathematics"],
        tuitionFee: 12000,
        availableSeats: 60,
        applicationDeadline: "2024-08-25",
      },
    ],
  },
  {
    id: "7",
    name: "Hawassa University",
    shortName: "HU",
    slug: "hawassa-university",
    location: "Hawassa",
    city: "Hawassa",
    region: "SNNP",
    type: "Public",
    establishedYear: 1999,
    rating: 4.3,
    totalStudents: 24000,
    totalApplicants: 28000,
    acceptanceRate: 86,
    image: "/placeholder.svg?height=300&width=400",
    description: "Dynamic university known for innovation and research in southern Ethiopia.",
    website: "https://www.hu.edu.et",
    facilities: ["Innovation Hub", "Lake Research Center", "Modern Labs", "Sports Facilities"],
    accreditations: ["Ministry of Education", "Research Council"],
    campusSize: "140 hectares",
    studentToFacultyRatio: "16:1",
    programs: [
      {
        id: "22",
        name: "Software Engineering",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Software development, system design, and project management.",
        requirements: ["Mathematics", "Physics", "English"],
        tuitionFee: 15500,
        availableSeats: 100,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "23",
        name: "Biotechnology",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Genetic engineering, molecular biology, and bioprocessing.",
        requirements: ["Biology", "Chemistry", "Mathematics"],
        tuitionFee: 17000,
        availableSeats: 40,
        applicationDeadline: "2024-08-10",
      },
      {
        id: "24",
        name: "Accounting and Finance",
        type: "Business and Management",
        duration: "4 years",
        degree: "Bachelor",
        description: "Financial management, auditing, and corporate finance.",
        requirements: ["Mathematics", "English", "Economics"],
        tuitionFee: 11500,
        availableSeats: 130,
        applicationDeadline: "2024-08-20",
      },
      {
        id: "25",
        name: "Film and Media Studies",
        type: "Video & Photography",
        duration: "4 years",
        degree: "Bachelor",
        description: "Film production, media theory, and digital storytelling.",
        requirements: ["English", "Art", "Literature"],
        tuitionFee: 13000,
        availableSeats: 50,
        applicationDeadline: "2024-08-15",
      },
    ],
  },
  {
    id: "8",
    name: "Dire Dawa University",
    shortName: "DDU",
    slug: "dire-dawa-university",
    location: "Dire Dawa",
    city: "Dire Dawa",
    region: "Dire Dawa",
    type: "Public",
    establishedYear: 2006,
    rating: 4.2,
    totalStudents: 15000,
    totalApplicants: 18000,
    acceptanceRate: 83,
    image: "/placeholder.svg?height=300&width=400",
    description: "Growing university serving the eastern region with focus on technology and business.",
    website: "https://www.ddu.edu.et",
    facilities: ["Technology Center", "Business Incubator", "Library", "Student Housing"],
    accreditations: ["Ministry of Education", "Technology Board"],
    campusSize: "100 hectares",
    studentToFacultyRatio: "15:1",
    programs: [
      {
        id: "26",
        name: "International Business",
        type: "Business and Management",
        duration: "4 years",
        degree: "Bachelor",
        description: "Global trade, international markets, and cross-cultural management.",
        requirements: ["English", "Mathematics", "Economics"],
        tuitionFee: 13000,
        availableSeats: 80,
        applicationDeadline: "2024-08-20",
      },
      {
        id: "27",
        name: "Logistics and Supply Chain",
        type: "Business and Management",
        duration: "4 years",
        degree: "Bachelor",
        description: "Supply chain management, transportation, and warehouse operations.",
        requirements: ["Mathematics", "English", "Geography"],
        tuitionFee: 12500,
        availableSeats: 70,
        applicationDeadline: "2024-08-20",
      },
    ],
  },
  {
    id: "9",
    name: "Addis Ababa University",
    shortName: "AAU",
    slug: "addis-ababa-university",
    location: "Addis Ababa",
    city: "Addis Ababa",
    region: "Addis Ababa",
    type: "Public",
    establishedYear: 1950,
    rating: 4.8,
    totalStudents: 48000,
    totalApplicants: 65000,
    acceptanceRate: 74,
    image: "/placeholder.svg?height=300&width=400",
    description: "Ethiopia's oldest and most prestigious university with comprehensive programs.",
    website: "https://www.aau.edu.et",
    facilities: ["Central Library", "Medical School", "Research Centers", "Museums", "Sports Complex"],
    accreditations: ["Ministry of Education", "International Accreditation"],
    campusSize: "300 hectares",
    studentToFacultyRatio: "20:1",
    programs: [
      {
        id: "28",
        name: "Literature",
        type: "Arts and Humanities",
        duration: "4 years",
        degree: "Bachelor",
        description: "Ethiopian and world literature, creative writing, and literary criticism.",
        requirements: ["English", "Literature", "History"],
        tuitionFee: 8500,
        availableSeats: 80,
        applicationDeadline: "2024-08-30",
      },
      {
        id: "29",
        name: "Philosophy",
        type: "Arts and Humanities",
        duration: "4 years",
        degree: "Bachelor",
        description: "Ethics, logic, metaphysics, and philosophical traditions.",
        requirements: ["English", "History", "Logic"],
        tuitionFee: 8000,
        availableSeats: 40,
        applicationDeadline: "2024-08-30",
      },
      {
        id: "30",
        name: "Linguistics",
        type: "Arts and Humanities",
        duration: "4 years",
        degree: "Bachelor",
        description: "Language structure, phonetics, and sociolinguistics.",
        requirements: ["English", "Literature", "Foreign Language"],
        tuitionFee: 9000,
        availableSeats: 50,
        applicationDeadline: "2024-08-30",
      },
      {
        id: "31",
        name: "Sociology",
        type: "Social Sciences",
        duration: "4 years",
        degree: "Bachelor",
        description: "Social structures, institutions, and human behavior in society.",
        requirements: ["English", "History", "Mathematics"],
        tuitionFee: 9500,
        availableSeats: 90,
        applicationDeadline: "2024-08-25",
      },
      {
        id: "32",
        name: "Anthropology",
        type: "Social Sciences",
        duration: "4 years",
        degree: "Bachelor",
        description: "Cultural anthropology, human evolution, and ethnographic research.",
        requirements: ["English", "History", "Biology"],
        tuitionFee: 10000,
        availableSeats: 60,
        applicationDeadline: "2024-08-25",
      },
      {
        id: "33",
        name: "Political Science",
        type: "Law and Governance",
        duration: "4 years",
        degree: "Bachelor",
        description: "Government systems, political theory, and international relations.",
        requirements: ["English", "History", "Civics"],
        tuitionFee: 10500,
        availableSeats: 100,
        applicationDeadline: "2024-08-20",
      },
    ],
  },
  {
    id: "10",
    name: "Ethiopian Institute of Architecture",
    shortName: "EiABC",
    slug: "ethiopian-institute-architecture",
    location: "Addis Ababa",
    city: "Addis Ababa",
    region: "Addis Ababa",
    type: "Public",
    establishedYear: 1954,
    rating: 4.6,
    totalStudents: 3500,
    totalApplicants: 8000,
    acceptanceRate: 44,
    image: "/placeholder.svg?height=300&width=400",
    description: "Specialized institute for architecture, urban planning, and design.",
    website: "https://www.eiabc.edu.et",
    facilities: ["Design Studios", "3D Printing Lab", "Model Workshop", "Digital Lab"],
    accreditations: ["Ministry of Education", "Architecture Board"],
    campusSize: "25 hectares",
    studentToFacultyRatio: "12:1",
    programs: [
      {
        id: "34",
        name: "Architecture",
        type: "Arts and Humanities",
        duration: "5 years",
        degree: "Bachelor",
        description: "Building design, urban planning, and sustainable architecture.",
        requirements: ["Mathematics", "Physics", "Art", "Technical Drawing"],
        tuitionFee: 18000,
        availableSeats: 60,
        applicationDeadline: "2024-07-15",
      },
      {
        id: "35",
        name: "Urban Planning",
        type: "Multidisciplinary",
        duration: "4 years",
        degree: "Bachelor",
        description: "City planning, land use, and sustainable urban development.",
        requirements: ["Mathematics", "Geography", "English"],
        tuitionFee: 16000,
        availableSeats: 40,
        applicationDeadline: "2024-07-20",
      },
      {
        id: "36",
        name: "Interior Design",
        type: "Arts and Humanities",
        duration: "4 years",
        degree: "Bachelor",
        description: "Space planning, furniture design, and interior decoration.",
        requirements: ["Art", "Mathematics", "Technical Drawing"],
        tuitionFee: 15000,
        availableSeats: 50,
        applicationDeadline: "2024-07-25",
      },
    ],
  },
  {
    id: "11",
    name: "Addis Ababa Science and Technology University",
    shortName: "AASTU",
    slug: "addis-ababa-science-technology",
    location: "Addis Ababa",
    city: "Addis Ababa",
    region: "Addis Ababa",
    type: "Public",
    establishedYear: 2011,
    rating: 4.4,
    totalStudents: 12000,
    totalApplicants: 20000,
    acceptanceRate: 60,
    image: "/placeholder.svg?height=300&width=400",
    description: "Modern university focused on applied sciences and technology.",
    website: "https://www.aastu.edu.et",
    facilities: ["Innovation Center", "Fab Lab", "Research Labs", "Technology Park"],
    accreditations: ["Ministry of Education", "Technology Council"],
    campusSize: "80 hectares",
    studentToFacultyRatio: "14:1",
    programs: [
      {
        id: "37",
        name: "Data Science",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Big data analytics, machine learning, and statistical modeling.",
        requirements: ["Mathematics", "Statistics", "Computer Science"],
        tuitionFee: 16500,
        availableSeats: 80,
        applicationDeadline: "2024-08-10",
      },
      {
        id: "38",
        name: "Artificial Intelligence",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Machine learning, neural networks, and AI applications.",
        requirements: ["Mathematics", "Physics", "Computer Science"],
        tuitionFee: 17500,
        availableSeats: 60,
        applicationDeadline: "2024-08-10",
      },
      {
        id: "39",
        name: "Renewable Energy Engineering",
        type: "Science and Technology",
        duration: "4 years",
        degree: "Bachelor",
        description: "Solar, wind, and hydroelectric power systems.",
        requirements: ["Mathematics", "Physics", "Chemistry"],
        tuitionFee: 16000,
        availableSeats: 70,
        applicationDeadline: "2024-08-15",
      },
      {
        id: "40",
        name: "Digital Media Production",
        type: "Video & Photography",
        duration: "4 years",
        degree: "Bachelor",
        description: "Video production, photography, and digital content creation.",
        requirements: ["Art", "English", "Computer Skills"],
        tuitionFee: 14500,
        availableSeats: 90,
        applicationDeadline: "2024-08-20",
      },
    ],
  },
]

export const programTypes = [
  "Health and Medicine",
  "Arts and Humanities",
  "Science and Technology",
  "Social Sciences",
  "Multidisciplinary",
  "Business and Management",
  "Inclusive",
  "Law and Governance",
  "Video & Photography",
]

export const regions = [
  "Addis Ababa",
  "Tigray",
  "Amhara",
  "Oromia",
  "SNNP",
  "Somali",
  "Afar",
  "Gambela",
  "Harari",
  "Dire Dawa",
]

export const degreeTypes = [
  "Bachelor",
  "Master",
  "Doctor of Medicine",
  "Doctor of Veterinary Medicine",
  "Bachelor of Laws",
  "Bachelor of Pharmacy",
  "PhD",
]

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

export function getProgramsByCategory(category: string): Program[] {
  return getAllPrograms().filter((program) => program.type === category)
}

export function getUniversitiesByCategory(category: string): University[] {
  return universities.filter((uni) => uni.programs.some((program) => program.type === category))
}
