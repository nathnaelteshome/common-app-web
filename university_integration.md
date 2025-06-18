# University API Integration Guide

This guide provides comprehensive documentation for integrating with the University API endpoints. All endpoints are under the base path `/api/v1/universities`.

## Table of Contents
- [Authentication](#authentication)
- [Field Name Mapping](#field-name-mapping)
- [Endpoints](#endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Query Parameters](#query-parameters)
- [Field Validation](#field-validation)

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

**Role Requirements:**
- **Public Access**: List universities, get university by ID/slug
- **University Role**: Create university, update own university
- **Admin Role**: Delete university, verify university, bulk operations

## Field Name Mapping

The API supports both camelCase (frontend) and snake_case (database) field naming. You can use either format in requests.

### University Fields
| Frontend (camelCase) | Database (snake_case) | Type | Description |
|---------------------|----------------------|------|-------------|
| `name` | `name` | string | University full name |
| `shortName` | `short_name` | string | University short name/abbreviation |
| `slug` | `slug` | string | URL-friendly identifier |
| `isActive` | `is_active` | boolean | Active status |

### Profile Fields
| Frontend (camelCase) | Database (snake_case) | Type | Description |
|---------------------|----------------------|------|-------------|
| `collegeName` | `college_name` | string | College/University name |
| `shortName` | `short_name` | string | Short name |
| `description` | `description` | string | University description |
| `website` | `website` | string | Official website URL |
| `establishedYear` | `established_year` | number | Year established |
| `universityType` | `university_type` | enum | "Public" or "Private" |
| `address` | `address` | object | Address information |
| `contact` | `contact` | object | Contact information |
| `location` | `location` | string | Location description |
| `fieldOfStudies` | `field_of_studies` | string | Fields of study |
| `campusImage` | `campus_image` | string | Campus image URL |
| `accreditation` | `accreditation` | array | Accreditation information |
| `rankings` | `rankings` | object | University rankings |
| `facilities` | `facilities` | array | Campus facilities |
| `campusSize` | `campus_size` | string | Campus size description |
| `studentToFacultyRatio` | `student_to_faculty_ratio` | string | Student-faculty ratio |
| `totalStudents` | `total_students` | number | Total student count |
| `totalApplicants` | `total_applicants` | number | Total applicant count |
| `acceptanceRate` | `acceptance_rate` | number | Acceptance rate percentage |
| `verificationDocuments` | `verification_documents` | array | Verification documents |

## Endpoints

### 1. List Universities
**GET** `/api/v1/universities`

**Access:** Public

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `search` (string) - Search by name or description
- `type` (enum: "Public", "Private") - Filter by university type
- `verified` (boolean) - Filter by verification status
- `active` (boolean) - Filter by active status
- `sortBy` (enum: "name", "created_at", default: "name") - Sort field
- `sortOrder` (enum: "asc", "desc", default: "asc") - Sort direction

**Response:**
```json
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
        "programCount": 45,
        "applicationCount": 1250,
        "profile": { /* University profile object */ },
        "programs": [ /* Program objects with applicationCount */ ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Get University by ID
**GET** `/api/v1/universities/:id`

**Access:** Public

**Parameters:**
- `id` (string, required) - University UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "0274b401-c9f8-4f1f-b851-c7dc9e9877c3",
    "name": "Addis Ababa Institute of Technology University",
    "slug": "addis-ababa-institute-technology",
    "shortName": "AAiT",
    "isActive": true,
    "profile": {
      "id": "uni-profile-1",
      "user_id": "university-1",
      "college_name": "Addis Ababa Institute of Technology",
      "short_name": "AAiT",
      "slug": "addis-ababa-institute-technology",
      "description": "Leading technological university in Ethiopia...",
      "website": "https://www.aait.edu.et",
      "established_year": 1950,
      "university_type": "Public",
      "address": {
        "city": "Addis Ababa",
        "region": "Addis Ababa",
        "country": "Ethiopia",
        "address1": "King George VI Street",
        "address2": "Arat Kilo Campus",
        "postcode": "1000"
      },
      "contact": {
        "email": "admin@aait.edu.et",
        "phone1": "+251115517430",
        "phone2": "+251115518964"
      },
      "location": {
        "latitude": 9.0192,
        "longitude": 38.7525
      },
      "field_of_studies": "Engineering and Technology",
      "campus_image": "https://res.cloudinary.com/din14zew0/image/upload/v1750256230/AAiT_xjjnmb.jpg",
      "accreditation": ["Ministry of Education", "Engineering Accreditation Board"],
      "rankings": {
        "rating": 5,
        "national_rank": 1,
        "international_rank": 500
      },
      "facilities": ["Library", "Laboratory", "Sports Complex", "Dormitory", "Cafeteria", "Research Centers"],
      "campus_size": "150 hectares",
      "student_to_faculty_ratio": "15:1",
      "total_students": 25000,
      "total_applicants": 45000,
      "acceptance_rate": 55,
      "is_verified": true,
      "verification_documents": [],
      "is_active": true,
      "created_at": "2023-12-01T00:00:00.000Z",
      "updated_at": "2024-01-18T15:30:00.000Z"
    },
    "programs": [
      {
        "id": "2",
        "university_id": "0274b401-c9f8-4f1f-b851-c7dc9e9877c3",
        "name": "Electrical Engineering",
        "type": "Engineering",
        "duration": "4 years",
        "degree": "Bachelor",
        "description": "Focus on electrical systems, power generation, and electronics.",
        "requirements": ["Mathematics", "Physics", "Chemistry"],
        "tuition_fee": 14000,
        "application_fee": 500,
        "available_seats": 100,
        "application_deadline": "2024-08-15T00:00:00.000Z",
        "is_active": true,
        "created_at": "2025-06-18T12:46:31.345Z",
        "updated_at": "2025-06-18T12:46:31.345Z",
        "_count": {
          "applications": 1
        },
        "applicationCount": 1
      }
    ],
    "stats": {
      "totalPrograms": 4,
      "totalApplications": 2
    }
  },
  "meta": {
    "timestamp": "2025-06-18T20:58:16.222Z"
  }
}
```

### 3. Get University by Slug
**GET** `/api/v1/universities/slug/:slug`

**Access:** Public

**Parameters:**
- `slug` (string, required) - University slug (e.g., "stanford-university")

**Response:** Same as Get University by ID

### 4. Create University
**POST** `/api/v1/universities`

**Access:** Requires `university` role

**Request Body:**
```json
{
  "name": "Stanford University",
  "shortName": "Stanford", // or "short_name"
  "slug": "stanford-university",
  "isActive": true, // or "is_active", optional (default: true)
  "profile": {
    "collegeName": "Stanford University", // or "college_name"
    "shortName": "Stanford", // or "short_name"
    "description": "A leading research university...",
    "website": "https://stanford.edu",
    "establishedYear": 1885, // or "established_year"
    "universityType": "Private", // or "university_type" - "Private" or "PRIVATE"
    "address": {
      "street": "450 Serra Mall",
      "city": "Stanford",
      "state": "CA",
      "zipCode": "94305",
      "country": "USA"
    },
    "contact": {
      "phone": "+1-650-723-2300",
      "email": "admissions@stanford.edu"
    },
    "location": "Stanford, California",
    "fieldOfStudies": "Engineering, Medicine, Business...", // or "field_of_studies"
    "campusImage": "https://example.com/campus.jpg", // or "campus_image"
    "accreditation": ["WASC", "AACSB"],
    "rankings": {
      "usnews": 6,
      "qs": 3,
      "times": 4
    },
    "facilities": ["Library", "Sports Complex", "Research Labs"],
    "campusSize": "8,180 acres", // or "campus_size"
    "studentToFacultyRatio": "5:1", // or "student_to_faculty_ratio"
    "totalStudents": 17000, // or "total_students"
    "totalApplicants": 47000, // or "total_applicants"
    "acceptanceRate": 4.3, // or "acceptance_rate"
    "verificationDocuments": [] // or "verification_documents"
  }
}
```

**Response:** Returns created university object with 201 status.

**Important Notes:**
- `universityType` accepts both "Private"/"Public" and "PRIVATE"/"PUBLIC"
- All profile fields are optional except those specified as required
- The API automatically maps between camelCase and snake_case

### 5. Update University
**PUT** `/api/v1/universities/:id`

**Access:** Requires ownership of the university

**Parameters:**
- `id` (string, required) - University UUID

**Request Body:** Same structure as Create University, but all fields are optional.

**Response:** Returns updated university object.

### 6. Delete University
**DELETE** `/api/v1/universities/:id`

**Access:** Requires `admin` role

**Parameters:**
- `id` (string, required) - University UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "University deleted successfully"
  }
}
```

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
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error
- `501` - Not Implemented (for placeholder endpoints)

### Common Error Scenarios
1. **University not found**: Returns 404 with error message
2. **Validation errors**: Returns 422 with detailed validation information
3. **Unauthorized access**: Returns 401 for missing token, 403 for insufficient permissions
4. **Duplicate slug/name**: Returns 400 with conflict information

## Query Parameters

### Search Functionality
- The `search` parameter searches in:
  - University name (case-insensitive)
  - Profile description (case-insensitive)

### Filtering
- `type`: Filter by "Public" or "Private"
- `verified`: Filter by verification status (true/false)
- `active`: Filter by active status (true/false)

### Sorting
- `sortBy`: "name" or "created_at"
- `sortOrder`: "asc" or "desc"

### Pagination
- `page`: Page number (minimum 1)
- `limit`: Items per page (minimum 1, maximum 100)

## Field Validation

### Required Fields for Creation
- `name`: Non-empty string
- `shortName` or `short_name`: Non-empty string
- `slug`: Non-empty string, URL-friendly
- `profile`: Object with at least basic information

### University Type Validation
- Accepts: "Public", "Private", "PUBLIC", "PRIVATE"
- Stored as: "Public" or "Private"

### Slug Requirements
- Must be URL-friendly (lowercase, hyphens for spaces)
- Must be unique across all universities
- Recommended format: "university-name"

## Best Practices for Frontend Integration

1. **Field Naming**: Use camelCase in your frontend; the API handles conversion automatically.

2. **Error Handling**: Always check the `success` field in responses and handle errors appropriately.

3. **Pagination**: Implement pagination for the list endpoint to handle large datasets.

4. **Search Debouncing**: Implement search debouncing to avoid excessive API calls.

5. **Caching**: Consider caching university data that doesn't change frequently.

6. **Validation**: Validate university type values before sending to ensure they match accepted values.

7. **Slug Generation**: When creating universities, generate URL-friendly slugs from university names.

## Not Yet Implemented Endpoints

The following endpoints return 501 (Not Implemented) status:
- Advanced search (`/search`)
- University verification (`/:id/verify`)
- University deactivation (`/:id/deactivate`)
- Program management (`/:id/programs/*`)
- Image management (`/:id/images/*`)
- Bulk operations (`/bulk-verify`)
- Data export (`/export`)

These endpoints are planned for future implementation and will be documented when available.