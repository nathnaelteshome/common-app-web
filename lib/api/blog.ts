import { api } from "./client"
import type {
  BlogPost,
  BlogCategory,
  BlogPostsResponse,
  BlogCategoriesResponse,
  BlogSearchResponse,
  BlogCategoryWithPostsResponse,
  BlogPostCreateRequest,
  BlogCategoryCreateRequest,
  ApiResponse
} from "./types"

// Blog API endpoints
const BLOG_ENDPOINTS = {
  // Posts
  LIST_POSTS: "/api/v1/blog/posts",
  FEATURED_POSTS: "/api/v1/blog/posts/featured",
  GET_POST: (id: string) => `/api/v1/blog/posts/${id}`,
  GET_POST_BY_SLUG: (slug: string) => `/api/v1/blog/posts/slug/${slug}`,
  CREATE_POST: "/api/v1/blog/posts",
  UPDATE_POST: (id: string) => `/api/v1/blog/posts/${id}`,
  DELETE_POST: (id: string) => `/api/v1/blog/posts/${id}`,
  SEARCH_POSTS: "/api/v1/blog/search",

  // Categories
  LIST_CATEGORIES: "/api/v1/blog/categories",
  GET_CATEGORY: (id: string) => `/api/v1/blog/categories/${id}`,
  GET_CATEGORY_BY_SLUG: (slug: string) => `/api/v1/blog/categories/slug/${slug}`,
  CREATE_CATEGORY: "/api/v1/blog/categories",
  UPDATE_CATEGORY: (id: string) => `/api/v1/blog/categories/${id}`,
  DELETE_CATEGORY: (id: string) => `/api/v1/blog/categories/${id}`,
} as const

// Blog API Service
export class BlogApi {
  // Post methods
  static async listPosts(params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    author?: string
    featured?: boolean
    status?: "draft" | "published" | "archived"
    tags?: string
    sortBy?: "published_at" | "created_at" | "title" | "view_count"
    sortOrder?: "asc" | "desc"
  }): Promise<ApiResponse<BlogPostsResponse>> {
    return api.get<BlogPostsResponse>(BLOG_ENDPOINTS.LIST_POSTS, params)
  }

  static async getFeaturedPosts(params?: {
    limit?: number
  }): Promise<ApiResponse<{ posts: BlogPost[] }>> {
    return api.get<{ posts: BlogPost[] }>(BLOG_ENDPOINTS.FEATURED_POSTS, params)
  }

  static async getPost(id: string): Promise<ApiResponse<BlogPost>> {
    return api.get<BlogPost>(BLOG_ENDPOINTS.GET_POST(id))
  }

  static async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return api.get<BlogPost>(BLOG_ENDPOINTS.GET_POST_BY_SLUG(slug))
  }

  static async searchPosts(params: {
    q: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<BlogSearchResponse>> {
    return api.get<BlogSearchResponse>(BLOG_ENDPOINTS.SEARCH_POSTS, params)
  }

  static async createPost(data: BlogPostCreateRequest): Promise<ApiResponse<BlogPost>> {
    return api.post<BlogPost>(BLOG_ENDPOINTS.CREATE_POST, data)
  }

  static async updatePost(id: string, data: Partial<BlogPostCreateRequest>): Promise<ApiResponse<BlogPost>> {
    return api.put<BlogPost>(BLOG_ENDPOINTS.UPDATE_POST(id), data)
  }

  static async deletePost(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(BLOG_ENDPOINTS.DELETE_POST(id))
  }

  // Category methods
  static async listCategories(params?: {
    active?: boolean
  }): Promise<ApiResponse<BlogCategoriesResponse>> {
    return api.get<BlogCategoriesResponse>(BLOG_ENDPOINTS.LIST_CATEGORIES, params)
  }

  static async getCategory(id: string): Promise<ApiResponse<BlogCategory>> {
    return api.get<BlogCategory>(BLOG_ENDPOINTS.GET_CATEGORY(id))
  }

  static async getCategoryBySlug(slug: string, params?: {
    page?: number
    limit?: number
  }): Promise<ApiResponse<BlogCategoryWithPostsResponse>> {
    return api.get<BlogCategoryWithPostsResponse>(BLOG_ENDPOINTS.GET_CATEGORY_BY_SLUG(slug), params)
  }

  static async createCategory(data: BlogCategoryCreateRequest): Promise<ApiResponse<BlogCategory>> {
    return api.post<BlogCategory>(BLOG_ENDPOINTS.CREATE_CATEGORY, data)
  }

  static async updateCategory(id: string, data: Partial<BlogCategoryCreateRequest>): Promise<ApiResponse<BlogCategory>> {
    return api.put<BlogCategory>(BLOG_ENDPOINTS.UPDATE_CATEGORY(id), data)
  }

  static async deleteCategory(id: string): Promise<ApiResponse<{ message: string }>> {
    return api.delete<{ message: string }>(BLOG_ENDPOINTS.DELETE_CATEGORY(id))
  }
}

// Export individual methods for convenience
export const blogApi = {
  // Posts
  listPosts: BlogApi.listPosts,
  getFeaturedPosts: BlogApi.getFeaturedPosts,
  getPost: BlogApi.getPost,
  getPostBySlug: BlogApi.getPostBySlug,
  searchPosts: BlogApi.searchPosts,
  createPost: BlogApi.createPost,
  updatePost: BlogApi.updatePost,
  deletePost: BlogApi.deletePost,

  // Categories
  listCategories: BlogApi.listCategories,
  getCategory: BlogApi.getCategory,
  getCategoryBySlug: BlogApi.getCategoryBySlug,
  createCategory: BlogApi.createCategory,
  updateCategory: BlogApi.updateCategory,
  deleteCategory: BlogApi.deleteCategory,
}