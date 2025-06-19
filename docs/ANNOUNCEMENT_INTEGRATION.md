# Announcement Integration - Backend Requirements

## Overview
This document outlines the backend requirements for implementing the announcement system in the Common App platform. The system allows universities to create, manage, and distribute announcements to students, applicants, and other stakeholders.

## Database Schema

### Announcements Table
```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('general', 'urgent', 'deadline', 'event', 'maintenance', 'celebration')),
    target_audience VARCHAR(50) NOT NULL CHECK (target_audience IN ('all', 'students', 'applicants', 'accepted', 'staff', 'specific')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expiry_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id),
    views INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    send_notification BOOLEAN DEFAULT TRUE,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    tags TEXT[],
    program_ids UUID[],
    university_ids UUID[],
    
    -- Indexes
    INDEX idx_announcements_status (status),
    INDEX idx_announcements_type (type),
    INDEX idx_announcements_target_audience (target_audience),
    INDEX idx_announcements_priority (priority),
    INDEX idx_announcements_publish_date (publish_date),
    INDEX idx_announcements_created_by (created_by),
    INDEX idx_announcements_is_pinned (is_pinned),
    INDEX idx_announcements_tags USING GIN (tags),
    INDEX idx_announcements_program_ids USING GIN (program_ids),
    INDEX idx_announcements_university_ids USING GIN (university_ids)
);
```

### Announcement Attachments Table
```sql
CREATE TABLE announcement_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_announcement_attachments_announcement_id (announcement_id)
);
```

### Announcement Comments Table
```sql
CREATE TABLE announcement_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    parent_comment_id UUID REFERENCES announcement_comments(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_announcement_comments_announcement_id (announcement_id),
    INDEX idx_announcement_comments_user_id (user_id),
    INDEX idx_announcement_comments_parent_comment_id (parent_comment_id)
);
```

### Announcement Views Table (for tracking user engagement)
```sql
CREATE TABLE announcement_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_announcement_views_announcement_id (announcement_id),
    INDEX idx_announcement_views_user_id (user_id),
    UNIQUE INDEX idx_announcement_views_unique (announcement_id, user_id, ip_address)
);
```

## API Endpoints

### Base URL: `/api/v1/announcements`

#### Public Endpoints
- `GET /api/v1/announcements` - Get all published announcements with filtering
- `GET /api/v1/announcements/active` - Get active (published & not expired) announcements
- `GET /api/v1/announcements/pinned` - Get pinned announcements
- `GET /api/v1/announcements/:id` - Get specific announcement
- `POST /api/v1/announcements/:id/read` - Mark announcement as read
- `GET /api/v1/announcements/audience/:audience` - Get announcements by target audience
- `GET /api/v1/announcements/type/:type` - Get announcements by type

#### Admin Endpoints (Requires Authentication)
- `POST /api/v1/announcements` - Create new announcement
- `PUT /api/v1/announcements/:id` - Update announcement
- `DELETE /api/v1/announcements/:id` - Delete announcement
- `POST /api/v1/announcements/:id/publish` - Publish announcement
- `POST /api/v1/announcements/:id/archive` - Archive announcement
- `POST /api/v1/announcements/:id/pin` - Pin announcement
- `POST /api/v1/announcements/:id/unpin` - Unpin announcement
- `GET /api/v1/announcements/stats` - Get announcement statistics

#### Comment Endpoints
- `POST /api/v1/announcements/:id/comments` - Add comment
- `PUT /api/v1/announcements/:id/comments/:commentId` - Update comment
- `DELETE /api/v1/announcements/:id/comments/:commentId` - Delete comment

## Request/Response Examples

### Create Announcement Request
```json
{
  "title": "Application Deadline Extended",
  "content": "We are pleased to announce that the application deadline for Fall 2024 has been extended to March 15, 2024.",
  "type": "deadline",
  "targetAudience": "all",
  "status": "published",
  "publishDate": "2024-01-20T10:00:00Z",
  "expiryDate": "2024-03-15T23:59:59Z",
  "isPinned": true,
  "allowComments": true,
  "sendNotification": true,
  "priority": "high",
  "tags": ["deadline", "applications", "fall-2024"],
  "programIds": [],
  "universityIds": ["univ-123"]
}
```

### Announcement Response
```json
{
  "id": "ann-123",
  "title": "Application Deadline Extended",
  "content": "We are pleased to announce that the application deadline for Fall 2024 has been extended to March 15, 2024.",
  "type": "deadline",
  "targetAudience": "all",
  "status": "published",
  "publishDate": "2024-01-20T10:00:00Z",
  "expiryDate": "2024-03-15T23:59:59Z",
  "createdAt": "2024-01-20T09:30:00Z",
  "updatedAt": "2024-01-20T09:30:00Z",
  "createdBy": "admin-123",
  "views": 1250,
  "isPinned": true,
  "allowComments": true,
  "sendNotification": true,
  "priority": "high",
  "tags": ["deadline", "applications", "fall-2024"],
  "programIds": [],
  "universityIds": ["univ-123"],
  "attachments": [
    {
      "id": "att-123",
      "name": "Updated Timeline.pdf",
      "url": "/documents/timeline.pdf",
      "type": "pdf",
      "size": 245760
    }
  ],
  "comments": []
}
```

### List Announcements Response
```json
{
  "announcements": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Query Parameters for Filtering

### GET /api/v1/announcements
- `type` - Filter by announcement type
- `status` - Filter by status (draft, published, scheduled, archived)
- `priority` - Filter by priority (low, medium, high)
- `targetAudience` - Filter by target audience
- `tags` - Filter by tags (comma-separated)
- `dateFrom` - Filter announcements from date
- `dateTo` - Filter announcements to date
- `isPinned` - Filter pinned announcements (true/false)
- `search` - Search in title and content
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sortBy` - Sort by field (createdAt, publishDate, views, title)
- `sortOrder` - Sort order (asc, desc)

## Seed Data

### Sample Announcements
```sql
-- Insert sample announcements
INSERT INTO announcements (
    title, content, type, target_audience, status, publish_date, expiry_date, 
    created_by, is_pinned, allow_comments, send_notification, priority, tags
) VALUES 
(
    'Application Deadline Extended for Fall 2024',
    'We are pleased to announce that the application deadline for Fall 2024 admission has been extended to March 15, 2024. This extension provides prospective students with additional time to complete their application forms, gather required documents, prepare for entrance examinations, and submit scholarship applications.',
    'deadline',
    'all',
    'published',
    '2024-01-20 10:00:00+00',
    '2024-03-15 23:59:59+00',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    true,
    true,
    true,
    'high',
    ARRAY['deadline', 'applications', 'fall-2024', 'extension']
),
(
    'New Merit-Based Scholarship Program Launched',
    'We are excited to introduce our new Academic Excellence Scholarship program for outstanding students. Award Amount: Up to $10,000 per academic year. Duration: Renewable for up to 4 years. Eligibility: Minimum GPA of 3.7 and demonstrated leadership. Application Deadline: February 28, 2024.',
    'general',
    'students',
    'published',
    '2024-01-18 14:00:00+00',
    NULL,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    false,
    true,
    true,
    'medium',
    ARRAY['scholarship', 'financial-aid', 'merit', 'academic-excellence']
),
(
    'Virtual Campus Tour and Information Session',
    'Join us for an exclusive virtual campus tour and information session! Date: February 10, 2024. Time: 2:00 PM - 4:00 PM EAT. Platform: Zoom (link will be provided upon registration). What to Expect: Live virtual tour of our campus facilities, Information about academic programs, Q&A session with faculty and current students.',
    'event',
    'applicants',
    'published',
    '2024-01-25 09:00:00+00',
    '2024-02-10 18:00:00+00',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    true,
    true,
    true,
    'medium',
    ARRAY['event', 'virtual-tour', 'information-session', 'campus']
),
(
    'System Maintenance Scheduled',
    'Our application portal will undergo scheduled maintenance to improve performance and add new features. Date: February 5, 2024. Time: 2:00 AM - 6:00 AM EAT. Duration: Approximately 4 hours. Services Affected: Application submission portal, Document upload system, Payment processing, Student dashboard.',
    'maintenance',
    'all',
    'published',
    '2024-01-30 16:00:00+00',
    '2024-02-05 10:00:00+00',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    false,
    false,
    true,
    'low',
    ARRAY['maintenance', 'system-update', 'portal']
),
(
    'Congratulations to Our New Graduates!',
    'We are proud to celebrate the achievements of our Class of 2024 graduates! 1,250 students graduated across all programs. 95% job placement rate within 6 months. Average starting salary increased by 12%. 15% pursuing advanced degrees. We wish all our graduates success in their future endeavors!',
    'celebration',
    'all',
    'published',
    '2024-01-28 12:00:00+00',
    NULL,
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    false,
    true,
    false,
    'low',
    ARRAY['graduation', 'celebration', 'achievements', 'class-2024']
),
(
    'URGENT: Document Verification Deadline',
    'IMPORTANT NOTICE: All submitted documents must be verified by February 20, 2024. Action Required: Check your application status, Respond to any verification requests, Submit missing documents immediately, Contact admissions if you have questions. Consequences of Missing Deadline: Application may be marked incomplete, Admission decision may be delayed.',
    'urgent',
    'applicants',
    'published',
    '2024-02-01 08:00:00+00',
    '2024-02-20 23:59:59+00',
    (SELECT id FROM users WHERE role = 'admin' LIMIT 1),
    true,
    false,
    true,
    'high',
    ARRAY['urgent', 'documents', 'verification', 'deadline']
);
```

## Business Logic Requirements

### Announcement Publishing
1. **Auto-publish**: If `publishDate` is set to current time or past, publish immediately
2. **Schedule**: If `publishDate` is in future, schedule for publication
3. **Notifications**: If `sendNotification` is true, send push/email notifications to target audience
4. **Expiry**: Auto-archive announcements past their `expiryDate`

### Target Audience Filtering
- `all`: Visible to everyone
- `students`: Only registered students
- `applicants`: Only users with submitted applications
- `accepted`: Only students with accepted applications
- `staff`: Only university staff/admin users
- `specific`: Based on `programIds` or `universityIds`

### Analytics & Tracking
1. Track view counts per announcement
2. Track unique users who viewed
3. Track engagement metrics (comments, shares)
4. Generate reports for admin dashboard

### Permissions
- **University Admin**: Can create/edit announcements for their university
- **System Admin**: Can create/edit all announcements
- **Students/Applicants**: Can only view published announcements and comment (if allowed)

## Integration Points

### Notification System
- Send email notifications when announcements are published
- Send push notifications for urgent announcements
- Integration with existing notification preferences

### User Roles & Permissions
- Integrate with existing role-based access control
- University-specific announcement management
- Student/applicant visibility controls

### Search & Filtering
- Full-text search in title and content
- Tag-based filtering
- Date range filtering
- Priority-based sorting

## Caching Strategy
- Cache active announcements for 5 minutes
- Cache pinned announcements for 10 minutes
- Cache announcement stats for 15 minutes
- Invalidate cache when announcements are updated

## Performance Considerations
- Use database indexes for efficient querying
- Implement pagination for large result sets
- Use CDN for attachment files
- Compress content for faster loading
- Implement rate limiting for API endpoints

This integration will provide a comprehensive announcement system that enhances communication between universities and students while maintaining performance and usability standards.