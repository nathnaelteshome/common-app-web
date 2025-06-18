# Application API Integration Guide

This guide provides comprehensive documentation for integrating with the Application API endpoints. All endpoints are under the base path `/api/v1/applications` and require authentication.

## Table of Contents
- [Authentication & Authorization](#authentication--authorization)
- [Application Statuses](#application-statuses)
- [Field Name Mapping](#field-name-mapping)
- [Endpoints](#endpoints)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Role-Based Access Control](#role-based-access-control)
- [Field Validation](#field-validation)

## Authentication & Authorization

**All endpoints require JWT authentication** with the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access
- **Student**: Can create, view own applications, update own applications, submit applications
- **University Admin**: Can view applications to their universities, update application status
- **System Admin**: Can view all applications, perform administrative operations

## Application Statuses

Applications can have the following statuses:
- `draft` - Application created but not submitted
- `submitted` - Application submitted by student
- `under_review` - Application being reviewed by university
- `accepted` - Application accepted
- `rejected` - Application rejected
- `waitlisted` - Application waitlisted
- `withdrawn` - Application withdrawn by student

## Field Name Mapping

The API supports both camelCase (frontend) and snake_case (database) field naming.

### Application Fields
| Frontend (camelCase) | Database (snake_case) | Type | Description |
|---------------------|----------------------|------|-------------|
| `id` | `id` | string | Application UUID |
| `status` | `status` | enum | Application status |
| `submittedAt` | `submitted_at` | datetime | Submission timestamp |
| `universityId` | `university_id` | string | University UUID |
| `programId` | `program_id` | string | Program UUID |
| `studentId` | `student_id` | string | Student UUID |
| `personalStatement` | `personal_statement` | string | Personal statement text |
| `academicHistory` | `academic_history` | object | Academic background |
| `personalInfo` | `personal_info` | object | Personal information |
| `academicInfo` | `academic_info` | object | Academic information |
| `essays` | `essays` | object | Essay responses |
| `documents` | `documents` | object | Supporting documents |
| `applicationFee` | `application_fee` | number | Application fee amount |
| `deadline` | `deadline` | datetime | Application deadline |

## Endpoints

### 1. List Applications
**GET** `/api/v1/applications`

**Access:** All authenticated users (filtered by role)

**Query Parameters:**
- `page` (integer, default: 1) - Page number
- `limit` (integer, default: 20, max: 100) - Items per page
- `status` (enum) - Filter by application status
- `universityId` (string) - Filter by university (Admin only)
- `programId` (string) - Filter by program
- `studentId` (string) - Filter by student (Admin only)
- `sortBy` (string, default: "submittedAt") - Sort field
- `sortOrder` (enum: "asc", "desc", default: "desc") - Sort direction

**Role-Based Filtering:**
- **Students**: Only see their own applications
- **University Admins**: Only see applications to their universities
- **System Admins**: See all applications (can use all filters)

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "status": "submitted",
        "submittedAt": "2024-01-15T10:30:00Z",
        "program": {
          "id": "uuid",
          "name": "Computer Science",
          "university": {
            "id": "uuid",
            "name": "Stanford University"
          }
        },
        "hasPayment": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Create Application
**POST** `/api/v1/applications`

**Access:** Students only

**Request Body:**
```json
{
  "universityId": "uuid", // or "university_id"
  "programId": "uuid", // or "program_id"
  "personalStatement": "My personal statement...", // or "personal_statement"
  "academicHistory": { // or "academic_history" or "academic_info"
    "gpa": 3.8,
    "transcripts": [],
    "testScores": {
      "sat": 1500,
      "act": 34
    }
  },
  "personalInfo": { // or "personal_info"
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "essays": {
    "essay1": "Why I want to study here...",
    "essay2": "My greatest achievement..."
  },
  "applicationFee": 75, // or "application_fee"
  "deadline": "2024-12-01T23:59:59Z"
}
```

**Validation:**
- `universityId` and `programId` are required
- Program must belong to the specified university
- Student cannot have duplicate applications for the same program
- Default deadline is 30 days from creation if not specified

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "draft",
    "student_id": "uuid",
    "program_id": "uuid",
    "university_id": "uuid",
    "personal_statement": "My personal statement...",
    "academic_history": { /* academic data */ },
    "documents": {},
    "application_fee": 75,
    "deadline": "2024-12-01T23:59:59Z",
    "created_at": "2024-01-15T10:30:00Z",
    "program": {
      "id": "uuid",
      "name": "Computer Science",
      "university": { /* university data */ }
    }
  }
}
```

### 3. Get Application by ID
**GET** `/api/v1/applications/:id`

**Access:** Application owner (student) or authorized university/admin users

**Parameters:**
- `id` (string, required) - Application UUID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "submitted",
    "submitted_at": "2024-01-15T10:30:00Z",
    "personal_statement": "My personal statement...",
    "academic_history": { /* academic data */ },
    "documents": { /* document data */ },
    "student": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "studentProfile": { /* student profile data */ }
    },
    "program": {
      "id": "uuid",
      "name": "Computer Science",
      "university": { /* university data */ }
    },
    "payment": { /* payment data if exists */ }
  }
}
```

### 4. Update Application
**PUT** `/api/v1/applications/:id`

**Access:** Application owner (student) or authorized users

**Parameters:**
- `id` (string, required) - Application UUID

**Request Body:** Any application fields to update (same structure as create)

**Note:** Students can only update their own applications. The API performs permission checks automatically.

**Response:** Returns updated application object.

### 5. Submit Application
**POST** `/api/v1/applications/:id/submit`

**Access:** Students only (application owner)

**Parameters:**
- `id` (string, required) - Application UUID

**Validation:**
- Application must be in "draft" status
- Only the application owner can submit
- Sets status to "submitted" and records submission timestamp

**Side Effects:**
- Creates a notification for the student
- Updates `submitted_at` timestamp
- Changes status from "draft" to "submitted"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "submitted",
    "submitted_at": "2024-01-15T10:30:00Z",
    "program": {
      "id": "uuid",
      "name": "Computer Science",
      "university": { /* university data */ }
    }
    /* ... other application fields */
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
- `400` - Bad Request (validation errors, already submitted)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (access denied)
- `404` - Not Found (application/program not found)
- `409` - Conflict (duplicate application)
- `422` - Validation Error
- `500` - Internal Server Error
- `501` - Not Implemented (for placeholder endpoints)

### Common Error Scenarios

1. **Application not found**: Returns 404
   ```json
   {
     "success": false,
     "error": "Application not found"
   }
   ```

2. **Access denied**: Returns 403
   ```json
   {
     "success": false,
     "error": "Access denied"
   }
   ```

3. **Duplicate application**: Returns 409
   ```json
   {
     "success": false,
     "error": "Application already exists for this program"
   }
   ```

4. **Already submitted**: Returns 400
   ```json
   {
     "success": false,
     "error": "Application has already been submitted"
   }
   ```

5. **Program not found**: Returns 404
   ```json
   {
     "success": false,
     "error": "Program not found"
   }
   ```

## Role-Based Access Control

### Student Role
- **Can do:**
  - Create applications for any program
  - View their own applications
  - Update their own draft applications
  - Submit their own applications
- **Cannot do:**
  - View other students' applications
  - Update submitted applications (restriction may vary)
  - Change application status

### University Admin Role
- **Can do:**
  - View applications to their universities
  - Update application status (when implemented)
  - Access university-specific application data
- **Cannot do:**
  - View applications to other universities
  - Create applications
  - Access student-only operations

### System Admin Role
- **Can do:**
  - View all applications
  - Use all query filters
  - Perform administrative operations
  - Access export and bulk operations (when implemented)

## Field Validation

### Required Fields for Creation
- `universityId` or `university_id` - Must be valid university UUID
- `programId` or `program_id` - Must be valid program UUID belonging to the university

### Optional Fields
- `personalStatement` - String (personal statement text)
- `academicHistory`/`academicInfo` - Object (academic background)
- `personalInfo` - Object (personal information)
- `essays` - Object (essay responses)
- `applicationFee` - Number (defaults to 0)
- `deadline` - ISO date string (defaults to 30 days from creation)

### Business Rules
1. **No Duplicates**: One application per student per program
2. **Program Validation**: Program must belong to specified university
3. **Status Flow**: Applications start as "draft" and can only be submitted once
4. **Ownership**: Students can only access their own applications

## Best Practices for Frontend Integration

1. **Field Naming**: Use camelCase in frontend; API handles conversion automatically.

2. **Error Handling**: Always check `success` field and handle different error codes appropriately.

3. **Status Management**: 
   - Track application status to show appropriate UI
   - Disable editing for submitted applications
   - Show submission confirmation

4. **Pagination**: Implement pagination for application lists to handle large datasets.

5. **Real-time Updates**: Consider implementing real-time status updates for applications.

6. **Draft Saving**: Implement auto-save for draft applications to prevent data loss.

7. **Validation**: Validate required fields client-side before submission.

8. **Permission Handling**: Adapt UI based on user role and application ownership.

## Not Yet Implemented Endpoints

The following endpoints return 501 (Not Implemented) status:

- **DELETE** `/api/v1/applications/:id` - Delete application
- **PUT** `/api/v1/applications/:id/status` - Update application status
- **POST** `/api/v1/applications/:id/withdraw` - Withdraw application
- **POST** `/api/v1/applications/:id/duplicate` - Duplicate application
- **POST** `/api/v1/applications/:id/documents` - Upload documents
- **DELETE** `/api/v1/applications/:id/documents/:docId` - Delete document
- **GET** `/api/v1/applications/student/:studentId` - Get student applications
- **GET** `/api/v1/applications/university/:universityId` - Get university applications
- **PUT** `/api/v1/applications/bulk-update` - Bulk update applications
- **GET** `/api/v1/applications/export` - Export applications

These endpoints are planned for future implementation and will be documented when available.

## Example Integration Workflow

### Creating an Application
1. User selects university and program
2. Frontend validates selection
3. POST to `/api/v1/applications` with required data
4. Handle response and redirect to application form
5. User fills out application (multiple updates to draft)
6. User reviews and submits via POST to `/api/v1/applications/:id/submit`
7. Show confirmation and updated status

### Viewing Applications
1. GET `/api/v1/applications` with appropriate filters
2. Display paginated list with status indicators
3. Allow clicking to view details via GET `/api/v1/applications/:id`
4. Update UI based on user role and permissions