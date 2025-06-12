# Complete CRUD Operations Documentation

This document provides comprehensive documentation for all CRUD (Create, Read, Update, Delete) operations available in the CommonApply API.

## Table of Contents

1. [User Management CRUD](#user-management-crud)
2. [Application Management CRUD](#application-management-crud)
3. [University Management CRUD](#university-management-crud)
4. [Authentication & Authorization](#authentication--authorization)
5. [Error Handling](#error-handling)
6. [Data Validation](#data-validation)

## User Management CRUD

### GET /api/v1/users/profile
**Purpose**: Get current user's profile  
**Authentication**: Required  
**Authorization**: Any authenticated user  

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student",
    "isEmailVerified": true,
    "isActive": true,
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "phoneNumber": "+1234567890",
      "dateOfBirth": "1990-01-01",
      "avatar": "https://example.com/avatar.jpg"
    },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
\`\`\`

### PUT /api/v1/users/profile
**Purpose**: Update current user's profile  
**Authentication**: Required  
**Authorization**: Any authenticated user  

**Request Body**:
\`\`\`json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "phoneNumber": "+1234567891",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  }
}
\`\`\`

**Response**: Same as GET profile

### GET /api/v1/users/:id
**Purpose**: Get user by ID (Admin only)  
**Authentication**: Required  
**Authorization**: Admin role  

**Path Parameters**:
- `id`: User UUID

**Response**: Same as GET profile

### PUT /api/v1/users/:id/role
**Purpose**: Update user role (Admin only)  
**Authentication**: Required  
**Authorization**: Admin role  

**Path Parameters**:
- `id`: User UUID

**Request Body**:
\`\`\`json
{
  "role": "student|university|admin"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "university",
    "message": "User role updated successfully"
  }
}
\`\`\`

### DELETE /api/v1/users/:id
**Purpose**: Delete user (Admin only)  
**Authentication**: Required  
**Authorization**: Admin role  

**Path Parameters**:
- `id`: User UUID

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "message": "User deleted successfully"
  }
}
\`\`\`

### GET /api/v1/users
**Purpose**: List users with pagination (Admin only)  
**Authentication**: Required  
**Authorization**: Admin role  

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `role`: Filter by role (student|university|admin)
- `search`: Search by name or email
- `isActive`: Filter by active status (true|false)
- `sortBy`: Sort field (createdAt|email|role)
- `sortOrder`: Sort direction (asc|desc)

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "role": "student",
        "isActive": true,
        "profile": { ... },
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
\`\`\`

## Application Management CRUD

### GET /api/v1/applications
**Purpose**: List applications  
**Authentication**: Required  
**Authorization**: 
- Students: Only their applications
- Universities: Applications to their institution
- Admins: All applications

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (draft|submitted|under_review|accepted|rejected|waitlisted)
- `universityId`: Filter by university
- `studentId`: Filter by student (admin only)
- `programId`: Filter by program
- `dateFrom`: Filter applications from date (ISO 8601)
- `dateTo`: Filter applications to date (ISO 8601)
- `sortBy`: Sort field (createdAt|submittedAt|status)
- `sortOrder`: Sort direction (asc|desc)

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "studentId": "uuid",
        "universityId": "uuid",
        "programId": "uuid",
        "status": "submitted",
        "personalStatement": "My statement...",
        "academicHistory": [...],
        "documents": [...],
        "paymentStatus": "paid",
        "submittedAt": "2023-01-01T00:00:00Z",
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
\`\`\`

### POST /api/v1/applications
**Purpose**: Create new application  
**Authentication**: Required  
**Authorization**: Student role  

**Request Body**:
\`\`\`json
{
  "universityId": "uuid",
  "programId": "uuid",
  "personalStatement": "My personal statement explaining why I want to study here...",
  "academicHistory": [
    {
      "institution": "High School Name",
      "degree": "High School Diploma",
      "fieldOfStudy": "General Studies",
      "gpa": 3.8,
      "startDate": "2018-09-01",
      "endDate": "2022-06-01",
      "isCompleted": true
    }
  ]
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "studentId": "uuid",
    "universityId": "uuid",
    "programId": "uuid",
    "status": "draft",
    "personalStatement": "My personal statement...",
    "academicHistory": [...],
    "documents": [],
    "paymentStatus": "pending",
    "createdAt": "2023-01-01T00:00:00Z"
  }
}
\`\`\`

### GET /api/v1/applications/:id
**Purpose**: Get application by ID  
**Authentication**: Required  
**Authorization**: 
- Students: Only their applications
- Universities: Applications to their institution
- Admins: All applications

**Path Parameters**:
- `id`: Application UUID

**Response**: Same as POST response with full details

### PUT /api/v1/applications/:id
**Purpose**: Update application  
**Authentication**: Required  
**Authorization**: 
- Students: Only their draft applications
- Universities: Cannot update application data
- Admins: All applications

**Path Parameters**:
- `id`: Application UUID

**Request Body**:
\`\`\`json
{
  "personalStatement": "Updated personal statement...",
  "academicHistory": [
    {
      "institution": "Updated Institution",
      "degree": "Bachelor's Degree",
      "fieldOfStudy": "Computer Science",
      "gpa": 3.9,
      "startDate": "2019-09-01",
      "endDate": "2023-06-01",
      "isCompleted": true
    }
  ]
}
\`\`\`

**Response**: Updated application object

### DELETE /api/v1/applications/:id
**Purpose**: Delete application  
**Authentication**: Required  
**Authorization**: 
- Students: Only their draft applications
- Admins: All applications

**Path Parameters**:
- `id`: Application UUID

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Application deleted successfully"
  }
}
\`\`\`

### PUT /api/v1/applications/:id/status
**Purpose**: Update application status  
**Authentication**: Required  
**Authorization**: 
- Universities: Applications to their institution
- Admins: All applications

**Path Parameters**:
- `id`: Application UUID

**Request Body**:
\`\`\`json
{
  "status": "accepted|rejected|waitlisted|under_review",
  "notes": "Optional decision notes for the student"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "accepted",
    "reviewedAt": "2023-01-01T00:00:00Z",
    "decisionNotes": "Congratulations! You have been accepted..."
  }
}
\`\`\`

## University Management CRUD

### GET /api/v1/universities
**Purpose**: List universities  
**Authentication**: Optional (public endpoint)  
**Authorization**: Public access  

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name or description
- `country`: Filter by country
- `city`: Filter by city
- `isVerified`: Filter by verification status (true|false)
- `isActive`: Filter by active status (true|false)
- `programType`: Filter by available program types
- `sortBy`: Sort field (name|createdAt|ranking)
- `sortOrder`: Sort direction (asc|desc)

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "name": "University of Example",
        "slug": "university-of-example",
        "description": "A leading institution...",
        "location": {
          "address": "123 University Ave",
          "city": "Example City",
          "state": "EX",
          "country": "USA",
          "coordinates": {
            "lat": 40.7128,
            "lng": -74.0060
          }
        },
        "contact": {
          "email": "admissions@example.edu",
          "phone": "+1234567890",
          "website": "https://example.edu"
        },
        "isVerified": true,
        "isActive": true,
        "images": ["https://example.com/campus1.jpg"],
        "createdAt": "2023-01-01T00:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
\`\`\`

### POST /api/v1/universities
**Purpose**: Create new university  
**Authentication**: Required  
**Authorization**: System Admin role  

**Request Body**:
\`\`\`json
{
  "name": "New University",
  "slug": "new-university",
  "description": "A comprehensive description of the university...",
  "website": "https://newuniversity.edu",
  "establishedYear": 1950,
  "location": {
    "address": "456 Education Blvd",
    "city": "Learning City",
    "state": "LC",
    "country": "USA",
    "coordinates": {
      "lat": 40.7589,
      "lng": -73.9851
    }
  },
  "contact": {
    "email": "info@newuniversity.edu",
    "phone": "+1987654321",
    "website": "https://newuniversity.edu"
  },
  "programs": [
    {
      "name": "Computer Science",
      "degree": "bachelor",
      "duration": 4,
      "durationUnit": "years",
      "description": "Comprehensive CS program...",
      "requirements": ["High school diploma", "SAT scores"],
      "tuitionFee": 25000,
      "currency": "USD",
      "isActive": true
    }
  ]
}
\`\`\`

**Response**: Created university object with generated ID

### GET /api/v1/universities/:id
**Purpose**: Get university by ID  
**Authentication**: Optional  
**Authorization**: Public access  

**Path Parameters**:
- `id`: University UUID

**Response**: Full university object with programs and details

### PUT /api/v1/universities/:id
**Purpose**: Update university  
**Authentication**: Required  
**Authorization**: 
- University admins: Only their institution
- System admins: All universities

**Path Parameters**:
- `id`: University UUID

**Request Body**: Partial university object with fields to update

**Response**: Updated university object

### PUT /api/v1/universities/:id/verify
**Purpose**: Verify/unverify university  
**Authentication**: Required  
**Authorization**: System Admin role  

**Path Parameters**:
- `id`: University UUID

**Request Body**:
\`\`\`json
{
  "isVerified": true,
  "verificationNotes": "All documents verified and approved"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "University Name",
    "isVerified": true,
    "verificationNotes": "All documents verified and approved",
    "verifiedAt": "2023-01-01T00:00:00Z"
  }
}
\`\`\`

### GET /api/v1/universities/search
**Purpose**: Advanced university search  
**Authentication**: Optional  
**Authorization**: Public access  

**Query Parameters**:
- `query`: Search query string
- `location`: Location filter
- `programType`: Program type filter (bachelor|master|phd)
- `tuitionRange`: Tuition range filter (min-max)
- `ranking`: Minimum ranking filter
- `page`: Page number
- `limit`: Items per page
- `sortBy`: Sort field
- `sortOrder`: Sort direction

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "universities": [...],
    "filters": {
      "locations": ["USA", "Canada", "UK"],
      "programTypes": ["bachelor", "master", "phd"],
      "tuitionRange": {
        "min": 5000,
        "max": 50000
      }
    },
    "pagination": { ... }
  }
}
\`\`\`

## Authentication & Authorization

### Required Headers
\`\`\`
Authorization: Bearer <jwt_access_token>
Content-Type: application/json
\`\`\`

### Role-Based Access Control

#### Student Role
- **Can access**: Own profile, own applications, public university data
- **Can create**: Applications, profile updates
- **Can update**: Own profile, own draft applications
- **Can delete**: Own draft applications

#### University Role
- **Can access**: Own profile, applications to their institution, own university data
- **Can create**: Programs for their university
- **Can update**: Own profile, own university data, application statuses
- **Can delete**: Own programs

#### Admin Role
- **Can access**: All data
- **Can create**: Users, universities, system-wide data
- **Can update**: All data, user roles, verification statuses
- **Can delete**: All data (with restrictions)

### Permission Matrix

| Endpoint | Student | University | Admin |
|----------|---------|------------|-------|
| GET /users/profile | ✅ Own | ✅ Own | ✅ All |
| PUT /users/profile | ✅ Own | ✅ Own | ✅ All |
| GET /users/:id | ❌ | ❌ | ✅ |
| PUT /users/:id/role | ❌ | ❌ | ✅ |
| DELETE /users/:id | ❌ | ❌ | ✅ |
| GET /applications | ✅ Own | ✅ To Institution | ✅ All |
| POST /applications | ✅ | ❌ | ✅ |
| PUT /applications/:id | ✅ Own Draft | ❌ | ✅ |
| DELETE /applications/:id | ✅ Own Draft | ❌ | ✅ |
| PUT /applications/:id/status | ❌ | ✅ To Institution | ✅ |
| GET /universities | ✅ Public | ✅ Public | ✅ All |
| POST /universities | ❌ | ❌ | ✅ |
| PUT /universities/:id | ❌ | ✅ Own | ✅ All |
| PUT /universities/:id/verify | ❌ | ❌ | ✅ |

## Error Handling

### Standard Error Response
\`\`\`json
{
  "success": false,
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2023-01-01T00:00:00Z",
  "path": "/api/v1/endpoint"
}
\`\`\`

### Common Error Codes

#### Authentication Errors (401)
- `AUTH_TOKEN_MISSING`: No authorization header provided
- `AUTH_TOKEN_INVALID`: Invalid or expired token
- `AUTH_TOKEN_EXPIRED`: Token has expired

#### Authorization Errors (403)
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_ACCESS_DENIED`: Cannot access this specific resource
- `ROLE_REQUIRED`: Specific role required for this action

#### Validation Errors (422)
- `VALIDATION_FAILED`: Request data validation failed
- `REQUIRED_FIELD_MISSING`: Required field not provided
- `INVALID_FORMAT`: Field format is invalid
- `DUPLICATE_VALUE`: Value already exists (e.g., email)

#### Resource Errors (404)
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `USER_NOT_FOUND`: User not found
- `APPLICATION_NOT_FOUND`: Application not found
- `UNIVERSITY_NOT_FOUND`: University not found

#### Business Logic Errors (400)
- `APPLICATION_ALREADY_SUBMITTED`: Cannot modify submitted application
- `PAYMENT_REQUIRED`: Payment required before action
- `UNIVERSITY_NOT_VERIFIED`: University must be verified
- `DUPLICATE_APPLICATION`: Application already exists for this program

## Data Validation

### User Profile Validation
\`\`\`javascript
{
  email: {
    required: true,
    format: "email",
    unique: true
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: "^[a-zA-Z\\s]+$"
  },
  phoneNumber: {
    required: false,
    format: "international_phone"
  },
  dateOfBirth: {
    required: true,
    format: "date",
    maxDate: "18_years_ago"
  }
}
\`\`\`

### Application Validation
\`\`\`javascript
{
  universityId: {
    required: true,
    format: "uuid",
    exists: "universities.id"
  },
  programId: {
    required: true,
    format: "uuid"
  },
  personalStatement: {
    required: false,
    minLength: 100,
    maxLength: 5000
  },
  academicHistory: {
    required: true,
    type: "array",
    minItems: 1,
    items: {
      institution: { required: true },
      degree: { required: true },
      gpa: { required: true, min: 0, max: 4 }
    }
  }
}
\`\`\`

### University Validation
\`\`\`javascript
{
  name: {
    required: true,
    minLength: 3,
    maxLength: 255,
    unique: true
  },
  slug: {
    required: true,
    format: "slug",
    unique: true
  },
  location: {
    required: true,
    type: "object",
    properties: {
      country: { required: true },
      city: { required: true },
      address: { required: true }
    }
  },
  contact: {
    required: true,
    type: "object",
    properties: {
      email: { required: true, format: "email" },
      phone: { required: true, format: "phone" },
      website: { required: false, format: "url" }
    }
  }
}
\`\`\`

This comprehensive CRUD documentation provides all the necessary information for implementing and consuming the CommonApply API endpoints with proper authentication, authorization, validation, and error handling.
