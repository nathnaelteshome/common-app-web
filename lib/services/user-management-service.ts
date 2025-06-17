import type {
  CreateUserData,
  UpdateUserData,
  BulkUserAction,
  UserFilters,
  PasswordResetData,
} from "@/lib/validations/user-management"
import type { User, PaginatedResponse } from "@/lib/api/types"

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "john.doe@student.com",
    role: "student",
    isEmailVerified: true,
    isActive: true,
    profile: {
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      phoneNumber: "+1234567890",
      dateOfBirth: "1995-05-15",
      address: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        country: "USA",
        zipCode: "10001",
      },
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
  },
  {
    id: "2",
    email: "harvard@university.edu",
    role: "university",
    isEmailVerified: true,
    isActive: true,
    profile: {
      collegeName: "Harvard University",
      address1: "Cambridge, MA",
      country: "USA",
      city: "Cambridge",
      postcode: "02138",
      phone1: "+1617495000",
      documents: "verified",
      fieldOfStudies: "All Fields",
      isVerified: true,
      website: "https://harvard.edu",
    },
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-25T16:20:00Z",
  },
  {
    id: "3",
    email: "admin@commonapply.com",
    role: "admin",
    isEmailVerified: true,
    isActive: true,
    profile: {
      firstName: "Sarah",
      lastName: "Wilson",
      permissions: ["manage_applications", "manage_users", "view_analytics"],
      department: "Operations",
    },
    createdAt: "2024-01-05T08:00:00Z",
    updatedAt: "2024-01-30T12:15:00Z",
  },
]

export class UserManagementService {
  static async getUsers(filters: UserFilters): Promise<PaginatedResponse<User>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filteredUsers = [...mockUsers]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          (user.profile as any).firstName?.toLowerCase().includes(searchLower) ||
          (user.profile as any).lastName?.toLowerCase().includes(searchLower) ||
          (user.profile as any).collegeName?.toLowerCase().includes(searchLower),
      )
    }

    if (filters.role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === filters.role)
    }

    if (filters.status !== "all") {
      filteredUsers = filteredUsers.filter((user) => (filters.status === "active" ? user.isActive : !user.isActive))
    }

    if (filters.emailVerified !== "all") {
      filteredUsers = filteredUsers.filter((user) =>
        filters.emailVerified === "verified" ? user.isEmailVerified : !user.isEmailVerified,
      )
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue: any, bValue: any

      switch (filters.sortBy) {
        case "name":
          aValue = (a.profile as any).firstName || (a.profile as any).collegeName || ""
          bValue = (b.profile as any).firstName || (b.profile as any).collegeName || ""
          break
        case "email":
          aValue = a.email
          bValue = b.email
          break
        case "role":
          aValue = a.role
          bValue = b.role
          break
        case "createdAt":
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = new Date(a.updatedAt)
          bValue = new Date(b.updatedAt)
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    // Apply pagination
    const startIndex = (filters.page - 1) * filters.limit
    const endIndex = startIndex + filters.limit
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex)

    return {
      data: paginatedUsers,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / filters.limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: filters.page > 1,
      },
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockUsers.find((user) => user.id === id) || null
  }

  static async createUser(userData: CreateUserData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email,
      role: userData.role,
      isEmailVerified: userData.isEmailVerified,
      isActive: userData.isActive,
      profile:
        userData.role === "student"
          ? {
              firstName: userData.firstName,
              lastName: userData.lastName,
              username: userData.email.split("@")[0],
              phoneNumber: userData.phoneNumber || "",
              dateOfBirth: "",
            }
          : userData.role === "university"
            ? {
                collegeName: `${userData.firstName} ${userData.lastName}`,
                address1: "",
                country: "",
                city: "",
                postcode: "",
                phone1: userData.phoneNumber || "",
                documents: "",
                fieldOfStudies: "",
                isVerified: false,
              }
            : {
                firstName: userData.firstName,
                lastName: userData.lastName,
                permissions: userData.permissions || [],
                department: userData.department,
              },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockUsers.push(newUser)
    return newUser
  }

  static async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      profile: {
        ...mockUsers[userIndex].profile,
        ...userData,
      },
      updatedAt: new Date().toISOString(),
    }

    mockUsers[userIndex] = updatedUser
    return updatedUser
  }

  static async deleteUser(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const userIndex = mockUsers.findIndex((user) => user.id === id)
    if (userIndex === -1) {
      throw new Error("User not found")
    }

    mockUsers.splice(userIndex, 1)
  }

  static async bulkAction(action: BulkUserAction): Promise<{ success: number; failed: number }> {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let success = 0
    let failed = 0

    for (const userId of action.userIds) {
      try {
        const userIndex = mockUsers.findIndex((user) => user.id === userId)
        if (userIndex === -1) {
          failed++
          continue
        }

        switch (action.action) {
          case "activate":
            mockUsers[userIndex].isActive = true
            break
          case "deactivate":
            mockUsers[userIndex].isActive = false
            break
          case "verify_email":
            mockUsers[userIndex].isEmailVerified = true
            break
          case "change_role":
            if (action.newRole) {
              mockUsers[userIndex].role = action.newRole
            }
            break
          case "delete":
            mockUsers.splice(userIndex, 1)
            break
        }

        success++
      } catch (error) {
        failed++
      }
    }

    return { success, failed }
  }

  static async resetPassword(data: PasswordResetData): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // In real implementation, this would hash the password and update the user
    console.log(`Password reset for user ${data.userId}`)
  }

  static async exportUsers(filters: UserFilters): Promise<Blob> {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const users = await this.getUsers(filters)
    const csvContent = this.convertToCSV(users.data)
    return new Blob([csvContent], { type: "text/csv" })
  }

  private static convertToCSV(users: User[]): string {
    const headers = ["ID", "Email", "Role", "Name", "Status", "Email Verified", "Created At"]
    const rows = users.map((user) => [
      user.id,
      user.email,
      user.role,
      (user.profile as any).firstName
        ? `${(user.profile as any).firstName} ${(user.profile as any).lastName}`
        : (user.profile as any).collegeName || "N/A",
      user.isActive ? "Active" : "Inactive",
      user.isEmailVerified ? "Verified" : "Unverified",
      new Date(user.createdAt).toLocaleDateString(),
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }

  static async getUserStats(): Promise<{
    total: number
    active: number
    inactive: number
    students: number
    universities: number
    admins: number
    verified: number
    unverified: number
  }> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      total: mockUsers.length,
      active: mockUsers.filter((u) => u.isActive).length,
      inactive: mockUsers.filter((u) => !u.isActive).length,
      students: mockUsers.filter((u) => u.role === "student").length,
      universities: mockUsers.filter((u) => u.role === "university").length,
      admins: mockUsers.filter((u) => u.role === "admin" || u.role === "system_admin").length,
      verified: mockUsers.filter((u) => u.isEmailVerified).length,
      unverified: mockUsers.filter((u) => !u.isEmailVerified).length,
    }
  }
}
