import { z } from "zod"

export const applicationFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    nationality: z.string().min(1, "Nationality is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  academicHistory: z.object({
    highSchoolName: z.string().min(1, "High school name is required"),
    highSchoolGPA: z.string().min(1, "GPA is required"),
    graduationYear: z.string().min(1, "Graduation year is required"),
    previousEducation: z.array(z.any()).optional(),
  }),
  documents: z.object({
    transcript: z.any().optional(),
    personalStatement: z.any().optional(),
    recommendationLetters: z.array(z.any()).optional(),
  }),
  essays: z.object({
    whyThisUniversity: z.string().min(50, "Please provide at least 50 characters"),
    careerGoals: z.string().min(50, "Please provide at least 50 characters"),
    personalExperience: z.string().optional(),
  }),
  additionalInfo: z.object({
    extracurriculars: z.string().optional(),
    workExperience: z.string().optional(),
    languages: z.array(z.string()).optional(),
    specialNeeds: z.string().optional(),
  }),
})

export type ApplicationFormData = z.infer<typeof applicationFormSchema>
