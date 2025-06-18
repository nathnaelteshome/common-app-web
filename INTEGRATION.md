# CommonApply Backend Integration Guide

## 🌐 Production API Base URL
```
https://common-app-backend.onrender.com/api/v1
```

## 🔐 Authentication

### Authentication Flow
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### User Registration
**Endpoint:** `POST /auth/register`  
**Authentication:** None required

```javascript
// Student Registration
const studentData = {
  email: "student@email.com",
  password: "SecurePassword123!",
  role: "student",
  profile: {
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    phone_number: "+1234567890",
    date_of_birth: "1995-05-15",
    nationality: "US",
    bio: "Computer Science student passionate about AI"
  }
};

// University Registration
const universityData = {
  email: "admin@stanford.edu",
  password: "SecurePassword123!",
  role: "university",
  profile: {
    collegeName: "Stanford University",
    universityType: "PRIVATE", // or "PUBLIC"
    website: "https://stanford.edu",
    description: "Leading research university",
    establishedYear: 1885,
    fieldOfStudies: "Engineering, Medicine, Business",
    address: {
      street: "450 Serra Mall",
      city: "Stanford",
      state: "CA",
      zipCode: "94305",
      country: "USA"
    },
    contact: {
      phone: "+1-650-723-2300",
      email: "info@stanford.edu",
      admissions_email: "admissions@stanford.edu"
    }
  }
};

fetch('https://common-app-backend.onrender.com/api/v1/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(studentData)
});
```

### User Login
**Endpoint:** `POST /auth/login`  
**Authentication:** None required

```javascript
const loginData = {
  email: "user@email.com",
  password: "password123"
};

const response = await fetch('https://common-app-backend.onrender.com/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginData)
});

const { accessToken, refreshToken } = await response.json();
// Store tokens securely (localStorage, sessionStorage, or secure cookies)
```

### Token Refresh
**Endpoint:** `POST /auth/refresh`  
**Authentication:** None required

```javascript
const refreshData = {
  refreshToken: "stored_refresh_token"
};

fetch('https://common-app-backend.onrender.com/api/v1/auth/refresh', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(refreshData)
});
```

---

## 🏫 Universities

### List Universities (Public)
**Endpoint:** `GET /universities`  
**Authentication:** None required  
**Filtering Options:**

```javascript
const params = new URLSearchParams({
  page: '1',                    // Page number (default: 1)
  limit: '20',                 // Results per page (1-100, default: 20)
  search: 'Stanford',          // Search by name or description
  type: 'Private',             // 'Public' or 'Private'
  verified: 'true',            // 'true' or 'false'
  active: 'true',              // 'true' or 'false'
  sortBy: 'name',              // 'name' or 'created_at'
  sortOrder: 'asc'             // 'asc' or 'desc'
});

const response = await fetch(`https://common-app-backend.onrender.com/api/v1/universities?${params}`);
const data = await response.json();

// Response structure:
{
  "success": true,
  "data": {
    "universities": [
      {
        "id": "uuid",
        "name": "Stanford University",
        "slug": "stanford-university",
        "shortName": "Stanford",
        "isActive": true,
        "programCount": 50,
        "applicationCount": 1000,
        "profile": {
          "college_name": "Stanford University",
          "university_type": "Private",
          "description": "...",
          "website": "https://stanford.edu",
          "established_year": 1885,
          "address": {...},
          "contact": {...}
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get University by ID/Slug (Public)
**Endpoint:** `GET /universities/{id}` or `GET /universities/slug/{slug}`  
**Authentication:** None required

```javascript
// By ID
const university = await fetch('https://common-app-backend.onrender.com/api/v1/universities/uuid-here');

// By slug
const university = await fetch('https://common-app-backend.onrender.com/api/v1/universities/slug/stanford-university');
```

### Create University
**Endpoint:** `POST /universities`  
**Authentication:** Required (University role)

```javascript
const universityData = {
  name: "New University",
  short_name: "NewU",
  slug: "new-university",
  profile: {
    college_name: "New University",
    university_type: "Private", // Must be "Private" or "Public"
    description: "A new innovative university",
    website: "https://newu.edu",
    established_year: 2023,
    address: {
      street: "123 Education St",
      city: "Academic City",
      state: "CA",
      zipCode: "12345",
      country: "USA"
    },
    contact: {
      phone: "+1-555-0123",
      email: "info@newu.edu"
    },
    field_of_studies: "Technology, Business",
    accreditation: ["WASC", "ABET"],
    facilities: ["Library", "Labs", "Sports Complex"]
  }
};

fetch('https://common-app-backend.onrender.com/api/v1/universities', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(universityData)
});
```

---

## 📝 Applications

### List Applications
**Endpoint:** `GET /applications`  
**Authentication:** Required  
**Role-based Access:**
- Students: Only their applications
- University admins: Applications to their university
- System admins: All applications

**Filtering Options:**
```javascript
const params = new URLSearchParams({
  page: '1',                           // Page number
  limit: '20',                        // Results per page (1-100)
  status: 'submitted',                // Application status
  university_id: 'university-uuid'    // Filter by university
});

// Application statuses:
// - draft
// - submitted  
// - under_review
// - interview_scheduled
// - accepted
// - rejected
// - waitlisted

const response = await fetch(
  `https://common-app-backend.onrender.com/api/v1/applications?${params}`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);
```

### Create Application
**Endpoint:** `POST /applications`  
**Authentication:** Required (Student role)

```javascript
const applicationData = {
  university_id: "university-uuid",
  program_id: "program-uuid",
  personal_statement: "My passion for computer science...",
  academic_history: {
    gpa: 3.8,
    standardized_tests: {
      sat: 1450,
      act: 32
    },
    courses: [
      {
        name: "Advanced Mathematics",
        grade: "A",
        credits: 4
      }
    ]
  },
  documents: {
    transcript: "file-url",
    recommendation_letters: ["file-url-1", "file-url-2"],
    essays: ["file-url"]
  }
};

fetch('https://common-app-backend.onrender.com/api/v1/applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(applicationData)
});
```

### Update Application
**Endpoint:** `PUT /applications/{id}`  
**Authentication:** Required (Owner or admin)

```javascript
const updateData = {
  personalInfo: {
    emergency_contact: {
      name: "Jane Doe",
      relationship: "Mother",
      phone: "+1-555-0123"
    }
  },
  academicInfo: {
    gpa: 3.9,
    class_rank: 5
  },
  essays: {
    personal_statement: "Updated personal statement..."
  }
};

fetch(`https://common-app-backend.onrender.com/api/v1/applications/${applicationId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(updateData)
});
```

### Submit Application
**Endpoint:** `POST /applications/{id}/submit`  
**Authentication:** Required (Student role)

```javascript
fetch(`https://common-app-backend.onrender.com/api/v1/applications/${applicationId}/submit`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

---

## 👤 User Profile Management

### Get Current User Profile
**Endpoint:** `GET /users/profile`  
**Authentication:** Required

```javascript
const profile = await fetch('https://common-app-backend.onrender.com/api/v1/users/profile', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});
```

### Update Current User Profile
**Endpoint:** `PUT /users/profile`  
**Authentication:** Required

```javascript
// Student profile update
const studentUpdate = {
  first_name: "John",
  last_name: "Smith",
  phone_number: "+1-555-9999",
  bio: "Updated bio",
  address: {
    street: "456 New St",
    city: "New City",
    state: "NY",
    zipCode: "10001",
    country: "USA"
  },
  preferences: {
    notification_email: true,
    newsletter: false
  }
};

// University profile update
const universityUpdate = {
  college_name: "Updated University Name",
  description: "Updated description",
  website: "https://updated-url.edu",
  contact: {
    admissions_phone: "+1-555-ADMISSIONS"
  }
};

fetch('https://common-app-backend.onrender.com/api/v1/users/profile', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify(studentUpdate)
});
```

### List Users (Admin Only)
**Endpoint:** `GET /users`  
**Authentication:** Required (Admin role)  
**Filtering Options:**

```javascript
const params = new URLSearchParams({
  page: '1',                    // Page number
  limit: '50',                 // Results per page (1-100)
  role: 'student',             // 'student', 'university', 'admin'
  search: 'john@email.com',    // Search by email
  status: 'active',            // 'active' or 'inactive'
  sortBy: 'created_at',        // 'created_at', 'email', 'role'
  sortOrder: 'desc'            // 'asc' or 'desc'
});

const users = await fetch(
  `https://common-app-backend.onrender.com/api/v1/users?${params}`,
  {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  }
);
```

---

## 🔗 System Endpoints

### Health Check
**Endpoint:** `GET /health`  
**Authentication:** None required

```javascript
const health = await fetch('https://common-app-backend.onrender.com/api/v1/health');
// Response: { "success": true, "status": "healthy", "timestamp": "...", "version": "v1" }
```

### Detailed Health Check
**Endpoint:** `GET /health/detailed`  
**Authentication:** None required

```javascript
const detailedHealth = await fetch('https://common-app-backend.onrender.com/api/v1/health/detailed');
// Response includes database status, uptime, and service health
```

---

## ⚠️ Error Handling

The API returns consistent error responses:

```javascript
// Error Response Format
{
  "success": false,
  "error": "Error message",
  "meta": {
    "timestamp": "2023-...",
    "statusCode": 400
  }
}

// Common HTTP Status Codes
// 200 - Success
// 201 - Created
// 400 - Bad Request
// 401 - Unauthorized
// 403 - Forbidden
// 404 - Not Found
// 409 - Conflict (e.g., email already exists)
// 422 - Validation Error
// 500 - Internal Server Error
// 501 - Not Implemented
```

---

## 📚 Data Models Reference

### User Roles
- `student` - Students applying to universities
- `university` - University administrators  
- `admin` - System administrators

### University Types
- `Private` - Private universities
- `Public` - Public universities

### Application Status Flow
```
draft → submitted → under_review → interview_scheduled → accepted/rejected/waitlisted
```

### Required vs Optional Fields

**University Profile (Required):**
- `college_name` (string)
- `university_type` ("Private" or "Public")
- `address` (object)
- `contact` (object)

**Student Profile (Required):**
- `first_name` (string)
- `last_name` (string)
- `username` (string, unique)

---

## 🚀 Quick Start Example

```javascript
class CommonApplyAPI {
  constructor(baseURL = 'https://common-app-backend.onrender.com/api/v1') {
    this.baseURL = baseURL;
    this.accessToken = localStorage.getItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { 'Authorization': `Bearer ${this.accessToken}` }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.accessToken = data.accessToken;
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Universities
  async getUniversities(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/universities?${params}`);
  }

  async getUniversity(id) {
    return this.request(`/universities/${id}`);
  }

  // Applications
  async getApplications(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/applications?${params}`);
  }

  async createApplication(applicationData) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData)
    });
  }

  async submitApplication(applicationId) {
    return this.request(`/applications/${applicationId}/submit`, {
      method: 'POST'
    });
  }
}

// Usage
const api = new CommonApplyAPI();

// Login
await api.login('student@email.com', 'password123');

// Get universities
const universities = await api.getUniversities({ 
  type: 'Private', 
  verified: 'true' 
});

// Create application
const application = await api.createApplication({
  university_id: 'uuid',
  program_id: 'uuid',
  personal_statement: '...'
});
```

---

## 🔧 Frontend Implementation Guide

### **Setting Up the API Client**

The frontend uses a structured API client with automatic token management and error handling.

#### **1. Environment Configuration**

Create `.env.local` file:
```bash
# Production Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=https://common-app-backend.onrender.com
NEXT_PUBLIC_API_VERSION=v1

# Application Configuration
NEXT_PUBLIC_APP_NAME=CommonApply
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### **2. API Endpoints Configuration**

File: `lib/api/endpoints.ts`
```typescript
// Base API configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://common-app-backend.onrender.com"
export const API_VERSION = "v1"
export const API_PREFIX = `/api/${API_VERSION}`

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_PREFIX}/auth/login`,
  REGISTER: `${API_PREFIX}/auth/register`,
  REFRESH: `${API_PREFIX}/auth/refresh`,
  LOGOUT: `${API_PREFIX}/auth/logout`,
  FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
  RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
  VERIFY_EMAIL: `${API_PREFIX}/auth/verify-email`,
  RESEND_VERIFICATION: `${API_PREFIX}/auth/resend-verification`,
  CHANGE_PASSWORD: `${API_PREFIX}/auth/change-password`,
  ME: `${API_PREFIX}/auth/me`,
} as const

// University Endpoints
export const UNIVERSITY_ENDPOINTS = {
  LIST: `${API_PREFIX}/universities`,
  CREATE: `${API_PREFIX}/universities`,
  GET: (id: string) => `${API_PREFIX}/universities/${id}`,
  GET_BY_SLUG: (slug: string) => `${API_PREFIX}/universities/slug/${slug}`,
  UPDATE: (id: string) => `${API_PREFIX}/universities/${id}`,
  DELETE: (id: string) => `${API_PREFIX}/universities/${id}`,
  SEARCH: `${API_PREFIX}/universities/search`,
} as const

// Application Endpoints
export const APPLICATION_ENDPOINTS = {
  LIST: `${API_PREFIX}/applications`,
  CREATE: `${API_PREFIX}/applications`,
  GET: (id: string) => `${API_PREFIX}/applications/${id}`,
  UPDATE: (id: string) => `${API_PREFIX}/applications/${id}`,
  SUBMIT: (id: string) => `${API_PREFIX}/applications/${id}/submit`,
  UPDATE_STATUS: (id: string) => `${API_PREFIX}/applications/${id}/status`,
} as const
```

#### **3. Authentication Service**

File: `lib/auth-service.ts`
```typescript
import { AuthApi } from "@/lib/api/auth"
import { apiUtils } from "@/lib/api/client"

class AuthService {
  private currentUser: User | null = null

  async signIn(data: SignInData): Promise<{ user: User; token: string }> {
    try {
      const response = await AuthApi.login({ 
        email: data.email, 
        password: data.password 
      })

      if (!response.success || !response.data) {
        throw new Error("Login failed")
      }

      const { user, accessToken } = response.data
      this.currentUser = user

      // Store user data in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("current_user", JSON.stringify(user))
        document.cookie = `auth_token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`
      }

      return { user, token: accessToken }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Login failed. Please try again.")
    }
  }

  async signUp(data: StudentRegistrationData | UniversityRegistrationData): Promise<{ message: string }> {
    try {
      // Transform data to match backend API format
      const registerData = {
        email: data.email,
        password: data.password,
        role: data.role,
        profile: data.role === "student" ? {
          firstName: (data as StudentRegistrationData).firstName,
          lastName: (data as StudentRegistrationData).lastName,
          username: (data as StudentRegistrationData).username,
          phone_number: (data as StudentRegistrationData).phoneNumber,
          date_of_birth: (data as StudentRegistrationData).dateOfBirth,
          nationality: (data as StudentRegistrationData).nationality || "US",
          bio: (data as StudentRegistrationData).bio || ""
        } : {
          collegeName: (data as UniversityRegistrationData).universityName,
          universityType: (data as UniversityRegistrationData).universityType,
          website: (data as UniversityRegistrationData).website,
          description: (data as UniversityRegistrationData).description,
          establishedYear: (data as UniversityRegistrationData).establishedYear,
          fieldOfStudies: (data as UniversityRegistrationData).fieldOfStudies,
          address: {
            street: (data as UniversityRegistrationData).address.street,
            city: (data as UniversityRegistrationData).address.city,
            state: (data as UniversityRegistrationData).address.state,
            zipCode: (data as UniversityRegistrationData).address.zipCode,
            country: (data as UniversityRegistrationData).address.country || "USA"
          },
          contact: {
            phone: (data as UniversityRegistrationData).contact.phone,
            email: (data as UniversityRegistrationData).contact.email,
            admissions_email: (data as UniversityRegistrationData).contact.admissions_email
          }
        }
      }

      const response = await AuthApi.register(registerData)
      
      if (!response.success) {
        throw new Error("Registration failed")
      }

      return {
        message: "Account created successfully. Please check your email for verification.",
      }
    } catch (error) {
      if (apiUtils.isApiError(error)) {
        throw new Error(apiUtils.getErrorMessage(error))
      }
      throw new Error("Registration failed. Please try again.")
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === "undefined") return null

    try {
      if (!AuthApi.isAuthenticated()) {
        return null
      }

      // Try to get user from localStorage first (for performance)
      const storedUser = localStorage.getItem("current_user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        this.currentUser = user
        return user
      }

      // If no stored user, fetch from API
      const response = await AuthApi.getCurrentUser()
      if (response.success && response.data) {
        const user = response.data
        this.currentUser = user
        localStorage.setItem("current_user", JSON.stringify(user))
        return user
      }

      return null
    } catch (error) {
      console.error("Error getting current user:", error)
      this.signOut()
      return null
    }
  }

  async signOut(): Promise<void> {
    try {
      await AuthApi.logout()
    } catch (error) {
      console.error("Logout API call failed:", error)
    } finally {
      this.currentUser = null
      if (typeof window !== "undefined") {
        localStorage.removeItem("current_user")
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      }
    }
  }

  // Helper methods for role checking
  isAuthenticated(): boolean {
    return AuthApi.isAuthenticated()
  }

  isStudent(): boolean {
    return AuthApi.isStudent()
  }

  isUniversity(): boolean {
    return AuthApi.isUniversity()
  }

  isAdmin(): boolean {
    return AuthApi.isAdmin()
  }
}

export const authService = new AuthService()
```

#### **4. Usage in React Components**

**Login Form Example:**
```typescript
import { authService } from "@/lib/auth-service"
import { toast } from "sonner"

const SignInForm = () => {
  const onSubmit = async (data: SignInData) => {
    try {
      const result = await authService.signIn(data)
      setUser(result.user)
      toast.success("Sign in successful!")
      
      // Redirect based on user role
      switch (result.user.role) {
        case "student":
          router.push("/student/dashboard")
          break
        case "university":
          router.push("/admin/dashboard")
          break
        case "admin":
          router.push("/system-admin/dashboard")
          break
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
}
```

**Registration Form Example:**
```typescript
const StudentRegistrationForm = () => {
  const onSubmit = async (data: StudentRegistrationData) => {
    try {
      await authService.signUp(data)
      router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (error) {
      setError(error.message)
    }
  }
}
```

#### **5. Token Management**

The API client automatically handles:
- **Token Storage**: Secure storage in localStorage and cookies
- **Auto-Refresh**: Automatic token refresh on 401 errors
- **Request Interceptors**: Automatic addition of Authorization header
- **Error Handling**: Proper error formatting and user feedback

#### **6. Error Handling Patterns**

```typescript
import { apiUtils } from "@/lib/api/client"

try {
  const response = await AuthApi.login(credentials)
  // Handle success
} catch (error) {
  if (apiUtils.isApiError(error)) {
    // Handle API errors
    const message = apiUtils.getErrorMessage(error)
    if (apiUtils.isValidationError(error)) {
      const validationErrors = apiUtils.getValidationErrors(error)
      // Handle validation errors
    }
  } else {
    // Handle network errors
    console.error("Network error:", error)
  }
}
```

---

## 📝 Notes for Frontend Integration

1. **Token Management**: Implement automatic token refresh logic
2. **Error Handling**: Handle 401 errors by redirecting to login
3. **Loading States**: Show loading indicators during API calls
4. **Validation**: Validate required fields before API calls
5. **File Uploads**: Not yet implemented - use placeholder URLs
6. **Real-time Updates**: Consider WebSocket integration for real-time notifications
7. **Caching**: Implement client-side caching for frequently accessed data
8. **Rate Limiting**: Be mindful of API rate limits in production

---

## 🐛 Troubleshooting

- **401 Unauthorized**: Check if token is valid and not expired
- **403 Forbidden**: User doesn't have permission for this action
- **422 Validation Error**: Check request body format and required fields
- **501 Not Implemented**: Feature is planned but not yet available
- **CORS Issues**: Should be resolved in production, contact backend team if persists