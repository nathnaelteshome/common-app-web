# Backend Requirements for CommonApply

## System Requirements

### Technology Stack
- **Runtime**: Node.js 18+ 
- **Framework**: Express.js 4.18+
- **Database**: PostgreSQL 14+ (recommended) or MongoDB 6+
- **Cache**: Redis 7+ (for sessions and caching)
- **File Storage**: Local filesystem or AWS S3
- **Email Service**: SendGrid, AWS SES, or similar
- **Payment Gateway**: Stripe (primary), PayPal (optional)

### Development Environment
- **Package Manager**: npm or yarn
- **Process Manager**: PM2 (production)
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Documentation**: Swagger/OpenAPI 3.0

## Core Features Implementation

### 1. Authentication & Authorization

#### JWT Implementation
\`\`\`javascript
// Required JWT payload structure
{
  "sub": "user-uuid",
  "email": "user@example.com", 
  "role": "student|university|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
\`\`\`

#### Password Security
- **Hashing**: bcrypt with 12+ rounds
- **Validation**: Minimum 8 characters, mixed case, numbers
- **Reset**: Time-limited tokens (1 hour expiry)

#### Session Management
- **Access Token**: 7 days expiry
- **Refresh Token**: 30 days expiry
- **Token Blacklisting**: Redis-based for logout

### 2. User Management

#### User Roles & Permissions
\`\`\`javascript
const ROLES = {
  STUDENT: 'student',
  UNIVERSITY: 'university', 
  ADMIN: 'admin'
};

const PERMISSIONS = {
  student: ['read:own_profile', 'update:own_profile', 'create:application'],
  university: ['read:applications', 'update:application_status', 'manage:programs'],
  admin: ['manage:users', 'manage:universities', 'view:all_data']
};
\`\`\`

#### Profile Management
- **Student Profile**: Personal info, academic history, documents
- **University Profile**: Institution details, programs, verification status
- **Admin Profile**: System permissions, audit trail

### 3. Application System

#### Application Lifecycle
1. **Draft** → Student creates application
2. **Submitted** → Student submits with payment
3. **Under Review** → University reviews application
4. **Decision** → Accepted/Rejected/Waitlisted

#### Document Management
- **File Types**: PDF, DOC, DOCX (documents), JPG, PNG (images)
- **Size Limit**: 10MB per file
- **Storage**: Secure file storage with access control
- **Virus Scanning**: Implement malware detection

### 4. Payment Processing

#### Stripe Integration
\`\`\`javascript
// Payment flow
1. Create payment intent
2. Process payment on frontend
3. Confirm payment on backend
4. Update application status
5. Send confirmation email
\`\`\`

#### Payment Security
- **PCI Compliance**: Use Stripe's secure tokenization
- **Webhook Verification**: Validate Stripe webhooks
- **Refund Handling**: Automated refund processing

### 5. Email System

#### Email Templates
- **Welcome Email**: Account creation
- **Verification Email**: Email confirmation
- **Password Reset**: Reset instructions
- **Application Status**: Status updates
- **Payment Confirmation**: Payment receipts

#### Email Service Requirements
- **Delivery Rate**: 99%+ delivery success
- **Templates**: HTML templates with variables
- **Tracking**: Open rates, click tracking
- **Bounce Handling**: Automatic bounce management

## Database Schema

### Core Tables

#### Users Table
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_role AS ENUM ('student', 'university', 'admin');
\`\`\`

#### Student Profiles
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
  emergency_contact JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Universities
\`\`\`sql
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  website VARCHAR(255),
  established_year INTEGER,
  location JSONB NOT NULL,
  contact JSONB NOT NULL,
  accreditation JSONB,
  rankings JSONB,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

#### Applications
\`\`\`sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  program_id UUID NOT NULL,
  status application_status DEFAULT 'draft',
  personal_statement TEXT,
  academic_history JSONB,
  documents JSONB,
  payment_status payment_status DEFAULT 'pending',
  payment_id UUID,
  application_fee DECIMAL(10,2),
  submitted_at TIMESTAMP,
  reviewed_at TIMESTAMP,
  decision_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE application_status AS ENUM ('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
\`\`\`

### Indexes for Performance
\`\`\`sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Application queries
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_university ON applications(university_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_submitted ON applications(submitted_at);

-- University searches
CREATE INDEX idx_universities_name ON universities USING gin(to_tsvector('english', name));
CREATE INDEX idx_universities_location ON universities USING gin(location);
\`\`\`

## API Implementation Guidelines

### Middleware Stack
\`\`\`javascript
// Required middleware order
1. CORS configuration
2. Security headers (helmet)
3. Rate limiting
4. Body parsing
5. Authentication
6. Authorization
7. Validation
8. Route handlers
9. Error handling
\`\`\`

### Error Handling
\`\`\`javascript
// Standard error response
{
  "success": false,
  "error": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2023-01-01T00:00:00Z",
  "path": "/api/v1/endpoint"
}
\`\`\`

### Validation Rules
- **Email**: Valid email format, unique in system
- **Password**: 8+ chars, uppercase, lowercase, number
- **Phone**: International format validation
- **Files**: Type, size, malware scanning
- **Dates**: ISO 8601 format
- **UUIDs**: Valid UUID v4 format

## Security Requirements

### Authentication Security
- **Brute Force Protection**: Account lockout after 5 failed attempts
- **Session Security**: Secure, httpOnly cookies
- **Token Security**: Short-lived access tokens, secure refresh
- **Password Policy**: Enforce strong passwords

### Data Protection
- **Encryption**: Encrypt sensitive data at rest
- **HTTPS**: Force HTTPS in production
- **Input Sanitization**: Prevent XSS, SQL injection
- **File Security**: Scan uploads, restrict file types

### Access Control
- **Role-Based**: Implement proper RBAC
- **Resource-Level**: Users can only access their data
- **Admin Controls**: Audit logs for admin actions
- **API Rate Limiting**: Prevent abuse

## Performance Requirements

### Response Times
- **Authentication**: < 200ms
- **Data Retrieval**: < 500ms
- **File Upload**: < 5s for 10MB files
- **Search**: < 1s for complex queries

### Scalability
- **Concurrent Users**: Support 1000+ concurrent users
- **Database**: Optimize queries, use indexes
- **Caching**: Redis for frequently accessed data
- **File Storage**: CDN for static assets

### Monitoring
- **Health Checks**: Endpoint monitoring
- **Error Tracking**: Sentry or similar
- **Performance**: APM tools
- **Logs**: Structured logging with correlation IDs

## Deployment Requirements

### Environment Configuration
\`\`\`bash
# Production environment variables
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=secure-random-key
EMAIL_API_KEY=sendgrid-key
STRIPE_SECRET_KEY=stripe-key
AWS_ACCESS_KEY_ID=aws-key
\`\`\`

### Infrastructure
- **Server**: 2+ CPU cores, 4GB+ RAM
- **Database**: PostgreSQL with connection pooling
- **Cache**: Redis cluster for high availability
- **Load Balancer**: Nginx or AWS ALB
- **SSL Certificate**: Let's Encrypt or commercial

### Backup & Recovery
- **Database Backups**: Daily automated backups
- **File Backups**: Regular file system backups
- **Disaster Recovery**: Multi-region deployment
- **Monitoring**: 24/7 uptime monitoring

## Testing Requirements

### Test Coverage
- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: All API endpoints
- **End-to-End**: Critical user flows
- **Load Testing**: Performance under load

### Test Data
- **Fixtures**: Consistent test data
- **Mocking**: External service mocks
- **Cleanup**: Automated test cleanup
- **CI/CD**: Automated testing pipeline

This comprehensive requirements document ensures the backend implementation meets all functional and non-functional requirements for the CommonApply system.
\`\`\`

The project is now fully prepared for Express.js backend integration with:

## ✅ **Complete API Layer**
- **Authentication endpoints** ready for JWT implementation
- **Comprehensive type definitions** for all data structures
- **Centralized API client** with automatic token management
- **Service layer abstractions** for clean code organization

## 🔐 **Security Ready**
- **JWT token management** with refresh capabilities
- **Role-based access control** middleware integration
- **File upload security** with type and size validation
- **Error handling** with standardized responses

## 📚 **Complete Documentation**
- **API Integration Guide** with detailed examples
- **Backend Requirements** with technical specifications
- **Database schema** recommendations
- **Security guidelines** and best practices

The frontend is now ready to seamlessly connect with your Express.js backend using the defined API contracts!
