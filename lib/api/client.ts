import { API_BASE_URL } from "./endpoints"
import type { ApiResponse } from "./types"

// HTTP Client Configuration
const DEFAULT_TIMEOUT = 30000 // 30 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Token management
let accessToken: string | null = null
let refreshToken: string | null = null

// Request interceptor type
type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (response: any) => any | Promise<any>

interface RequestConfig {
  method: string
  url: string
  headers: Record<string, string>
  body?: any
  timeout?: number
}

class ApiClient {
  private baseURL: string
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
    this.setupDefaultInterceptors()
  }

  private setupDefaultInterceptors() {
    // Request interceptor for authentication
    this.addRequestInterceptor((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    })

    // Response interceptor for token refresh
    this.addResponseInterceptor(async (response) => {
      if (response.status === 401 && refreshToken) {
        try {
          await this.refreshAccessToken()
          // Retry the original request
          return this.request(response.config)
        } catch (error) {
          // Refresh failed, redirect to login
          this.clearTokens()
          if (typeof window !== "undefined") {
            window.location.href = "/auth/sign-in"
          }
          throw error
        }
      }
      return response
    })
  }

  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor)
  }

  setTokens(access: string, refresh: string) {
    accessToken = access
    refreshToken = refresh

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", access)
      localStorage.setItem("refreshToken", refresh)
    }
  }

  clearTokens() {
    accessToken = null
    refreshToken = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
    }
  }

  getTokens() {
    if (typeof window !== "undefined" && !accessToken) {
      accessToken = localStorage.getItem("accessToken")
      refreshToken = localStorage.getItem("refreshToken")
    }
    return { accessToken, refreshToken }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetch(`${this.baseURL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Token refresh failed")
    }

    const data = await response.json()
    this.setTokens(data.data.accessToken, data.data.refreshToken)
  }

  private async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    // Apply request interceptors
    let finalConfig = config
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), finalConfig.timeout || DEFAULT_TIMEOUT)

    try {
      const response = await fetch(`${this.baseURL}${finalConfig.url}`, {
        method: finalConfig.method,
        headers: finalConfig.headers,
        body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      let data
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Apply response interceptors
      let finalResponse = { ...response, data, config: finalConfig }
      for (const interceptor of this.responseInterceptors) {
        finalResponse = await interceptor(finalResponse)
      }

      if (!response.ok) {
        throw new ApiError(data.error || "Request failed", response.status, data)
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error.name === "AbortError") {
        throw new ApiError("Request timeout", 408)
      }

      throw new ApiError("Network error", 0, error)
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return this.request<T>({
      method: "GET",
      url: `${url}${queryString}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
  }

  async patch<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      url,
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    })
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  async upload<T>(url: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }

    return this.request<T>({
      method: "POST",
      url,
      headers: {
        // Don't set Content-Type for FormData, let browser set it with boundary
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      body: formData,
    })
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

// Create and export the default API client instance
export const api = new ApiClient()

// Export the class for custom instances
export { ApiClient }

// Utility functions for common operations
export const apiUtils = {
  /**
   * Check if error is an API error
   */
  isApiError: (error: any): error is ApiError => {
    return error instanceof ApiError
  },

  /**
   * Extract error message from API response
   */
  getErrorMessage: (error: any): string => {
    if (apiUtils.isApiError(error)) {
      return error.data?.error || error.message
    }
    return error.message || "An unexpected error occurred"
  },

  /**
   * Check if error is a validation error
   */
  isValidationError: (error: any): boolean => {
    return apiUtils.isApiError(error) && error.status === 422
  },

  /**
   * Extract validation errors from API response
   */
  getValidationErrors: (error: any): Record<string, string[]> => {
    if (apiUtils.isValidationError(error)) {
      return error.data?.errors || {}
    }
    return {}
  },

  /**
   * Check if error is an authentication error
   */
  isAuthError: (error: any): boolean => {
    return apiUtils.isApiError(error) && error.status === 401
  },

  /**
   * Check if error is an authorization error
   */
  isAuthorizationError: (error: any): boolean => {
    return apiUtils.isApiError(error) && error.status === 403
  },

  /**
   * Format file size for display
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  },

  /**
   * Validate file type
   */
  isValidFileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.type)
  },

  /**
   * Validate file size
   */
  isValidFileSize: (file: File, maxSizeInMB: number): boolean => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    return file.size <= maxSizeInBytes
  },
}
