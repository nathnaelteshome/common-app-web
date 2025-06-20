import { useState } from 'react'
import { api } from "./client"
import type { ApiResponse, PaginatedResponse } from "./types"

// Program Types based on PROGRAM_INTEGRATION_GUIDE.md
export interface University {
  id: string
  name: string
  slug: string
  logo?: string
}

export interface EligibilityCriteria {
  minimumGPA: number
  standardizedTestRequired: boolean
  languageRequirements?: string
}

export interface Program {
  id: string
  name: string
  description: string
  university: University
  type: string
  level: 'undergraduate' | 'graduate' | 'doctoral'
  duration: number
  tuitionFee: number
  currency: string
  applicationDeadline: string
  startDate: string
  requirements: string[]
  eligibilityCriteria: EligibilityCriteria
  applicationCount: number
  acceptanceRate: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProgramFilters {
  page?: number
  limit?: number
  universityId?: string
  type?: string
  level?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateProgramData {
  name: string
  description: string
  type: string
  level: 'undergraduate' | 'graduate' | 'doctoral'
  duration: number
  tuitionFee: number
  currency: string
  applicationDeadline: string
  startDate: string
  requirements: string[]
  eligibilityCriteria: EligibilityCriteria
}

export interface ProgramResponse {
  success: boolean
  data: {
    programs: Program[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  meta: {
    timestamp: string
  }
}

// Program API endpoints
const PROGRAM_ENDPOINTS = {
  LIST: "/api/v1/programs",
  GET: (id: string) => `/api/v1/programs/${id}`,
  CREATE: "/api/v1/programs",
  UPDATE: (id: string) => `/api/v1/programs/${id}`,
  DELETE: (id: string) => `/api/v1/programs/${id}`,
  TYPES: "/api/v1/programs/types",
} as const

// Program API Service
export class ProgramApi {
  /**
   * List programs with filtering and pagination
   * GET /api/v1/programs
   */
  static async listPrograms(filters: ProgramFilters = {}): Promise<ApiResponse<ProgramResponse['data']>> {
    return api.get<ProgramResponse['data']>(PROGRAM_ENDPOINTS.LIST, filters)
  }

  /**
   * Get program by ID
   * GET /api/v1/programs/:id
   */
  static async getProgram(id: string): Promise<ApiResponse<Program>> {
    return api.get<Program>(PROGRAM_ENDPOINTS.GET(id))
  }

  /**
   * Get available program types
   * GET /api/v1/programs/types
   */
  static async getProgramTypes(): Promise<ApiResponse<{ types: string[] }>> {
    return api.get<{ types: string[] }>(PROGRAM_ENDPOINTS.TYPES)
  }

  /**
   * Create program (University Admin only)
   * POST /api/v1/programs
   */
  static async createProgram(programData: CreateProgramData): Promise<ApiResponse<Program>> {
    return api.post<Program>(PROGRAM_ENDPOINTS.CREATE, programData)
  }

  /**
   * Update program (University Admin only)
   * PUT /api/v1/programs/:id
   */
  static async updateProgram(id: string, updateData: Partial<CreateProgramData>): Promise<ApiResponse<Program>> {
    return api.put<Program>(PROGRAM_ENDPOINTS.UPDATE(id), updateData)
  }

  /**
   * Delete program (University Admin only)
   * DELETE /api/v1/programs/:id
   */
  static async deleteProgram(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(PROGRAM_ENDPOINTS.DELETE(id))
  }
}

// Export individual methods for convenience
export const programApi = {
  listPrograms: ProgramApi.listPrograms,
  getProgram: ProgramApi.getProgram,
  getProgramTypes: ProgramApi.getProgramTypes,
  createProgram: ProgramApi.createProgram,
  updateProgram: ProgramApi.updateProgram,
  deleteProgram: ProgramApi.deleteProgram,
}

// React Hook for Program Management
export const useProgramsAPI = () => {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPrograms = async (filters: ProgramFilters = {}) => {
    setLoading(true)
    try {
      const response = await ProgramApi.listPrograms(filters)
      if (response.success) {
        setPrograms(response.data.programs)
      } else {
        setError('Failed to fetch programs')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchProgramById = async (id: string) => {
    setLoading(true)
    try {
      const response = await ProgramApi.getProgram(id)
      if (response.success) {
        return response.data
      } else {
        setError('Failed to fetch program')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    fetchProgramById,
    setError
  }
}

// API call with retry for rate limiting
export const apiCallWithRetry = async <T>(
  apiFunction: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiFunction()
    } catch (error: any) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (2 ** i)))
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}