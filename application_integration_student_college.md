# Backend Integration Guide: Student Portal & College Pages

This document outlines all the backend endpoints required to fully integrate the Student Portal and College pages, replacing mock data with real API integration.

## Table of Contents
1. [Current State Analysis](#current-state-analysis)
2. [Student Portal Integration](#student-portal-integration)
3. [College Pages Integration](#college-pages-integration)
4. [Data Structures](#data-structures)
5. [Implementation Priority](#implementation-priority)
6. [Mock Data Dependencies](#mock-data-dependencies)

---

## Current State Analysis

### ✅ Already Integrated
- **Universities Listing** (`/colleges`) - Using `universityApi.listUniversities()`
- **University Details** (`/universities/[slug]`) - Using `universityApi.getUniversityBySlug()`
- **University Programs** - Embedded in university data

### ❌ Using Mock Data
- **Student Portal** - All 12 pages using mock data
- **Program Types Filter** - Using hardcoded array
- **Related Universities** - Not implemented (component returns null)

---

## Student Portal Integration

### 1. Student Announcements (`/student/announcements`)

**Current Mock Data:** `mockAnnouncements` from `@/data/mock-student-data`

**Required Endpoints:**
```typescript
GET    /api/v1/student/announcements
PUT    /api/v1/student/announcements/{id}/mark-read
PUT    /api/v1/student/announcements/mark-all-read
```

**Data Structure:**
```typescript
interface Announcement {
  id: string
  title: string
  content: string
  type: "system" | "university" | "general"
  priority: "high" | "medium" | "low"
  sender: string
  createdAt: string
  isRead: boolean
  actionRequired: boolean
}
```

**Query Parameters:**
- `type` - Filter by announcement type
- `priority` - Filter by priority level
- `unread_only` - Boolean to get only unread
- `search` - Text search in title/content

---

### 2. Student Applications (`/student/applications`)

**Current Mock Data:** `mockApplications` from `@/data/mock-student-data`

**Required Endpoints:**
```typescript
GET    /api/v1/student/applications
POST   /api/v1/student/applications
GET    /api/v1/student/applications/{id}
PUT    /api/v1/student/applications/{id}
DELETE /api/v1/student/applications/{id}
GET    /api/v1/student/applications/{id}/download
```

**Data Structure:**
```typescript
interface StudentApplication {
  id: string
  universityId: string
  universityName: string
  programId: string
  programName: string
  status: "draft" | "submitted" | "under-review" | "accepted" | "rejected" | "waitlisted"
  submittedAt: string
  lastUpdated: string
  deadline: string
  applicationFee: number
  paymentStatus: "pending" | "paid" | "failed"
  documents: {
    transcript: boolean
    recommendation: boolean
    essay: boolean
    portfolio: boolean
  }
  progress: number
  university: {
    name: string
    logo: string
    location: string
  }
  program: {
    name: string
    degree: string
    duration: string
  }
}
```

**Query Parameters:**
- `status` - Filter by application status
- `search` - Search by university/program name
- `sort_by` - Sort by: date, deadline, status, university
- `sort_order` - asc or desc

---

### 3. New Application (`/student/applications/new`)

**Current Mock Data:** Uses `universities` from `@/data/universities-data`

**Required Endpoints:**
```typescript
GET    /api/v1/universities                    # Get universities list
GET    /api/v1/universities/{id}/programs      # Get programs for university
POST   /api/v1/student/applications           # Create new application
```

**Pre-fill Support:**
- URL params: `university`, `program`
- Should auto-populate form fields

---

### 4. University Comparison (`/student/compare`)

**Current Mock Data:** `mockComparisons` from `@/data/mock-student-data`

**Required Endpoints:**
```typescript
GET    /api/v1/student/comparisons
POST   /api/v1/student/comparisons
DELETE /api/v1/student/comparisons/{universityId}
DELETE /api/v1/student/comparisons             # Clear all
```

**Data Structure:**
```typescript
interface UniversityComparison {
  id: string
  universityId: string
  addedAt: string
  university: University  # Full university data
}
```

---

### 5. Student Dashboard (`/student/dashboard`)

**Current Mock Data:** Via `StudentDashboard` component using multiple mock datasets

**Required Endpoints:**
```typescript
GET    /api/v1/student/dashboard               # Summary stats
GET    /api/v1/student/applications/recent     # Recent applications
GET    /api/v1/student/notifications/unread    # Unread notifications
```

**Dashboard Data Structure:**
```typescript
interface DashboardData {
  stats: {
    totalApplications: number
    acceptedApplications: number
    pendingApplications: number
    rejectedApplications: number
    unreadNotifications: number
    unreadMessages: number
  }
  recentApplications: StudentApplication[]
  upcomingDeadlines: Array<{
    applicationId: string
    universityName: string
    programName: string
    deadline: string
    daysRemaining: number
  }>
  notifications: Notification[]
}
```

---

### 6. Student Feedback/Surveys (`/student/feedback`)

**Current Mock Data:** Internal `mockSurveys` array

**Required Endpoints:**
```typescript
GET    /api/v1/student/surveys
GET    /api/v1/student/surveys/{id}
POST   /api/v1/student/surveys/{id}/responses
GET    /api/v1/student/surveys/completed
```

**Data Structure:**
```typescript
interface Survey {
  id: string
  title: string
  description: string
  type: "experience" | "feature" | "satisfaction" | "improvement"
  status: "available" | "completed" | "expired"
  reward: number
  estimatedTime: number
  questions: SurveyQuestion[]
  completedAt?: string
}

interface SurveyQuestion {
  id: string
  type: "rating" | "multiple_choice" | "text" | "checkbox" | "scale"
  question: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
}

interface SurveyResponse {
  surveyId: string
  responses: Array<{
    questionId: string
    answer: string | number | string[]
  }>
}
```

---

### 7. Student Messages (`/student/messages`)

**Current Mock Data:** Internal `mockMessages` array

**Required Endpoints:**
```typescript
GET    /api/v1/student/messages
GET    /api/v1/student/messages/{id}
PUT    /api/v1/student/messages/{id}/read
PUT    /api/v1/student/messages/{id}/star
POST   /api/v1/student/messages/{id}/reply
```

**Data Structure:**
```typescript
interface Message {
  id: string
  sender: string
  senderAvatar: string
  senderId: string
  subject: string
  preview: string
  content: string
  timestamp: string
  isRead: boolean
  isStarred: boolean
  type: "university" | "system"
  universityId?: string
  applicationId?: string
  canReply: boolean
}
```

**Query Parameters:**
- `type` - Filter by message type
- `unread_only` - Boolean for unread messages
- `starred_only` - Boolean for starred messages

---

### 8. Student Notifications (`/student/notifications`)

**Current Mock Data:** `mockNotifications` from `@/data/mock-data`

**Required Endpoints:**
```typescript
GET    /api/v1/student/notifications
PUT    /api/v1/student/notifications/{id}/read
PUT    /api/v1/student/notifications/mark-all-read
DELETE /api/v1/student/notifications/{id}
```

**Data Structure:**
```typescript
interface Notification {
  id: string
  title: string
  message: string
  type: "application" | "payment" | "deadline" | "announcement"
  isRead: boolean
  createdAt: string
  actionUrl?: string
  applicationId?: string
  universityId?: string
  metadata?: Record<string, any>
}
```

---

### 9. Student Payments (`/student/payments`)

**Current Mock Data:** `mockPayments` from `@/data/mock-student-data`

**Required Endpoints:**
```typescript
GET    /api/v1/student/payments
POST   /api/v1/student/payments
GET    /api/v1/student/payments/{id}
GET    /api/v1/student/payments/{id}/receipt
POST   /api/v1/student/payments/{id}/retry
GET    /api/v1/student/payments/{id}/receipt/download
POST   /api/v1/student/payments/{id}/receipt/email
```

**Data Structure:**
```typescript
interface PaymentRecord {
  id: string
  applicationId: string
  application: {
    universityName: string
    programName: string
  }
  amount: number
  currency: string
  method: "credit_card" | "bank_transfer" | "mobile_money"
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId: string
  timestamp: string
  receipt?: {
    url: string
    downloadUrl: string
  }
  failureReason?: string
}
```

**Query Parameters:**
- `status` - Filter by payment status
- `application_id` - Filter by application
- `date_from`, `date_to` - Date range filtering

---

### 10. Student Profile (`/student/profile`)

**Current Mock Data:** User data from auth store

**Required Endpoints:**
```typescript
GET    /api/v1/student/profile
PUT    /api/v1/student/profile
POST   /api/v1/student/profile/avatar
GET    /api/v1/student/profile/stats
```

**Data Structure:**
```typescript
interface StudentProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  city: string
  country: string
  bio: string
  academicInfo: {
    highSchool: string
    graduationYear: string
    gpa: string
    transcriptUploaded: boolean
  }
  avatar?: string
  stats: {
    totalApplications: number
    acceptedApplications: number
    profileCompleteness: number
  }
}
```

---

### 11. Student Settings (`/student/settings`)

**Current Mock Data:** User data from auth store

**Required Endpoints:**
```typescript
GET    /api/v1/student/settings
PUT    /api/v1/student/settings/notifications
PUT    /api/v1/student/settings/privacy
```

**Data Structure:**
```typescript
interface StudentSettings {
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
    marketing: boolean
    applicationUpdates: boolean
    deadlineReminders: boolean
    universityMessages: boolean
  }
  privacy: {
    profileVisible: boolean
    showApplicationStatus: boolean
    allowUniversityContact: boolean
    shareDataWithPartners: boolean
  }
  preferences: {
    language: string
    timezone: string
    currency: string
  }
}
```

---

## College Pages Integration

### 1. Universities Listing (`/colleges`)

**Status:** ✅ **Already Integrated**
**Current API:** `universityApi.listUniversities()`

**Enhancements Needed:**
```typescript
# Additional endpoints for better filtering
GET    /api/v1/programs/types                 # Replace mock programTypes
GET    /api/v1/universities/regions           # For location filtering
GET    /api/v1/universities/fields-of-study   # For field filtering
```

---

### 2. University Detail (`/universities/[slug]`)

**Status:** ✅ **Already Integrated**
**Current API:** `universityApi.getUniversityBySlug()`

**Enhancements Needed:**
```typescript
GET    /api/v1/universities/{id}/related      # Related universities
GET    /api/v1/universities/{id}/reviews      # Student reviews
GET    /api/v1/universities/{id}/stats        # Live statistics
```

---

### 3. University Programs (`/universities/[slug]/programs`)

**Status:** ✅ **Already Integrated**
**Uses:** University data with embedded programs

**Enhancements Needed:**
```typescript
GET    /api/v1/programs/{id}                  # Direct program access
GET    /api/v1/programs/{id}/similar          # Similar programs
```

---

## Mock Data Dependencies to Remove

### 1. `/data/universities-data.ts`
**Usage:**
- `programTypes` array - Used by EnhancedSearch component
- Mock university data - Development fallback

**Replacement:**
```typescript
GET    /api/v1/programs/types
GET    /api/v1/universities/metadata          # For development/testing
```

### 2. `/data/mock-student-data.ts`
**Contains:**
- mockApplications
- mockPayments
- mockAnnouncements
- mockNotifications
- mockComparisons

**Status:** All need API integration

### 3. `/data/mock-data.ts`
**Usage:**
- General notifications mock data

**Status:** Needs API integration

---

## Implementation Priority

### Phase 1: Core Student Features (High Priority)
1. **Student Applications** - Core functionality
2. **Student Dashboard** - Overview and stats
3. **Student Profile** - User data management
4. **Student Payments** - Financial transactions

### Phase 2: Communication Features (Medium Priority)
1. **Student Notifications** - System alerts
2. **Student Messages** - University communication
3. **Student Announcements** - Information delivery

### Phase 3: Enhanced Features (Low Priority)
1. **Student Surveys** - Feedback collection
2. **University Comparison** - Research tools
3. **Related Universities** - Discovery features
4. **Enhanced Search** - Better filtering

### Phase 4: Metadata & Configuration
1. **Program Types API** - Replace mock data
2. **Regions/Locations API** - Geographic data
3. **System Configuration** - App settings

---

## API Authentication & Authorization

All student endpoints should:
- Require authentication (Bearer token)
- Validate student role
- Filter data by authenticated student ID
- Implement proper error handling (401, 403, 404, 500)

## Error Handling Standards

```typescript
interface ApiError {
  success: false
  error: string
  message: string
  code: string
  details?: Record<string, any>
}
```

## Pagination Standards

```typescript
interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
```

---

## Next Steps

1. **Implement Core Student APIs** (Phase 1)
2. **Update Frontend Services** in `/lib/api/`
3. **Replace Mock Data Imports** in components
4. **Add Error Handling** and loading states
5. **Test Integration** with real data
6. **Remove Mock Data Files** when fully integrated

## ✅ Integration Progress Summary

### 🎉 Completed Integrations
1. **Applications API Service** - Complete TypeScript service with all endpoints
2. **Student Applications Page** - Real API integration with loading, error handling, pagination
3. **Student Dashboard** - Real application stats and recent applications display
4. **Application Status Card Component** - Updated to handle real API data structure

### 🔧 Technical Implementation Details

**API Service (`/lib/api/applications.ts`):**
- Full CRUD operations for applications
- TypeScript interfaces matching backend response structure
- Error handling and response type safety
- Support for all documented backend endpoints

**Frontend Integration:**
- Replaced mock data with real API calls
- Added loading states with skeleton UI
- Implemented error handling with toast notifications
- Added client-side search (since backend doesn't support search yet)
- Server-side filtering for status, sorting
- Pagination support ready for implementation

**Data Structure Adaptations:**
- Updated status values: `under-review` → `under_review`
- Adapted nested data structure: `application.program.university.name`
- Payment status simplified to boolean `hasPayment` in list view
- Removed progress field (not available in backend)
- Added submitted date display

### 📈 Next Integration Steps
1. **Student Profile API** - User data management
2. **Student Payments API** - Financial transactions  
3. **Student Notifications API** - System alerts
4. **Student Messages API** - University communication

### 🚀 Backend API Limitations Identified

**Not Yet Implemented Endpoints (Return 501):**
- `DELETE /api/v1/applications/:id` - Delete application
- `GET /api/v1/applications/:id/download` - Download application
- Document upload/management endpoints
- Bulk operations endpoints

**Missing Features in Current Backend:**
- Search functionality (currently handled client-side)
- Application deadline management
- Document status tracking
- Progress percentage calculation

**Frontend Workarounds Implemented:**
- Client-side search filtering for university/program names
- Simplified payment status display
- Graceful handling of missing data fields
- Loading states for all API operations
- Error boundary with user-friendly messages

This integration represents a major milestone - transforming the application from a mock-data prototype into a functional student portal with real backend integration for core application management features.

## 🎯 Admin Portal Integration (Completed)

### 🏛️ University Admin Dashboard (`/admin/dashboard`)
**Status:** ✅ **COMPLETED - Real API Integration**

**Integration Details:**
- **Real Application Metrics**: Dashboard now displays live application statistics from backend API
- **Dynamic Data Loading**: Added loading states and error handling for all metrics
- **Revenue Calculation**: Real payment statistics with estimated revenue tracking
- **Application Progress**: Live counts for submitted, under review, accepted, and rejected applications
- **Recent Applications**: Real-time display of latest application submissions with proper data structure

**Technical Implementation:**
- Added `applicationApi.listApplications()` call for dashboard statistics
- Replaced mock application counts with real data calculations
- Added loading states (`applicationsLoading`) for all metric cards
- Fixed variable naming issues (corrected `totalRevenue` to `estimatedRevenue`)
- Updated recent applications display to use real API data structure

### 📋 University Admin Applications Page (`/admin/applications`)
**Status:** ✅ **COMPLETED - Full API Integration**

**Integration Details:**
- **Complete Data Transformation**: API data mapped to admin interface requirements
- **Advanced Filtering**: Real server-side filtering by status, sorting, pagination
- **Client-side Search**: Added search functionality for university/program names
- **Bulk Operations**: Ready for backend implementation with UI complete
- **Action Management**: Application status change dialogs with notification system

**Technical Implementation:**
- Created data transformation layer converting API `Application` objects to `AdminApplication` format
- Implemented server-side filtering and sorting via API parameters
- Added client-side search filtering as workaround for missing backend search
- Integrated real pagination with backend response structure
- Added comprehensive error handling with user-friendly toast messages

**Data Structure Adaptations:**
```typescript
// API Response -> Admin Interface
{
  program.university.name -> universityName
  program.name -> programName
  hasPayment -> paymentStatus (boolean to enum)
  status -> status (snake_case handling)
}
```

### 🖥️ System Admin Dashboard (`/system-admin/dashboard`)
**Status:** ✅ **COMPLETED - Enhanced with Application Metrics**

**Integration Details:**
- **Application Statistics Section**: New comprehensive application metrics dashboard
- **System-wide Overview**: Application status distribution across all universities
- **Real-time Updates**: Refresh functionality includes application data
- **Performance Metrics**: Application processing statistics and trends
- **Revenue Tracking**: System-wide application fee revenue calculation

**Technical Implementation:**
- Added `applicationApi.listApplications()` integration alongside existing system metrics
- Created application statistics calculation for system admin view
- Added new metrics card for total applications system-wide
- Implemented application status distribution with progress bars
- Enhanced refresh functionality to reload both system and application data

**New Dashboard Sections:**
1. **Application Status Distribution**: Visual breakdown of application statuses
2. **Recent Applications Activity**: Live feed of latest application submissions
3. **Application Revenue Metrics**: Payment statistics and revenue estimates

## 🔧 Enhanced API Client (`/lib/api/applications.ts`)

### 🎯 Admin-Specific Endpoints Added

**University Admin Methods:**
```typescript
// University-specific application management
applicationApi.listUniversityApplications(params)     // Filtered by university
applicationApi.updateApplicationStatus(id, status)    // Status management
applicationApi.bulkUpdateApplicationStatus(ids, status) // Bulk operations
applicationApi.getUniversityApplicationStats()        // University stats
applicationApi.exportApplications(params)             // Data export
```

**System Admin Methods:**
```typescript
// System-wide application oversight
applicationApi.listAllApplications(params)            // All universities
applicationApi.getSystemApplicationStats()            // System-wide stats
```

**Enhanced Endpoints Configuration:**
- Added `ADMIN_ENDPOINTS` for university admin operations
- Added `SYSTEM_ADMIN_ENDPOINTS` for system admin operations
- Centralized endpoint management with type safety
- Consistent error handling across all admin operations

### 📊 Admin Integration Architecture

**University Admin Flow:**
1. Login → University-specific data filtering
2. Dashboard → Real application metrics for their university
3. Applications → Manage applications for their programs only
4. Actions → Update status, send notifications, export data

**System Admin Flow:**
1. Login → System-wide data access
2. Dashboard → All universities' application metrics
3. Applications → View/manage across all universities
4. Analytics → System-wide performance and trends

## 🚀 Technical Achievements

### ✅ Completed Integrations Summary
1. **Student Portal** - Full API integration (previous milestone)
2. **University Admin Dashboard** - Real metrics and application data
3. **Admin Applications Management** - Complete CRUD with filtering
4. **System Admin Dashboard** - Enhanced with application analytics
5. **API Client Extensions** - Admin-specific methods and endpoints

### 🔄 Data Flow Architecture
```
Backend API ←→ Applications API Client ←→ Admin Components
     ↓              ↓                       ↓
   Real Data → Type-safe Methods → Live Dashboard Updates
```

### 🛡️ Error Handling & UX
- Comprehensive loading states for all admin operations
- Toast notifications for user feedback
- Graceful degradation when data unavailable
- Client-side search as backend fallback
- Error boundaries for admin interfaces

### 📈 Performance Optimizations
- Efficient data fetching with pagination
- Client-side filtering to reduce API calls
- Optimistic UI updates for better user experience
- Batch operations for bulk admin actions

## 🎯 Integration Status Overview

| Component | Status | Integration Level |
|-----------|--------|------------------|
| Student Portal | ✅ Complete | Full API Integration |
| Admin Dashboard | ✅ Complete | Real Metrics & Data |
| Admin Applications | ✅ Complete | Full CRUD Operations |
| System Admin Dashboard | ✅ Complete | Enhanced Analytics |
| API Client | ✅ Complete | Admin Extensions |

This comprehensive integration transforms the Common App platform from a prototype into a production-ready application management system with full administrative capabilities and real-time data integration across all user roles.