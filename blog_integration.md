# Blog API Integration Guide

This guide provides comprehensive documentation for integrating with the Blog API endpoints. All endpoints are under the base path `/api/v1/blog`.

## Table of Contents
- [Authentication](#authentication)
- [Field Name Mapping](#field-name-mapping)
- [Endpoints](#endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Query Parameters](#query-parameters)
- [Field Validation](#field-validation)

## Authentication

Blog endpoints have different access levels:

**Role Requirements:**
- **Public Access**: List posts, get posts by ID/slug, search posts, list categories, get categories
- **Admin Role**: Create, update, delete posts and categories

Include the JWT token in the Authorization header for admin operations:
```
Authorization: Bearer <your-jwt-token>
```

## Field Name Mapping

The API uses camelCase in responses but accepts both camelCase and snake_case in requests.

### Blog Post Fields
| Response Field | Database Field | Type | Description |
|----------------|----------------|------|-------------|
| `id` | `id` | string (UUID) | Post unique identifier |
| `slug` | `slug` | string | URL-friendly identifier |
| `title` | `title` | string | Post title |
| `excerpt` | `excerpt` | string | Post excerpt/summary |
| `content` | `content` | string | Full post content |
| `image` | `image` | string | Featured image URL |
| `author` | `author` | string | Author name |
| `category` | `category` | object | Category information |
| `tags` | `tags` | array | Post tags |
| `status` | `status` | enum | "draft", "published", "archived" |
| `isFeatured` | `is_featured` | boolean | Featured status |
| `commentCount` | `comment_count` | integer | Number of comments |
| `viewCount` | `view_count` | integer | Number of views |
| `readTime` | `read_time` | integer | Estimated read time in minutes |
| `publishedAt` | `published_at` | datetime | Publication date |
| `createdAt` | `created_at` | datetime | Creation date |
| `updatedAt` | `updated_at` | datetime | Last update date |

### Blog Category Fields
| Response Field | Database Field | Type | Description |
|----------------|----------------|------|-------------|
| `id` | `id` | string (UUID) | Category unique identifier |
| `name` | `name` | string | Category name |
| `slug` | `slug` | string | URL-friendly identifier |
| `description` | `description` | string | Category description |
| `postCount` | `post_count` | integer | Number of posts in category |
| `isActive` | `is_active` | boolean | Active status |
| `createdAt` | `created_at` | datetime | Creation date |
| `updatedAt` | `updated_at` | datetime | Last update date |

## Endpoints

### Blog Posts

#### 1. List Blog Posts
**GET** `/api/v1/blog/posts`

**Access:** Public

**Query Parameters:**
- `page` (integer, default: 1) - Page number for pagination
- `limit` (integer, default: 10, max: 50) - Number of posts per page
- `search` (string) - Search posts by title, excerpt, or content
- `category` (string) - Filter by category slug or ID
- `author` (string) - Filter by author name
- `featured` (boolean) - Filter by featured status
- `status` (enum: "draft", "published", "archived", default: "published") - Filter by post status
- `tags` (string) - Filter by tags (comma-separated)
- `sortBy` (enum: "published_at", "created_at", "title", "view_count", default: "published_at") - Sort field
- `sortOrder` (enum: "asc", "desc", default: "desc") - Sort direction

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "slug": "how-to-apply-university",
        "title": "How to Apply to University: A Complete Guide",
        "excerpt": "Learn the step-by-step process of applying to university...",
        "image": "/images/blog/university-application.jpg",
        "author": "John Doe",
        "category": {
          "id": "category-uuid",
          "name": "University News",
          "slug": "university-news"
        },
        "tags": ["university", "application", "guide"],
        "status": "published",
        "isFeatured": true,
        "commentCount": 15,
        "viewCount": 1250,
        "readTime": 8,
        "publishedAt": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-14T15:20:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 2. Get Featured Posts
**GET** `/api/v1/blog/posts/featured`

**Access:** Public

**Query Parameters:**
- `limit` (integer, default: 5, max: 10) - Number of featured posts to return

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "slug": "featured-post-slug",
        "title": "Featured Post Title",
        "excerpt": "Post excerpt...",
        "image": "/images/featured-post.jpg",
        "author": "Author Name",
        "category": {
          "id": "category-uuid",
          "name": "Category Name",
          "slug": "category-slug"
        },
        "tags": ["tag1", "tag2"],
        "readTime": 5,
        "publishedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 3. Get Post by ID
**GET** `/api/v1/blog/posts/:id`

**Access:** Public

**Parameters:**
- `id` (string, required) - Post UUID

**Note:** This endpoint automatically increments the view count.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "slug": "post-slug",
    "title": "Post Title",
    "excerpt": "Post excerpt...",
    "content": "Full post content...",
    "image": "/images/post.jpg",
    "author": "Author Name",
    "category": {
      "id": "category-uuid",
      "name": "Category Name",
      "slug": "category-slug",
      "description": "Category description"
    },
    "tags": ["tag1", "tag2"],
    "status": "published",
    "isFeatured": false,
    "commentCount": 10,
    "viewCount": 501,
    "readTime": 7,
    "publishedAt": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-14T15:20:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. Get Post by Slug
**GET** `/api/v1/blog/posts/slug/:slug`

**Access:** Public

**Parameters:**
- `slug` (string, required) - Post slug (e.g., "how-to-apply-university")

**Response:** Same as Get Post by ID

#### 5. Search Posts
**GET** `/api/v1/blog/search`

**Access:** Public

**Query Parameters:**
- `q` (string, required) - Search query
- `page` (integer, default: 1) - Page number for pagination
- `limit` (integer, default: 10, max: 50) - Number of posts per page

**Response:**
```json
{
  "success": true,
  "data": {
    "query": "university application",
    "posts": [
      {
        "id": "uuid",
        "slug": "post-slug",
        "title": "Matching Post Title",
        "excerpt": "Post excerpt...",
        "image": "/images/post.jpg",
        "author": "Author Name",
        "category": {
          "id": "category-uuid",
          "name": "Category Name",
          "slug": "category-slug"
        },
        "tags": ["tag1", "tag2"],
        "readTime": 6,
        "publishedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

#### 6. Create Post (Admin Only)
**POST** `/api/v1/blog/posts`

**Access:** Requires `admin` role

**Request Body:**
```json
{
  "slug": "how-to-apply-university",
  "title": "How to Apply to University: A Complete Guide",
  "excerpt": "Learn the step-by-step process of applying to university...",
  "content": "Applying to university can be overwhelming...",
  "image": "/images/blog/university-application.jpg",
  "author": "John Doe",
  "categoryId": "category-uuid",
  "tags": ["university", "application", "guide"],
  "status": "draft",
  "isFeatured": false
}
```

**Response:** Returns created post object with 201 status.

**Notes:**
- Read time is automatically calculated based on content word count
- `publishedAt` is automatically set when status is "published"

#### 7. Update Post (Admin Only)
**PUT** `/api/v1/blog/posts/:id`

**Access:** Requires `admin` role

**Parameters:**
- `id` (string, required) - Post UUID

**Request Body:** Same structure as Create Post, but all fields are optional.

**Response:** Returns updated post object.

#### 8. Delete Post (Admin Only)
**DELETE** `/api/v1/blog/posts/:id`

**Access:** Requires `admin` role

**Parameters:**
- `id` (string, required) - Post UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Blog post deleted successfully"
  }
}
```

### Blog Categories

#### 1. List Categories
**GET** `/api/v1/blog/categories`

**Access:** Public

**Query Parameters:**
- `active` (boolean, default: true) - Filter by active status

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "University News",
        "slug": "university-news",
        "description": "Latest news and updates from universities",
        "postCount": 15,
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ]
  }
}
```

#### 2. Get Category by ID
**GET** `/api/v1/blog/categories/:id`

**Access:** Public

**Parameters:**
- `id` (string, required) - Category UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "University News",
    "slug": "university-news",
    "description": "Latest news and updates from universities",
    "postCount": 15,
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

#### 3. Get Category by Slug with Posts
**GET** `/api/v1/blog/categories/slug/:slug`

**Access:** Public

**Parameters:**
- `slug` (string, required) - Category slug (e.g., "university-news")

**Query Parameters:**
- `page` (integer, default: 1) - Page number for posts pagination
- `limit` (integer, default: 10, max: 50) - Number of posts per page

**Response:**
```json
{
  "success": true,
  "data": {
    "category": {
      "id": "uuid",
      "name": "University News",
      "slug": "university-news",
      "description": "Latest news and updates from universities",
      "postCount": 15,
      "isActive": true
    },
    "posts": [
      {
        "id": "uuid",
        "slug": "post-slug",
        "title": "Post Title",
        "excerpt": "Post excerpt...",
        "image": "/images/post.jpg",
        "author": "Author Name",
        "tags": ["tag1", "tag2"],
        "readTime": 5,
        "publishedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### 4. Create Category (Admin Only)
**POST** `/api/v1/blog/categories`

**Access:** Requires `admin` role

**Request Body:**
```json
{
  "name": "University News",
  "slug": "university-news",
  "description": "Latest news and updates from universities",
  "isActive": true
}
```

**Response:** Returns created category object with 201 status.

#### 5. Update Category (Admin Only)
**PUT** `/api/v1/blog/categories/:id`

**Access:** Requires `admin` role

**Parameters:**
- `id` (string, required) - Category UUID

**Request Body:** Same structure as Create Category, but all fields are optional.

**Response:** Returns updated category object.

#### 6. Delete Category (Admin Only)
**DELETE** `/api/v1/blog/categories/:id`

**Access:** Requires `admin` role

**Parameters:**
- `id` (string, required) - Category UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Blog category deleted successfully"
  }
}
```

**Note:** Cannot delete categories that have existing posts.

## Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* Response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* Additional error details */ }
}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, cannot delete category with posts)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (post/category not found)
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Scenarios
1. **Post/Category not found**: Returns 404 with error message
2. **Search query required**: Returns 400 when search endpoint called without `q` parameter
3. **Unauthorized access**: Returns 401 for missing token, 403 for insufficient permissions
4. **Cannot delete category**: Returns 400 when trying to delete category with existing posts

## Query Parameters

### Search Functionality
- **Post search**: Searches in title, excerpt, content, and tags
- **Category filtering**: Can filter by category slug or ID
- **Tag filtering**: Supports comma-separated tag lists

### Filtering Options
- `status`: Filter posts by publication status
- `featured`: Filter by featured status
- `author`: Filter by author name (case-insensitive)
- `active`: Filter categories by active status

### Sorting Options
- **Posts**: Sort by `published_at`, `created_at`, `title`, or `view_count`
- **Categories**: Sorted by name in ascending order

### Pagination
- `page`: Page number (minimum 1)
- `limit`: Items per page (Posts: max 50, Featured posts: max 10)

## Field Validation

### Required Fields for Post Creation
- `slug`: Non-empty string, URL-friendly
- `title`: Non-empty string
- `excerpt`: Non-empty string
- `content`: Non-empty string
- `author`: Non-empty string
- `categoryId`: Valid category UUID

### Required Fields for Category Creation
- `name`: Non-empty string
- `slug`: Non-empty string, URL-friendly

### Post Status Values
- `draft`: Post is not published
- `published`: Post is live and visible
- `archived`: Post is archived

### Slug Requirements
- Must be URL-friendly (lowercase, hyphens for spaces)
- Must be unique across all posts/categories
- Recommended format: "post-title" or "category-name"

## Best Practices for Frontend Integration

1. **Pagination**: Always implement pagination for list endpoints to handle large datasets.

2. **Search Debouncing**: Implement search debouncing to avoid excessive API calls.

3. **Caching**: Consider caching frequently accessed posts and categories.

4. **Error Handling**: Always check the `success` field and handle different error status codes.

5. **SEO-Friendly URLs**: Use post and category slugs for SEO-friendly URLs.

6. **View Tracking**: Use the slug endpoint for public post viewing to automatically track views.

7. **Featured Posts**: Use the featured posts endpoint for homepage or spotlight sections.

8. **Read Time Display**: Use the calculated `readTime` field to show estimated reading time.

9. **Tag Implementation**: Handle tags as arrays and provide tag-based filtering/navigation.

10. **Content Rendering**: Sanitize and properly render the `content` field which may contain HTML.

## Frontend Implementation Examples

### Fetching Blog Posts
```javascript
// List posts with pagination and filtering
const response = await fetch('/api/v1/blog/posts?page=1&limit=10&status=published&featured=true');
const { success, data } = await response.json();

if (success) {
  const { posts, pagination } = data;
  // Handle posts and pagination
}
```

### Search Implementation
```javascript
// Search posts with debouncing
const searchPosts = async (query) => {
  if (!query.trim()) return;
  
  const response = await fetch(`/api/v1/blog/search?q=${encodeURIComponent(query)}&limit=20`);
  const { success, data } = await response.json();
  
  if (success) {
    const { posts, pagination } = data;
    // Handle search results
  }
};
```

### Category Navigation
```javascript
// Get category with posts
const loadCategory = async (slug) => {
  const response = await fetch(`/api/v1/blog/categories/slug/${slug}?page=1&limit=12`);
  const { success, data } = await response.json();
  
  if (success) {
    const { category, posts, pagination } = data;
    // Handle category page
  }
};
```