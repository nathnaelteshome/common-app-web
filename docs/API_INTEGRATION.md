# API Integration Guide

This document provides comprehensive instructions for integrating the CommonApply frontend with an Express.js backend.

## Table of Contents

1. [Overview](#overview)
2. [Authentication System](#authentication-system)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Formats](#requestresponse-formats)
5. [Error Handling](#error-handling)
6. [File Upload](#file-upload)
7. [Database Schema](#database-schema)
8. [Security Considerations](#security-considerations)
9. [Testing](#testing)

## Overview

The CommonApply frontend is designed to work seamlessly with an Express.js backend through a well-defined REST API. The system uses JWT-based authentication and follows RESTful conventions.

### Key Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (Student, University Admin, System Admin)
- **File upload** support for documents and images
- **Real-time notifications** (WebSocket ready)
- **Payment processing** integration
- **Email verification** and password reset
- **Comprehensive error handling**

## Authentication System

### JWT Implementation

The frontend expects JWT tokens with the following structure:

\`\`\`json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "student|university|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
\`\`\`

### Authentication Flow

1. **Login**: `POST /api/v1/auth/login`
2. **Token Refresh**: `POST /api/v1/auth/refresh`
3. **Logout**: `POST /api/v1/auth/logout`

### Required Headers

\`\`\`
Authorization: Bearer <access_token>
Content-Type: application/json
\`\`\`

## API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/login
**Purpose**: User authentication

**Request Body**:
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "role": "student",
      "isEmailVerified": true,
      "profile": { ... }
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token",
    "expiresIn": 604800
  }
}
\`\`\`

#### POST /api/v1/auth/register
**Purpose**: User registration

**Request Body**:
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "phoneNumber": "+1234567890",
    "dateOfBirth": "01/01/1990"
  }
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "user": { ... },
    "message": "Registration successful. Please verify your email.",
    "verificationRequired": true
  }
}
\`\`\`

#### POST /api/v1/auth/refresh
**Purpose**: Refresh access token

**Request Body**:
\`\`\`json
{
  "refreshToken": "jwt-refresh-token"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-access-token",
    "refreshToken": "new-jwt-refresh-token",
    "expiresIn": 604800
  }
}
\`\`\`

#### POST /api/v1/auth/logout
**Purpose**: User logout (invalidate tokens)

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
\`\`\`

#### POST /api/v1/auth/forgot-password
**Purpose**: Initiate password reset

**Request Body**:
\`\`\`json
{
  "email": "user@example.com"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Password reset instructions sent to your email",
    "resetTokenSent": true
  }
}
\`\`\`

#### POST /api/v1/auth/reset-password
**Purpose**: Reset password with token

**Request Body**:
\`\`\`json
{
  "resetToken": "reset-token",
  "email": "user@example.com",
  "password": "newpassword123",
  "confirmPassword": "newpassword123"
}
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "message": "Password reset successfully",
    "success": true
  }
}
\`\`\`

### User Management Endpoints

#### GET /api/v1/users/profile
**Purpose**: Get current user profile

**Headers**: `Authorization: Bearer <token>`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "role": "student",
    "profile": { ... },
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
\`\`\`

#### PUT /api/v1/users/profile
**Purpose**: Update user profile

**Request Body**:
\`\`\`json
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "phoneNumber": "+1234567890"
}
\`\`\`

### Application Management Endpoints

#### GET /api/v1/applications
**Purpose**: List applications (filtered by user role)

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status
- `universityId`: Filter by university
- `studentId`: Filter by student (admin only)

#### POST /api/v1/applications
**Purpose**: Create new application

**Request Body**:
\`\`\`json
{
  "universityId": "university-id",
  "programId": "program-id",
  "personalStatement": "My personal statement...",
  "academicHistory": [
    {
      "institution": "High School Name",
      "degree": "High School Diploma",
      "fieldOfStudy": "General",
      "gpa": 3.8,
      "startDate": "2018-09-01",
      "endDate": "2022-06-01",
      "isCompleted": true
    }
  ]
}
\`\`\`

### University Management Endpoints

#### GET /api/v1/universities
**Purpose**: List universities

#### GET /api/v1/universities/:id
**Purpose**: Get university details

#### POST /api/v1/universities (System Admin only)
**Purpose**: Create new university

### Payment Endpoints

#### POST /api/v1/payments
**Purpose**: Create payment for application

**Request Body**:
\`\`\`json
{
  "applicationId": "application-id",
  "amount": 50.00,
  "currency": "USD",
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardToken": "stripe-card-token"
  }
}
\`\`\`

## Request/Response Formats

### Standard Response Format

All API responses follow this format:

\`\`\`json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string,
  "errors": object
}
\`\`\`

### Pagination Format

\`\`\`json
{
  "success": true,
  "data": {
    "data": [...],
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

## Error Handling

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

### Error Response Format

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "errors": {
    "field1": ["Field is required"],
    "field2": ["Invalid format"]
  },
  "code": "VALIDATION_ERROR",
  "timestamp": "2023-01-01T00:00:00Z",
  "path": "/api/v1/auth/login"
}
\`\`\`

## File Upload

### Supported File Types

- **Documents**: PDF, DOC, DOCX
- **Images**: JPG, JPEG, PNG, GIF
- **Maximum Size**: 10MB per file

### Upload Endpoint

#### POST /api/v1/files/upload

**Request**: Multipart form data
\`\`\`
file: <file>
type: document|image
category: transcript|recommendation|avatar|campus_image
\`\`\`

**Response**:
\`\`\`json
{
  "success": true,
  "data": {
    "fileId": "file-id",
    "fileName": "document.pdf",
    "fileUrl": "https://example.com/files/document.pdf",
    "fileSize": 1024000,
    "mimeType": "application/pdf",
    "uploadedAt": "2023-01-01T00:00:00Z"
  }
}
\`\`\`

## Database Schema

### Recommended Database Structure

#### Users Table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'university', 'admin')),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Student Profiles Table
\`\`\`sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  date_of_birth DATE,
  avatar_url VARCHAR(500),
  address JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Universities Table
\`\`\`sql
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  location JSONB NOT NULL,
  contact JSONB NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Applications Table
\`\`\`sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  program_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted')),
  personal_statement TEXT,
  academic_history JSONB,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_id UUID,
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Payments Table
\`\`\`sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  gateway_response JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Security Considerations

### Authentication Security

1. **Password Hashing**: Use bcrypt with at least 12 rounds
2. **JWT Security**: 
   - Use strong secret keys (256-bit minimum)
   - Set appropriate expiration times
   - Implement token blacklisting for logout
3. **Rate Limiting**: Implement rate limiting on authentication endpoints
4. **Account Lockout**: Lock accounts after failed login attempts

### Data Validation

1. **Input Sanitization**: Sanitize all user inputs
2. **SQL Injection Prevention**: Use parameterized queries
3. **XSS Prevention**: Escape output data
4. **File Upload Security**: Validate file types and scan for malware

### CORS Configuration

\`\`\`javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
\`\`\`

## Testing

### API Testing Checklist

- [ ] Authentication endpoints work correctly
- [ ] JWT tokens are properly validated
- [ ] Role-based access control is enforced
- [ ] File uploads work with size and type restrictions
- [ ] Error responses follow the standard format
- [ ] Pagination works correctly
- [ ] Database transactions are properly handled
- [ ] Email notifications are sent
- [ ] Payment processing works (test mode)

### Sample Test Cases

#### Authentication Test
\`\`\`javascript
describe('POST /api/v1/auth/login', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'student@test.com',
        password: 'Student123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
\`\`\`

#### Protected Route Test
\`\`\`javascript
describe('GET /api/v1/users/profile', () => {
  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile');
    
    expect(response.status).toBe(401);
  });
  
  it('should return user profile with valid token', async () => {
    const response = await request(app)
      .get('/api/v1/users/profile')
      .set('Authorization', `Bearer ${validToken}`);
    
    expect(response.status).toBe(200);
    expect(response.body.data.email).toBeDefined();
  });
});
\`\`\`

## Implementation Checklist

### Backend Setup
- [ ] Express.js server setup
- [ ] Database connection (PostgreSQL recommended)
- [ ] JWT authentication middleware
- [ ] File upload middleware (multer)
- [ ] Email service integration
- [ ] Payment gateway integration
- [ ] Error handling middleware
- [ ] Logging setup
- [ ] CORS configuration
- [ ] Rate limiting
- [ ] Input validation (joi/express-validator)

### API Implementation
- [ ] Authentication endpoints
- [ ] User management endpoints
- [ ] Application management endpoints
- [ ] University management endpoints
- [ ] Payment endpoints
- [ ] File upload endpoints
- [ ] Notification endpoints
- [ ] Search endpoints
- [ ] Admin endpoints

### Security Implementation
- [ ] Password hashing
- [ ] JWT token generation/validation
- [ ] Role-based access control
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] File upload security
- [ ] Rate limiting
- [ ] Account lockout mechanism

### Testing
- [ ] Unit tests for all endpoints
- [ ] Integration tests
- [ ] Authentication flow testing
- [ ] File upload testing
- [ ] Payment flow testing
- [ ] Error handling testing

This comprehensive guide provides everything needed to implement a robust Express.js backend that seamlessly integrates with the CommonApply frontend. The API is designed to be scalable, secure, and maintainable.
