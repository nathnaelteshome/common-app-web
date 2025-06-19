# CommonApply Backend API Integration Documentation

## Overview

This document provides comprehensive documentation for all API endpoints implemented in the CommonApply Backend system, specifically addressing the frontend integration requirements outlined in `todo_integration.md`.

## Base URL
```
Production: https://api.commonapply.com/api/v1
Development: http://localhost:3000/api/v1
```

## Authentication

All protected endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

## Response Format

All API responses follow this consistent format:
```json
{
  "success": boolean,
  "data": object | array,
  "error": string | null,
  "timestamp": string
}
```

---

## 🎯 Student Application Flow

### Complete Application Process Overview

The CommonApply system provides a comprehensive student application management flow with the following key stages:

1. **Discovery & Search** - Browse universities and programs
2. **Application Creation** - Create draft applications with personal information
3. **Form Completion** - Fill university-specific admission forms
4. **Document Upload** - Submit supporting documents
5. **Payment Processing** - Pay application fees
6. **Status Tracking** - Monitor application progress
7. **Communication** - Receive notifications and updates

### Application Status Workflow

```
draft → submitted → under_review → interview_scheduled → accepted/rejected/waitlisted
```

**Status Descriptions:**
- **`draft`** - Application created but not submitted (editable)
- **`submitted`** - Student has submitted application (read-only)
- **`under_review`** - University reviewing application
- **`interview_scheduled`** - Interview arranged (if required)
- **`accepted`** - Application approved
- **`rejected`** - Application denied
- **`waitlisted`** - Application on waiting list

---

## 🎯 Core Application APIs (Frontend Integration Ready)

### Applications API

#### List Applications
**Endpoint:** `GET /applications`
**Authentication:** Required
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by application status
- `university` (string): Filter by university ID
- `program` (string): Filter by program ID
- `search` (string): Search in personal statements
- `sortBy` (string): Sort field (default: 'created_at')
- `sortOrder` (string): Sort order ('asc' or 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "studentId": "uuid",
        "universityId": "uuid",
        "programId": "uuid",
        "status": "submitted",
        "personalStatement": "I am passionate about...",
        "academicHistory": [
          {
            "institution": "High School Name",
            "degree": "High School Diploma",
            "gpa": 3.8,
            "graduationYear": 2024
          }
        ],
        "documents": {
          "transcript": true,
          "recommendation": true,
          "essay": true,
          "portfolio": false
        },
        "paymentStatus": "completed",
        "applicationFee": 500,
        "submittedAt": "2024-01-15T10:00:00Z",
        "reviewedAt": null,
        "reviewedBy": null,
        "score": null,
        "priority": "medium",
        "eligibilityScore": 85,
        "autoFilterResult": "eligible",
        "tags": ["high-achiever", "stem-background"],
        "formData": {
          "gpa": 3.8,
          "testScore": 1450,
          "extracurriculars": ["Programming Club"]
        },
        "progress": 85,
        "deadline": "2024-03-01T23:59:59Z",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-20T14:30:00Z",
        "university": {
          "id": "uuid",
          "name": "MIT",
          "shortName": "MIT"
        },
        "program": {
          "id": "uuid",
          "name": "Computer Science",
          "type": "Engineering",
          "degree": "Bachelor",
          "tuitionFee": 25000,
          "applicationFee": 500
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Create Application
**Endpoint:** `POST /applications`
**Authentication:** Required (Student role)
**Request Body:**
```json
{
  "universityId": "uuid",
  "programId": "uuid",
  "personalStatement": "My passion for computer science stems from...",
  "academicHistory": [
    {
      "institution": "Addis Ababa Preparatory School",
      "degree": "High School Diploma",
      "fieldOfStudy": "General",
      "gpa": 3.8,
      "startDate": "2016-09-01",
      "endDate": "2018-06-01",
      "isCompleted": true
    }
  ],
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@email.com",
    "phone": "+251911123456"
  },
  "essays": {
    "whyThisProgram": "I chose this program because...",
    "careerGoals": "My career goals include..."
  },
  "deadline": "2024-12-01T23:59:59Z"
}
```

**Business Rules:**
- One application per student per program
- Program must belong to specified university
- Applications start in `draft` status
- Default deadline is 30 days if not specified

#### Get Application by ID
**Endpoint:** `GET /applications/{id}`
**Authentication:** Required

#### Update Application
**Endpoint:** `PUT /applications/{id}`
**Authentication:** Required (Students can only update their own applications in `draft` status)
**Request Body:** Same as create application (partial updates supported)

#### Submit Application
**Endpoint:** `POST /applications/{id}/submit`
**Authentication:** Required (Student role)
**Description:** Changes application status from `draft` to `submitted`

**Submission Requirements:**
- Application must be in `draft` status
- Personal statement must be provided
- Academic history must be provided
- Must be before deadline

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Application submitted successfully",
    "applicationId": "uuid",
    "submittedAt": "2024-01-15T10:00:00Z",
    "status": "submitted"
  }
}
```

#### Delete Application
**Endpoint:** `DELETE /applications/{id}`
**Authentication:** Required (Students can only delete their own applications in `draft` status)

**Frontend Integration:**
- Replaces `mockApplications` in student dashboard
- Implements complete CRUD operations
- Real-time status updates
- Progress tracking functionality

---

## 🎯 Priority APIs (Frontend Integration Ready)

### Program Types API

#### Get Program Types
**Endpoint:** `GET /programs/types`
**Description:** Get distinct program types for enhanced search filtering
**Authentication:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "programTypes": [
      "Computer Science",
      "Engineering",
      "Business Administration",
      "Medicine",
      "Law"
    ],
    "count": 5
  }
}
```

**Frontend Integration:**
- Replaces static `programTypes` import in `components/enhanced-search.tsx`
- Use for dropdown population in search filters

---

### Student Announcements API

#### Get Student Announcements
**Endpoint:** `GET /announcements/student/announcements`
**Authentication:** Required (Student role)
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `type` (string): Filter by announcement type
- `priority` (string): Filter by priority level
- `search` (string): Search in title/content

**Response:**
```json
{
  "success": true,
  "data": {
    "announcements": [
      {
        "id": "uuid",
        "title": "Application Deadline Extended",
        "content": "The application deadline has been extended...",
        "type": "deadline",
        "priority": "high",
        "targetAudience": "students",
        "sender": "University Name",
        "createdAt": "2024-01-15T10:00:00Z",
        "publishedAt": "2024-01-15T10:00:00Z",
        "expiresAt": "2024-02-15T23:59:59Z",
        "isRead": false,
        "actionRequired": true,
        "attachments": null,
        "university": {
          "id": "uuid",
          "name": "University Name",
          "slug": "university-slug"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Mark Announcement as Read
**Endpoint:** `PUT /announcements/student/announcements/{id}/mark-read`
**Authentication:** Required (Student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Announcement marked as read",
    "announcementId": "uuid"
  }
}
```

#### Mark All Announcements as Read
**Endpoint:** `PUT /announcements/student/announcements/mark-all-read`
**Authentication:** Required (Student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "All announcements marked as read"
  }
}
```

**Frontend Integration:**
- Replaces `mockAnnouncements` in `app/student/announcements/page.tsx`
- Implement real-time read/unread status
- Add search and filtering functionality

---

### University Comparison API

#### Get Student Comparisons
**Endpoint:** `GET /comparisons/student/comparisons`
**Authentication:** Required (Student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "comparisons": [
      {
        "id": "uuid",
        "universityId": "uuid",
        "addedAt": "2024-01-15T10:00:00Z",
        "notes": "Interested in their CS program",
        "university": {
          "id": "uuid",
          "name": "MIT",
          "slug": "mit",
          "shortName": "MIT",
          "isActive": true,
          "profile": {
            "university_type": "Private",
            "established_year": 1861,
            "address": {...},
            "acceptance_rate": 0.07
          },
          "programs": [...],
          "stats": {
            "totalPrograms": 45,
            "totalApplications": 1200
          }
        }
      }
    ],
    "count": 3
  }
}
```

#### Add University to Comparison
**Endpoint:** `POST /comparisons/student/comparisons`
**Authentication:** Required (Student role)

**Request Body:**
```json
{
  "universityId": "uuid",
  "notes": "Optional notes about this university"
}
```

#### Remove University from Comparison
**Endpoint:** `DELETE /comparisons/student/comparisons/{universityId}`
**Authentication:** Required (Student role)

#### Clear All Comparisons
**Endpoint:** `DELETE /comparisons/student/comparisons`
**Authentication:** Required (Student role)

#### Get Detailed Comparison
**Endpoint:** `GET /comparisons/student/comparisons/detailed`
**Authentication:** Required (Student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "comparisons": [...],
    "comparisonTable": {
      "basic": {
        "name": ["MIT", "Stanford", "Harvard"],
        "type": ["Private", "Private", "Private"],
        "established": [1861, 1885, 1636],
        "location": ["Cambridge, MA", "Stanford, CA", "Cambridge, MA"]
      },
      "academics": {
        "totalPrograms": [45, 52, 48],
        "fieldOfStudies": ["Engineering & Technology", "Engineering & Technology", "Liberal Arts"],
        "accreditation": ["NECHE", "WASC", "NECHE"]
      },
      "stats": {
        "totalStudents": [11520, 17249, 22947],
        "acceptanceRate": ["7.0%", "4.8%", "5.2%"],
        "studentFacultyRatio": ["3:1", "5:1", "6:1"]
      },
      "programs": [...]
    },
    "count": 3
  }
}
```

**Frontend Integration:**
- Replaces `mockComparisons` in `app/student/compare/page.tsx`
- Implements add/remove functionality
- Creates dynamic comparison table

---

### Notifications API

#### Get Notifications
**Endpoint:** `GET /notifications`
**Authentication:** Required
**Query Parameters:**
- `page`, `limit`, `type`, `read`, `priority`, `urgent`

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "application",
        "title": "Application Status Update",
        "message": "Your application has been reviewed",
        "priority": "medium",
        "isRead": false,
        "isUrgent": false,
        "actionUrl": "/student/applications/uuid",
        "applicationId": "uuid",
        "expiresAt": null,
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {...},
    "unreadCount": 5
  }
}
```

#### Mark Notification as Read
**Endpoint:** `PUT /notifications/{id}/mark-read`
**Authentication:** Required

#### Mark All Notifications as Read
**Endpoint:** `PUT /notifications/mark-all-read`
**Authentication:** Required

#### Get Unread Count
**Endpoint:** `GET /notifications/unread-count`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

**Frontend Integration:**
- Replaces `mockNotifications` usage across the app
- Real-time notification badge updates
- Implements mark as read functionality

---

### Payments API

#### Get Payments
**Endpoint:** `GET /payments`
**Authentication:** Required
**Query Parameters:**
- `page`, `limit`, `status`, `method`, `search`, `universityId`, `applicationId`

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "id": "uuid",
        "applicationId": "uuid",
        "amount": 500.00,
        "currency": "USD",
        "method": "credit_card",
        "status": "completed",
        "transactionId": "txn_1234567890",
        "gateway": "stripe",
        "gatewayResponse": {
          "status": "succeeded",
          "paymentMethod": "card_1234"
        },
        "fees": 25.00,
        "receiptUrl": "https://receipts.commonapply.com/uuid.pdf",
        "refundReason": null,
        "processedAt": "2024-01-15T10:00:00Z",
        "createdAt": "2024-01-15T09:30:00Z",
        "student": {
          "id": "uuid",
          "email": "student@test.com",
          "profile": {
            "firstName": "John",
            "lastName": "Doe"
          }
        },
        "university": {
          "id": "uuid",
          "name": "MIT",
          "shortName": "MIT"
        },
        "application": {
          "id": "uuid",
          "status": "submitted",
          "program": {
            "name": "Computer Science",
            "degree": "Bachelor"
          }
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "summary": {
      "totalAmount": 7500.00,
      "completedPayments": 14,
      "pendingPayments": 1,
      "failedPayments": 0
    }
  }
}
```

#### Create Payment
**Endpoint:** `POST /payments`
**Authentication:** Required (Student role)
**Request Body:**
```json
{
  "applicationId": "uuid",
  "amount": 500.00,
  "currency": "USD",
  "method": "credit_card",
  "gateway": "stripe",
  "paymentDetails": {
    "cardToken": "tok_1234567890",
    "saveCard": false
  }
}
```

**Payment Methods Supported:**
- `credit_card` - Credit/debit card payments
- `bank_transfer` - Bank transfer payments
- `mobile_money` - Mobile money payments

**Payment Status Flow:**
```
pending → processing → completed/failed/refunded
```

#### Get Payment by ID
**Endpoint:** `GET /payments/{id}`
**Authentication:** Required

#### Retry Failed Payment
**Endpoint:** `POST /payments/{id}/retry`
**Authentication:** Required (Student role)
**Description:** Retry a failed payment with the same details

#### Request Refund
**Endpoint:** `POST /payments/{id}/refund`
**Authentication:** Required (Student role)
**Request Body:**
```json
{
  "reason": "Application withdrawn",
  "amount": 500.00
}
```

#### Download Receipt
**Endpoint:** `GET /payments/{id}/receipt`
**Authentication:** Required
**Response:** PDF file download or receipt data

**Response (JSON format):**
```json
{
  "success": true,
  "data": {
    "receiptData": {
      "paymentId": "uuid",
      "transactionId": "txn_1234567890",
      "amount": 500.00,
      "currency": "USD",
      "method": "credit_card",
      "fees": 25.00,
      "processedAt": "2024-01-15T10:00:00Z",
      "studentName": "John Doe",
      "studentEmail": "john.doe@email.com",
      "universityName": "MIT",
      "programName": "Computer Science",
      "applicationId": "uuid"
    },
    "receiptUrl": "https://receipts.commonapply.com/uuid.pdf"
  }
}
```

**Frontend Integration:**
- Replaces `mockPayments` in payment-related pages
- Implements complete payment flow (create, retry, refund)
- Receipt download and viewing capability
- Payment status tracking and updates
- Integration with application submission flow

---

---

## 🔧 Supporting APIs Available

### Programs API

#### List Programs
**Endpoint:** `GET /programs`
**Authentication:** None required
**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search in program names and descriptions
- `type` (string): Filter by program type
- `universityId` (string): Filter by university
- `degree` (string): Filter by degree level
- `active` (boolean): Filter by active programs only
- `tuitionMin` (number): Minimum tuition fee
- `tuitionMax` (number): Maximum tuition fee
- `deadline` (string): Programs with deadlines after this date
- `sortBy` (string): Sort field (default: 'name')
- `sortOrder` (string): Sort order ('asc' or 'desc')

**Response:**
```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "id": "uuid",
        "universityId": "uuid",
        "name": "Computer Science and Engineering",
        "type": "Engineering",
        "duration": "4 years",
        "degree": "Bachelor",
        "description": "Comprehensive program covering software development...",
        "requirements": ["Mathematics", "Physics", "English"],
        "tuitionFee": 15000,
        "applicationFee": 500,
        "availableSeats": 120,
        "applicationDeadline": "2024-08-15T23:59:59Z",
        "isActive": true,
        "university": {
          "id": "uuid",
          "name": "MIT",
          "shortName": "MIT",
          "profile": {
            "universityType": "Private",
            "location": {...}
          }
        },
        "eligibilityCriteria": {
          "minimumGPA": 3.0,
          "requiredTests": ["SAT"],
          "minimumScore": 70
        },
        "stats": {
          "totalApplications": 1250,
          "acceptanceRate": 45
        }
      }
    ],
    "pagination": {...},
    "filters": {
      "availableTypes": ["Engineering", "Business", "Medicine"],
      "availableDegrees": ["Bachelor", "Master", "PhD"],
      "tuitionRange": { "min": 5000, "max": 50000 }
    }
  }
}
```

#### Get Program by ID
**Endpoint:** `GET /programs/{id}`
**Authentication:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "program": {
      "id": "uuid",
      "name": "Computer Science and Engineering",
      "type": "Engineering",
      "duration": "4 years",
      "degree": "Bachelor",
      "description": "Comprehensive program...",
      "requirements": ["Mathematics", "Physics"],
      "tuitionFee": 15000,
      "applicationFee": 500,
      "availableSeats": 120,
      "applicationDeadline": "2024-08-15T23:59:59Z",
      "university": {...},
      "eligibilityCriteria": {...},
      "admissionForms": [...],
      "relatedPrograms": [...]
    }
  }
}
```

### Universities API

#### List Universities
**Endpoint:** `GET /universities`
**Authentication:** None required
**Query Parameters:**
- `page`, `limit`, `search`, `type`, `location`, `established`, `active`, `verified`, `sortBy`, `sortOrder`

#### Get University by ID
**Endpoint:** `GET /universities/{id}`
**Authentication:** None required

#### Get University Programs
**Endpoint:** `GET /universities/{id}/programs`
**Authentication:** None required
**Query Parameters:** Same as programs list API

#### Get University Statistics
**Endpoint:** `GET /universities/{id}/stats`
**Authentication:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalPrograms": 45,
      "totalStudents": 25000,
      "totalApplications": 1250,
      "acceptanceRate": 55.5,
      "graduationRate": 88.2,
      "employmentRate": 92.1,
      "averageSalary": 75000,
      "internationalStudents": 15.3
    }
  }
}
```

### Application Documents API

#### Upload Document
**Endpoint:** `POST /applications/{applicationId}/documents`
**Authentication:** Required (Student role)
**Content-Type:** `multipart/form-data`
**Request Body:**
```
file: [PDF/Image file]
type: transcript|recommendation|essay|portfolio|other
name: Document display name
```

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "uuid",
      "applicationId": "uuid",
      "name": "High_School_Transcript.pdf",
      "type": "transcript",
      "fileUrl": "/documents/student-1/transcript.pdf",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "status": "pending",
      "reviewNotes": null,
      "uploadedAt": "2024-01-15T10:30:00Z",
      "reviewedAt": null,
      "reviewedBy": null
    }
  }
}
```

#### Get Application Documents
**Endpoint:** `GET /applications/{applicationId}/documents`
**Authentication:** Required

#### Delete Document
**Endpoint:** `DELETE /applications/{applicationId}/documents/{documentId}`
**Authentication:** Required (Student role, only for pending documents)

#### Download Document
**Endpoint:** `GET /applications/{applicationId}/documents/{documentId}/download`
**Authentication:** Required
**Response:** File download

**Document Status Workflow:**
```
pending → verified/rejected
```

**Document Types:**
- `academic` - Academic transcripts
- `essay` - Personal statements and essays
- `recommendation` - Letters of recommendation
- `portfolio` - Portfolio files
- `transcript` - Official transcripts
- `other` - Other supporting documents

---

### Admission Forms API

#### Get University Admission Forms
**Endpoint:** `GET /universities/{universityId}/admission-forms`
**Authentication:** Required
**Query Parameters:**
- `programId` (string): Filter by specific program
- `active` (boolean): Filter by active forms only

**Response:**
```json
{
  "success": true,
  "data": {
    "forms": [
      {
        "id": "uuid",
        "universityId": "uuid",
        "programId": "uuid",
        "name": "Computer Science Application Form",
        "description": "Standard application form for CS program",
        "type": "application",
        "status": "published",
        "isActive": true,
        "submissions": 245,
        "completionRate": 82.5,
        "settings": {
          "allowSave": true,
          "requirePayment": true,
          "applicationFee": 500,
          "deadline": "2024-08-15T23:59:59Z",
          "maxApplications": 1
        },
        "fields": [
          {
            "id": "uuid",
            "type": "text",
            "label": "Full Name",
            "placeholder": "Enter your full legal name",
            "required": true,
            "validation": null,
            "helpText": "As it appears on official documents",
            "orderIndex": 1
          }
        ]
      }
    ]
  }
}
```

#### Submit Form Response
**Endpoint:** `POST /form-submissions`
**Authentication:** Required (Student role)
**Request Body:**
```json
{
  "formId": "uuid",
  "applicationId": "uuid",
  "responses": {
    "personalInfo": "John Doe",
    "academicAchievements": "Dean's List for 3 semesters",
    "extracurriculars": ["Programming Club", "Volunteer Work"]
  },
  "status": "submitted"
}
```

#### Get Form Submissions
**Endpoint:** `GET /form-submissions`
**Authentication:** Required
**Query Parameters:**
- `formId`, `applicationId`, `status`

---

### Eligibility Criteria API

#### Get Program Eligibility
**Endpoint:** `GET /programs/{programId}/eligibility`
**Authentication:** None required

**Response:**
```json
{
  "success": true,
  "data": {
    "criteria": {
      "id": "uuid",
      "programId": "uuid",
      "name": "Computer Science Eligibility",
      "description": "Standard eligibility criteria",
      "rules": [
        {
          "field": "gpa",
          "operator": "greater_than",
          "value": 3.0,
          "weight": 40,
          "required": true
        }
      ],
      "minimumScore": 70,
      "isActive": true
    }
  }
}
```

#### Check Application Eligibility
**Endpoint:** `POST /applications/{applicationId}/check-eligibility`
**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "eligibilityScore": 85,
    "result": "eligible",
    "breakdown": {
      "gpa": { "required": 3.0, "actual": 3.8, "points": 40, "passed": true },
      "testScore": { "required": 1200, "actual": 1450, "points": 35, "passed": true }
    }
  }
}
```

### Blog API

#### List Blog Posts
**Endpoint:** `GET /blog/posts`
**Authentication:** None required
**Query Parameters:**
- `page`, `limit`, `search`, `category`, `tags`, `featured`, `author`, `sortBy`, `sortOrder`

#### Get Blog Post by Slug
**Endpoint:** `GET /blog/posts/{slug}`
**Authentication:** None required

#### Get Blog Categories
**Endpoint:** `GET /blog/categories`
**Authentication:** None required

#### Search Blog Posts
**Endpoint:** `GET /blog/search`
**Authentication:** None required
**Query Parameters:**
- `q` (string): Search query
- `category`, `tags`, `limit`

---

---

## 🚧 Future Implementation (Low Priority)

### Student Messages API (Not Yet Implemented)

**Planned Endpoints:**
- `GET /student/messages` - Get messages
- `GET /student/messages/{id}` - Get message details
- `PUT /student/messages/{id}/read` - Mark as read
- `PUT /student/messages/{id}/star` - Star message
- `POST /student/messages/{id}/reply` - Reply to message

### Student Surveys API (Not Yet Implemented)

**Planned Endpoints:**
- `GET /student/surveys` - Get available surveys
- `GET /student/surveys/{id}` - Get survey details
- `POST /student/surveys/{id}/responses` - Submit survey response
- `GET /student/surveys/completed` - Get completed surveys

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Missing required fields: universityId",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Invalid or expired token",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": "Insufficient permissions",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## Rate Limiting

- **Standard endpoints:** 100 requests per minute per user
- **Authentication endpoints:** 10 requests per minute per IP
- **File upload endpoints:** 5 requests per minute per user

When rate limit is exceeded:
```json
{
  "success": false,
  "error": "Rate limit exceeded. Try again in 60 seconds.",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## Testing

### Using Postman
1. Import the collection from `docs/openapi.json`
2. Import environment from `docs/CommonApply.postman_environment.json`
3. Follow the migration guide in `docs/POSTMAN_MIGRATION_GUIDE.md`

### Using request.http
Use the `request.http` file in the project root for quick endpoint testing.

---

## Implementation Status Summary

### ✅ Completed (Ready for Frontend Integration)
- **Program Types API** - `/programs/types`
- **Student Announcements API** - `/announcements/student/*`
- **University Comparison API** - `/comparisons/student/*`
- **Notifications API** - `/notifications/*`
- **Payments API** - `/payments/*`

### ⚠️ Partially Available
- **Universities API** - Already exists, enhanced with program types
- **Applications API** - Already exists, integrates with payments
- **Programs API** - Enhanced with types endpoint

### ❌ Not Implemented (Low Priority)
- **Student Messages API** - Complex real-time messaging system
- **Student Surveys API** - Survey and feedback system

---

## Migration Notes

### From Mock Data to Real APIs

1. **Replace imports:**
   ```typescript
   // Before
   import { mockNotifications } from "@/data/mock-data"
   
   // After
   import { notificationApi } from "@/lib/api/notifications"
   ```

2. **Add loading states:**
   ```typescript
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState(null);
   ```

3. **Implement error handling:**
   ```typescript
   try {
     const response = await api.call();
     setData(response.data);
   } catch (error) {
     setError(error.message);
   } finally {
     setLoading(false);
   }
   ```

4. **Add authentication:**
   ```typescript
   const token = localStorage.getItem('authToken');
   // Include token in API calls
   ```

---

## Support

For questions or issues with the API integration:
1. Check this documentation
2. Review the `request.http` file for example requests
3. Use the Postman collection for testing
4. Check the backend logs for detailed error information

---

---

## Integration Checklist

### Phase 1: Core Application Flow
- [ ] **Applications API** - Complete CRUD operations
- [ ] **Payments API** - Payment processing and tracking
- [ ] **Documents API** - File upload and management
- [ ] **Programs API** - Program browsing and search
- [ ] **Universities API** - University information and stats

### Phase 2: Enhanced Features
- [ ] **Admission Forms API** - Dynamic form handling
- [ ] **Notifications API** - Real-time updates
- [ ] **Eligibility API** - Automatic qualification checking
- [ ] **Announcements API** - Important updates
- [ ] **Comparison API** - University comparison tool

### Phase 3: Advanced Features
- [ ] **Surveys API** - Feedback collection
- [ ] **Messages API** - Communication system
- [ ] **Analytics API** - Application insights
- [ ] **Search API** - Advanced search functionality

---

## Quick Start Guide

### 1. Authentication Setup
```typescript
// Set up authentication
const token = localStorage.getItem('authToken');
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 2. Create Application Flow
```typescript
// 1. Browse programs
const programs = await apiClient.get('/programs?search=computer');

// 2. Create application
const application = await apiClient.post('/applications', {
  universityId: 'uuid',
  programId: 'uuid',
  personalStatement: '...'
});

// 3. Upload documents
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'transcript');
await apiClient.post(`/applications/${applicationId}/documents`, formData);

// 4. Submit application
await apiClient.post(`/applications/${applicationId}/submit`);

// 5. Process payment
const payment = await apiClient.post('/payments', {
  applicationId: applicationId,
  amount: 500,
  method: 'credit_card'
});
```

### 3. Status Tracking
```typescript
// Get application status
const application = await apiClient.get(`/applications/${applicationId}`);

// Get notifications
const notifications = await apiClient.get('/notifications?type=application');

// Mark notifications as read
await apiClient.put(`/notifications/${notificationId}/mark-read`);
```

---

*Last updated: 2024-01-25*
*API Version: v1.0.0*
*Student Application Flow: Complete Integration Guide*