# CommonApply - Routes and Role-Based Access Control

## Overview

This document provides a comprehensive guide to all routes in the CommonApply Next.js application and their role-based access requirements. The application uses a three-tier authentication system with specific route protections for different user types.

## Authentication System

### User Roles
- **`student`** - Regular users who apply to universities
- **`university`** - University administrators who manage their institution
- **`admin`** - System administrators who oversee the entire platform

### Protection Mechanisms
1. **Middleware-level protection** - Route-based access control
2. **Component-level protection** - Fine-grained access control
3. **Redirect logic** - Automatic routing based on user role

---

## 🔓 Public Routes
*No authentication required*

| Route | Description | Features |
|-------|-------------|----------|
| `/` | Homepage | Platform overview, registration prompts |
| `/about` | About page | Platform information |
| `/blog` | Blog listing | Public blog posts |
| `/blog/[slug]` | Individual blog posts | Article content |
| `/contact` | Contact page | Contact form and information |
| `/colleges` | University listing | Browse available universities |
| `/universities/[slug]` | University profile | University details and programs |
| `/universities/[slug]/programs` | Programs listing | Available programs |
| `/universities/[slug]/programs/[programId]` | Program details | Specific program information |
| `/apply` | Application landing | Application process overview |
| `/cookies` | Cookie policy | Privacy policy |
| `/privacy` | Privacy policy | Data handling policy |
| `/terms` | Terms of service | Legal terms |
| `/test-credentials` | Test credentials | Development test accounts |
| `/unauthorized` | Access denied | Error page for unauthorized access |
| `/debug-auth` | Auth debugging | Development authentication info |

---

## 🔐 Authentication Routes
*Redirects authenticated users to their dashboard*

| Route | Description | Redirect Behavior |
|-------|-------------|-------------------|
| `/auth/sign-in` | Sign in page | → Role-based dashboard |
| `/auth/create-account` | Registration page | → Role-based dashboard |
| `/auth/forgot-password` | Password recovery | → Role-based dashboard |
| `/auth/reset-password` | Password reset | → Role-based dashboard |
| `/auth/verify-email` | Email verification | → Role-based dashboard |
| `/auth/verification-success` | Verification success | → Role-based dashboard |
| `/auth/verification-error` | Verification error | → Role-based dashboard |
| `/auth/password-reset-success` | Reset success | → Role-based dashboard |

### Redirect Logic
- **`admin`** → `/system-admin/dashboard`
- **`university`** → `/admin/dashboard`
- **`student`** → `/student/dashboard`

---

## 👨‍🎓 Student Routes
*Requires `student` role*

| Route | Description | Features |
|-------|-------------|----------|
| `/student` | Student landing | Dashboard overview |
| `/student/dashboard` | Main dashboard | Applications, deadlines, quick actions |
| `/student/profile` | Profile management | Personal info, preferences, settings |
| `/student/applications` | Applications overview | View and track application status |
| `/student/applications/new` | Create application | Multi-step application form |
| `/student/compare` | University comparison | Compare selected universities |
| `/student/announcements` | Announcements | Messages from universities |
| `/student/messages` | Messaging system | Communication with universities |
| `/student/notifications` | Notifications | System and application notifications |
| `/student/payments` | Payment management | Application fees, payment history |
| `/student/payments/[id]` | Payment details | Individual payment information |
| `/student/feedback` | Feedback system | Platform feedback and suggestions |

### Student Capabilities
- ✅ Apply to universities
- ✅ Track application status
- ✅ Manage personal profile
- ✅ View university announcements
- ✅ Make payments for applications
- ✅ Compare universities
- ✅ Provide platform feedback

---

## 🏛️ University Admin Routes
*Requires `university` role*

| Route | Description | Features |
|-------|-------------|----------|
| `/admin/dashboard` | University dashboard | Applications overview, analytics |
| `/admin/profile` | Institution profile | University information management |
| `/admin/applications` | Application management | Review, accept/reject applications |
| `/admin/forms` | Form management | Create and manage admission forms |
| `/admin/forms/create` | Create new form | Form builder interface |
| `/admin/forms/[id]/edit` | Edit existing form | Form editor with validation |
| `/admin/forms/templates` | Form templates | Template library and management |
| `/admin/forms/templates/create` | Create template | Template builder |
| `/admin/announcements` | Announcements | Send announcements to students |
| `/admin/blog` | Blog management | University blog post management |
| `/admin/blog/create` | Create blog post | Blog editor with rich text |
| `/admin/messages` | Messaging system | Communication with applicants |
| `/admin/notifications` | Notifications | Manage notification templates |
| `/admin/settings` | University settings | Institution preferences and config |
| `/admin/verification/status` | Verification status | University verification tracking |
| `/admin/surveys/analytics` | Survey analytics | Survey data and insights |

### University Admin Capabilities
- ✅ Review and process applications
- ✅ Create custom admission forms
- ✅ Manage university profile and information
- ✅ Send announcements to applicants
- ✅ Create and manage blog content
- ✅ Communicate with prospective students
- ✅ Track verification status
- ✅ Analyze survey data

---

## ⚙️ System Admin Routes
*Requires `admin` role*

| Route | Description | Features |
|-------|-------------|----------|
| `/system-admin/dashboard` | System dashboard | Platform overview, metrics, monitoring |
| `/system-admin/profile` | Admin profile | Administrator account settings |
| `/system-admin/users` | User management | Manage all platform users |
| `/system-admin/universities` | University management | Approve and manage universities |
| `/system-admin/universities/create` | Add university | University creation form |
| `/system-admin/universities/[id]` | University details | Individual university management |
| `/system-admin/forms-monitor` | Forms monitoring | Monitor all platform forms |
| `/system-admin/payments` | Payment management | Transaction monitoring, gateway settings |
| `/system-admin/notifications` | System notifications | Platform-wide notification management |
| `/system-admin/security` | Security management | Security settings, access logs |
| `/system-admin/settings` | System settings | Platform configuration |
| `/system-admin/surveys` | Survey management | System-wide survey management |
| `/system-admin/sorting-algorithm` | Algorithm management | Algorithm configuration |
| `/system-admin/verification` | Verification oversight | User/university verification management |

### System Admin Capabilities
- ✅ Manage all users across the platform
- ✅ Approve and verify universities
- ✅ Monitor all forms and applications
- ✅ Manage payment gateways and transactions
- ✅ Configure platform-wide settings
- ✅ Oversee security and access controls
- ✅ Manage system notifications
- ✅ Configure sorting algorithms
- ✅ Handle verification processes

---

## Middleware Protection Logic

### Route Protection Patterns
```typescript
// System Admin routes
if (pathname.startsWith("/system-admin")) {
  if (userRole !== "admin") return redirect("/unauthorized")
}

// University Admin routes  
if (pathname.startsWith("/admin")) {
  if (userRole !== "university") return redirect("/unauthorized")
}

// Student routes
if (pathname.startsWith("/student")) {
  if (userRole !== "student") return redirect("/unauthorized")
}
```

### Authentication Flow
1. **Unauthenticated users** → Redirected to `/auth/sign-in`
2. **Wrong role access** → Redirected to `/unauthorized`
3. **Correct role access** → Route accessible
4. **Authenticated users on auth pages** → Redirected to appropriate dashboard

---

## Test Credentials

### Student Accounts
- **Email:** `student@test.com` **Password:** `Student123`
- **Email:** `jane.smith@test.com` **Password:** `Student456`

### University Admin Accounts
- **Email:** `admin@aait.edu.et` **Password:** `Admin123`
- **Email:** `admin@mu.edu.et` **Password:** `Admin456`

### System Admin Account
- **Contact backend team for admin credentials**

---

## Route Statistics

| Category | Count | Percentage |
|----------|-------|------------|
| **Total Routes** | 80+ | 100% |
| **Public Routes** | 15 | ~19% |
| **Auth Routes** | 8 | ~10% |
| **Student Routes** | 12 | ~15% |
| **University Admin Routes** | 15 | ~19% |
| **System Admin Routes** | 14 | ~18% |
| **Dynamic Routes** | 15+ | ~19% |

---

## Security Features

### Route Protection
- ✅ **Middleware-level** route protection
- ✅ **Role-based** access control
- ✅ **JWT token** validation
- ✅ **Automatic redirects** for unauthorized access

### Authentication Features
- ✅ **Secure login** with JWT tokens
- ✅ **Email verification** for new accounts
- ✅ **Password reset** functionality
- ✅ **Session management** with refresh tokens

### Authorization Features
- ✅ **Role-based permissions** for different user types
- ✅ **Protected routes** based on user roles
- ✅ **Granular access control** within applications
- ✅ **Unauthorized access handling**

---

## Usage Guidelines

### For Developers
1. **Adding new routes:** Follow the established patterns (`/student/*`, `/admin/*`, `/system-admin/*`)
2. **Route protection:** Use middleware for route-level protection
3. **Component protection:** Use `useAuth` hooks for component-level protection
4. **Testing:** Use provided test credentials for different roles

### For Users
1. **Registration:** Choose appropriate role during account creation
2. **Navigation:** Routes are automatically filtered based on your role
3. **Access:** Attempting to access unauthorized routes will redirect to error page
4. **Security:** Always log out when finished, especially on shared devices

---

## Future Enhancements

### Planned Features
- [ ] **Sub-roles** within existing roles (e.g., `senior-admin`, `junior-admin`)
- [ ] **Permission-based access** in addition to role-based access
- [ ] **Temporary access** for specific routes
- [ ] **Route analytics** and access logging
- [ ] **API route protection** with same role system

### Considerations
- [ ] **Multi-role users** (users with multiple roles)
- [ ] **Role inheritance** (admins having access to lower-level routes)
- [ ] **Dynamic role assignment** (changing roles without re-authentication)
- [ ] **Audit logging** for route access and role changes