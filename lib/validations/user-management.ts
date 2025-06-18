import { z } from "zod"

// User Management Schemas
export const createUserSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["student", "university", "admin", "system_admin"]),
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phoneNumber: z.string().optional(),
    isActive: z.boolean().default(true),
    isEmailVerified: z.boolean().default(false),
    permissions: z.array(z.string()).optional(),
    department: z.string().optional(),
    position: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  role: z.enum(["student", "university", "admin", "system_admin"]).optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  phoneNumber: z.string().optional(),
  isActive: z.boolean().optional(),
  isEmailVerified: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
  department: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
})

export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string().uuid()),
  action: z.enum(["activate", "deactivate", "delete", "verify_email", "reset_password", "change_role"]),
  newRole: z.enum(["student", "university", "admin", "system_admin"]).optional(),
  reason: z.string().optional(),
})

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.enum(["student", "university", "admin", "system_admin", "all"]).default("all"),
  status: z.enum(["active", "inactive", "all"]).default("all"),
  emailVerified: z.enum(["verified", "unverified", "all"]).default("all"),
  dateRange: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
  department: z.string().optional(),
  sortBy: z.enum(["name", "email", "role", "createdAt", "lastLoginAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export const passwordResetSchema = z
  .object({
    userId: z.string().uuid(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    sendEmail: z.boolean().default(true),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type BulkUserAction = z.infer<typeof bulkUserActionSchema>
export type UserFilters = z.infer<typeof userFilterSchema>
export type PasswordResetData = z.infer<typeof passwordResetSchema>
