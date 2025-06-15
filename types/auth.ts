export type UserRole = "student" | "university" | "admin"

/**
 * User profile information
 */
export interface UserProfile {
  firstName?: string
  lastName?: string
  avatar?: string
  [key: string]: any
}

/**
 * User data structure
 */
export interface User {
  id: string
  email: string
  role: UserRole
  profile?: UserProfile
  [key: string]: any
}
