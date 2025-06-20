# Application Integration Guide

This comprehensive guide helps frontend developers integrate with the CommonApply Backend application management system.

## Table of Contents
- [Authentication](#authentication)
- [Application Endpoints](#application-endpoints)
- [Application Data Structure](#application-data-structure)
- [Application Workflow](#application-workflow)
- [Integration Examples](#integration-examples)
- [Document Management](#document-management)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)

## Authentication

All application endpoints require JWT authentication. Include the token in the Authorization header:

```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Application Endpoints

### 1. List Applications
**Endpoint:** `GET /api/v1/applications`

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Items per page (max: 50)
- `status` (string) - Filter by application status
- `universityId` (string) - Filter by university ID
- `programId` (string) - Filter by program ID
- `search` (string) - Search in application content
- `sortBy` (string) - Sort field (created_at, updated_at, submitted_at)
- `sortOrder` (string) - Sort direction (asc, desc)

**Role-based Access:**
- **Students**: See only their own applications
- **University Admins**: See applications to their universities
- **System Admins**: See all applications

```javascript
const getApplications = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/api/v1/applications?${queryParams}`, {
    headers
  });
  return response.json();
};

// Usage examples
const myApplications = await getApplications();
const submittedApps = await getApplications({ status: 'submitted' });
const universityApps = await getApplications({ universityId: 'uuid-here' });
```

### 2. Create Application
**Endpoint:** `POST /api/v1/applications` (Student only)

```javascript
const createApplication = async (applicationData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications`, {
    method: 'POST',
    headers,
    body: JSON.stringify(applicationData)
  });
  return response.json();
};

// Example usage
const newApplication = await createApplication({
  universityId: "university-uuid-here",
  programId: "program-uuid-here",
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    dateOfBirth: "2000-01-01",
    nationality: "US",
    address: "123 Main St, City, State 12345"
  },
  academicInfo: {
    gpa: 3.8,
    graduationYear: 2023,
    schoolName: "Central High School",
    major: "Science",
    coursework: ["Mathematics", "Physics", "Chemistry"]
  },
  essays: [
    {
      question: "Why do you want to study this program?",
      answer: "I am passionate about computer science because..."
    },
    {
      question: "Describe your career goals",
      answer: "My goal is to become a software engineer..."
    }
  ],
  extracurriculars: [
    {
      activity: "Robotics Club",
      role: "President",
      duration: "2 years",
      description: "Led a team of 15 students in robotics competitions"
    }
  ],
  workExperience: [
    {
      company: "Tech Startup",
      position: "Intern",
      duration: "3 months",
      description: "Developed web applications using React"
    }
  ]
});
```

### 3. Get Application by ID
**Endpoint:** `GET /api/v1/applications/:id`

```javascript
const getApplicationById = async (applicationId) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}`, {
    headers
  });
  return response.json();
};
```

### 4. Update Application
**Endpoint:** `PUT /api/v1/applications/:id`

**Note:** Only draft applications can be updated. Submitted applications cannot be modified.

```javascript
const updateApplication = async (applicationId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updateData)
  });
  return response.json();
};

// Example: Update personal information
const updatedApp = await updateApplication('app-id', {
  personalInfo: {
    phone: "+1-555-0123",
    address: "456 New Address, City, State 67890"
  },
  additionalInfo: {
    interests: ["Programming", "Music", "Sports"]
  }
});
```

### 5. Submit Application
**Endpoint:** `POST /api/v1/applications/:id/submit` (Student only)

**Important:** This action changes the application status from "draft" to "submitted" and makes it uneditable.

```javascript
const submitApplication = async (applicationId) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}/submit`, {
    method: 'POST',
    headers
  });
  return response.json();
};

// Example with confirmation
const confirmAndSubmit = async (applicationId) => {
  const confirmed = window.confirm(
    'Are you sure you want to submit this application? You cannot edit it after submission.'
  );
  
  if (confirmed) {
    try {
      const result = await submitApplication(applicationId);
      if (result.success) {
        alert('Application submitted successfully!');
        // Redirect to application status page
        window.location.href = `/applications/${applicationId}`;
      }
    } catch (error) {
      alert('Error submitting application. Please try again.');
    }
  }
};
```

### 6. Document Upload (Planned)
**Endpoint:** `POST /api/v1/applications/:id/documents`

**Status:** Currently returns 501 Not Implemented. Document upload functionality is planned.

```javascript
// Future implementation
const uploadDocument = async (applicationId, file, documentType) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('type', documentType);
  
  const response = await fetch(`${API_BASE_URL}/api/v1/applications/${applicationId}/documents`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Don't set Content-Type for FormData
    },
    body: formData
  });
  return response.json();
};
```

## Application Data Structure

### Complete Application Object
```javascript
{
  id: "uuid",
  universityId: "university-uuid",
  programId: "program-uuid",
  studentId: "student-uuid",
  status: "draft", // draft, submitted, under_review, accepted, rejected, waitlisted, withdrawn
  
  // University and Program details (populated)
  university: {
    id: "uuid",
    name: "Tech University",
    slug: "tech-university",
    logo: "/images/universities/tech-logo.png"
  },
  program: {
    id: "uuid",
    name: "Bachelor of Computer Science",
    type: "Bachelor",
    level: "undergraduate",
    duration: 4
  },
  student: {
    id: "uuid",
    email: "john.doe@email.com",
    profile: {
      firstName: "John",
      lastName: "Doe"
    }
  },
  
  // Application data
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1234567890",
    dateOfBirth: "2000-01-01",
    nationality: "US",
    address: "123 Main St, City, State 12345",
    emergencyContact: {
      name: "Jane Doe",
      relationship: "Mother",
      phone: "+1234567891"
    }
  },
  
  academicInfo: {
    gpa: 3.8,
    graduationYear: 2023,
    schoolName: "Central High School",
    major: "Science",
    coursework: ["Mathematics", "Physics", "Chemistry"],
    achievements: ["Honor Roll", "Science Fair Winner"],
    testScores: {
      sat: 1450,
      act: 32,
      toefl: 105
    }
  },
  
  essays: [
    {
      question: "Why do you want to study this program?",
      answer: "I am passionate about computer science because...",
      wordCount: 500
    }
  ],
  
  extracurriculars: [
    {
      activity: "Robotics Club",
      role: "President",
      duration: "2 years",
      description: "Led a team of 15 students in robotics competitions"
    }
  ],
  
  workExperience: [
    {
      company: "Tech Startup",
      position: "Intern",
      duration: "3 months",
      description: "Developed web applications using React"
    }
  ],
  
  documents: [
    {
      id: "doc-uuid",
      name: "transcript.pdf",
      type: "transcript",
      fileUrl: "/uploads/applications/transcript.pdf",
      status: "pending", // pending, approved, rejected
      uploadedAt: "2024-06-15T10:30:00.000Z"
    }
  ],
  
  // Additional fields
  additionalInfo: {
    interests: ["Programming", "Music", "Sports"],
    languages: ["English", "Spanish"],
    references: [
      {
        name: "Dr. Smith",
        title: "Physics Teacher",
        email: "dr.smith@school.edu",
        phone: "+1234567892"
      }
    ]
  },
  
  // Status tracking
  submittedAt: "2024-06-15T14:30:00.000Z",
  reviewedAt: null,
  decisionAt: null,
  withdrawnAt: null,
  
  // Metadata
  createdAt: "2024-06-10T09:00:00.000Z",
  updatedAt: "2024-06-15T14:30:00.000Z"
}
```

## Application Workflow

### Application States
1. **draft** - Application created but not submitted (editable)
2. **submitted** - Application submitted for review (read-only)
3. **under_review** - University is reviewing the application
4. **accepted** - Application accepted
5. **rejected** - Application rejected
6. **waitlisted** - Application waitlisted
7. **withdrawn** - Application withdrawn by student

### Typical Workflow
```
CREATE → DRAFT → UPDATE (multiple times) → SUBMIT → UNDER_REVIEW → ACCEPTED/REJECTED/WAITLISTED
                                                                  ↓
                                                                WITHDRAWN (at any point)
```

## Integration Examples

### React Hook for Application Management

```javascript
import { useState, useEffect, useCallback } from 'react';

const useApplicationsAPI = () => {
  const [applications, setApplications] = useState([]);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await getApplications(filters);
      if (response.success) {
        setApplications(response.data.applications);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplicationById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await getApplicationById(id);
      if (response.success) {
        setCurrentApplication(response.data);
        return response.data;
      } else {
        setError(response.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewApplication = useCallback(async (applicationData) => {
    setLoading(true);
    try {
      const response = await createApplication(applicationData);
      if (response.success) {
        setApplications(prev => [...prev, response.data]);
        return response.data;
      } else {
        setError(response.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateExistingApplication = useCallback(async (id, updateData) => {
    setLoading(true);
    try {
      const response = await updateApplication(id, updateData);
      if (response.success) {
        setApplications(prev => 
          prev.map(app => app.id === id ? response.data : app)
        );
        if (currentApplication?.id === id) {
          setCurrentApplication(response.data);
        }
        return response.data;
      } else {
        setError(response.error);
        return null;
      }
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentApplication]);

  const submitExistingApplication = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await submitApplication(id);
      if (response.success) {
        setApplications(prev => 
          prev.map(app => app.id === id ? {...app, status: 'submitted'} : app)
        );
        if (currentApplication?.id === id) {
          setCurrentApplication(prev => ({...prev, status: 'submitted'}));
        }
        return true;
      } else {
        setError(response.error);
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentApplication]);

  return {
    applications,
    currentApplication,
    loading,
    error,
    fetchApplications,
    fetchApplicationById,
    createNewApplication,
    updateExistingApplication,
    submitExistingApplication,
    setError
  };
};
```

### Application Form Components

#### 1. Application Creation Form
```javascript
const ApplicationCreationForm = ({ programs, onSuccess }) => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: ''
  });
  
  const { createNewApplication, loading } = useApplicationsAPI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const program = programs.find(p => p.id === selectedProgram);
    if (!program) return;

    const applicationData = {
      universityId: program.university.id,
      programId: program.id,
      personalInfo
    };

    const result = await createNewApplication(applicationData);
    if (result) {
      onSuccess(result);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Start New Application</h2>
      
      <select
        value={selectedProgram}
        onChange={(e) => setSelectedProgram(e.target.value)}
        required
      >
        <option value="">Select a Program</option>
        {programs.map(program => (
          <option key={program.id} value={program.id}>
            {program.name} - {program.university.name}
          </option>
        ))}
      </select>

      <div className="personal-info">
        <h3>Personal Information</h3>
        <input
          type="text"
          placeholder="First Name"
          value={personalInfo.firstName}
          onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={personalInfo.lastName}
          onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={personalInfo.email}
          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={personalInfo.phone}
          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
          required
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={personalInfo.dateOfBirth}
          onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Nationality"
          value={personalInfo.nationality}
          onChange={(e) => setPersonalInfo({...personalInfo, nationality: e.target.value})}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Application'}
      </button>
    </form>
  );
};
```

#### 2. Application Editor
```javascript
const ApplicationEditor = ({ applicationId }) => {
  const { 
    currentApplication, 
    updateExistingApplication, 
    submitExistingApplication,
    fetchApplicationById,
    loading 
  } = useApplicationsAPI();

  const [formData, setFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchApplicationById(applicationId);
  }, [applicationId, fetchApplicationById]);

  useEffect(() => {
    if (currentApplication) {
      setFormData(currentApplication);
    }
  }, [currentApplication]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    const result = await updateExistingApplication(applicationId, formData);
    if (result) {
      setHasChanges(false);
      alert('Application saved successfully!');
    }
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to submit this application? You cannot edit it after submission.'
    );
    
    if (confirmed) {
      if (hasChanges) {
        await handleSave();
      }
      
      const success = await submitExistingApplication(applicationId);
      if (success) {
        alert('Application submitted successfully!');
      }
    }
  };

  if (!formData) return <div>Loading...</div>;

  const canEdit = formData.status === 'draft';

  return (
    <div className="application-editor">
      <div className="header">
        <h2>Application to {formData.program.name}</h2>
        <div className="status-badge status-{formData.status}">
          {formData.status.toUpperCase()}
        </div>
      </div>

      {canEdit && (
        <div className="action-buttons">
          <button 
            onClick={handleSave} 
            disabled={!hasChanges || loading}
          >
            Save Changes
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="submit-btn"
          >
            Submit Application
          </button>
        </div>
      )}

      <div className="form-sections">
        {/* Personal Information */}
        <section>
          <h3>Personal Information</h3>
          <div className="form-grid">
            <input
              type="text"
              value={formData.personalInfo?.firstName || ''}
              onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
              placeholder="First Name"
              disabled={!canEdit}
            />
            <input
              type="text"
              value={formData.personalInfo?.lastName || ''}
              onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
              placeholder="Last Name"
              disabled={!canEdit}
            />
            <input
              type="email"
              value={formData.personalInfo?.email || ''}
              onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
              placeholder="Email"
              disabled={!canEdit}
            />
            <input
              type="tel"
              value={formData.personalInfo?.phone || ''}
              onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
              placeholder="Phone"
              disabled={!canEdit}
            />
          </div>
        </section>

        {/* Academic Information */}
        <section>
          <h3>Academic Information</h3>
          <div className="form-grid">
            <input
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={formData.academicInfo?.gpa || ''}
              onChange={(e) => handleInputChange('academicInfo', 'gpa', parseFloat(e.target.value))}
              placeholder="GPA"
              disabled={!canEdit}
            />
            <input
              type="number"
              value={formData.academicInfo?.graduationYear || ''}
              onChange={(e) => handleInputChange('academicInfo', 'graduationYear', parseInt(e.target.value))}
              placeholder="Graduation Year"
              disabled={!canEdit}
            />
            <input
              type="text"
              value={formData.academicInfo?.schoolName || ''}
              onChange={(e) => handleInputChange('academicInfo', 'schoolName', e.target.value)}
              placeholder="School Name"
              disabled={!canEdit}
            />
          </div>
        </section>

        {/* Essays */}
        <section>
          <h3>Essays</h3>
          {formData.essays?.map((essay, index) => (
            <div key={index} className="essay-section">
              <h4>{essay.question}</h4>
              <textarea
                value={essay.answer || ''}
                onChange={(e) => {
                  const newEssays = [...(formData.essays || [])];
                  newEssays[index] = {...essay, answer: e.target.value};
                  setFormData(prev => ({...prev, essays: newEssays}));
                  setHasChanges(true);
                }}
                placeholder="Your answer..."
                disabled={!canEdit}
                rows={8}
              />
              <div className="word-count">
                {essay.answer?.split(' ').length || 0} words
              </div>
            </div>
          ))}
        </section>
      </div>

      {hasChanges && canEdit && (
        <div className="unsaved-changes-warning">
          You have unsaved changes. Don't forget to save!
        </div>
      )}
    </div>
  );
};
```

#### 3. Application List
```javascript
const ApplicationList = () => {
  const { applications, fetchApplications, loading, error } = useApplicationsAPI();
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });

  useEffect(() => {
    fetchApplications(filters);
  }, [filters, fetchApplications]);

  const getStatusColor = (status) => {
    const colors = {
      draft: '#ffa500',
      submitted: '#007bff',
      under_review: '#17a2b8',
      accepted: '#28a745',
      rejected: '#dc3545',
      waitlisted: '#ffc107',
      withdrawn: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="application-list">
      <div className="filters">
        <input
          type="text"
          placeholder="Search applications..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="under_review">Under Review</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="waitlisted">Waitlisted</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>

      <div className="applications-grid">
        {applications.map(application => (
          <div key={application.id} className="application-card">
            <div className="card-header">
              <h3>{application.program.name}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(application.status) }}
              >
                {application.status.toUpperCase()}
              </span>
            </div>
            
            <div className="card-body">
              <p><strong>University:</strong> {application.university.name}</p>
              <p><strong>Program Type:</strong> {application.program.type}</p>
              <p><strong>Created:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
              {application.submittedAt && (
                <p><strong>Submitted:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
              )}
            </div>
            
            <div className="card-actions">
              <a href={`/applications/${application.id}`} className="btn btn-primary">
                View Details
              </a>
              {application.status === 'draft' && (
                <a href={`/applications/${application.id}/edit`} className="btn btn-secondary">
                  Continue Editing
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="empty-state">
          <h3>No applications found</h3>
          <p>You haven't created any applications yet.</p>
          <a href="/applications/new" className="btn btn-primary">
            Start New Application
          </a>
        </div>
      )}
    </div>
  );
};
```

## Document Management

### Document Upload Component (Future Implementation)
```javascript
const DocumentUploader = ({ applicationId, documentType, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Only PDF, JPEG, and PNG files are allowed');
        return;
      }

      if (selectedFile.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadDocument(applicationId, file, documentType);
      if (result.success) {
        onUploadSuccess(result.data);
        setFile(null);
        alert('Document uploaded successfully!');
      }
    } catch (error) {
      alert('Error uploading document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-uploader">
      <h4>Upload {documentType}</h4>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {file && (
        <div className="file-info">
          <p><strong>Selected:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      )}
    </div>
  );
};
```

## Error Handling

```javascript
const handleApplicationError = (error, context = '') => {
  console.error(`Application API Error ${context}:`, error);
  
  switch (error.status) {
    case 400:
      return 'Invalid application data provided';
    case 401:
      // Redirect to login
      window.location.href = '/login';
      return 'Authentication required';
    case 403:
      return 'You do not have permission to perform this action';
    case 404:
      return 'Application not found';
    case 409:
      return 'Cannot modify submitted application';
    case 422:
      return 'Application data validation failed';
    case 500:
      return 'Server error. Please try again later';
    default:
      return 'An unexpected error occurred';
  }
};

// Usage in API calls
const safeApplicationCall = async (apiFunction, context = '') => {
  try {
    const response = await apiFunction();
    if (!response.ok) {
      const errorMessage = handleApplicationError(response, context);
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
```

## TypeScript Types

```typescript
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface AcademicInfo {
  gpa: number;
  graduationYear: number;
  schoolName: string;
  major?: string;
  coursework?: string[];
  achievements?: string[];
  testScores?: {
    sat?: number;
    act?: number;
    toefl?: number;
    ielts?: number;
  };
}

interface Essay {
  question: string;
  answer: string;
  wordCount?: number;
}

interface Extracurricular {
  activity: string;
  role: string;
  duration: string;
  description: string;
}

interface WorkExperience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  fileUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

interface Reference {
  name: string;
  title: string;
  email: string;
  phone: string;
}

type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'waitlisted' | 'withdrawn';

interface Application {
  id: string;
  universityId: string;
  programId: string;
  studentId: string;
  status: ApplicationStatus;
  
  university: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  
  program: {
    id: string;
    name: string;
    type: string;
    level: string;
    duration: number;
  };
  
  student: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  
  personalInfo: PersonalInfo;
  academicInfo: AcademicInfo;
  essays: Essay[];
  extracurriculars: Extracurricular[];
  workExperience: WorkExperience[];
  documents: Document[];
  
  additionalInfo?: {
    interests?: string[];
    languages?: string[];
    references?: Reference[];
  };
  
  submittedAt?: string;
  reviewedAt?: string;
  decisionAt?: string;
  withdrawnAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateApplicationData {
  universityId: string;
  programId: string;
  personalInfo: Partial<PersonalInfo>;
  academicInfo?: Partial<AcademicInfo>;
  essays?: Essay[];
  extracurriculars?: Extracurricular[];
  workExperience?: WorkExperience[];
  additionalInfo?: {
    interests?: string[];
    languages?: string[];
    references?: Reference[];
  };
}

interface ApplicationFilters {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
  universityId?: string;
  programId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ApplicationResponse {
  success: boolean;
  data: {
    applications: Application[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  meta: {
    timestamp: string;
  };
}
```

## Best Practices

### 1. Auto-Save Implementation
```javascript
const useAutoSave = (applicationId, formData, delay = 5000) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { updateExistingApplication } = useApplicationsAPI();

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const timeoutId = setTimeout(async () => {
      try {
        await updateExistingApplication(applicationId, formData);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [formData, hasUnsavedChanges, delay, applicationId, updateExistingApplication]);

  return { hasUnsavedChanges, setHasUnsavedChanges };
};
```

### 2. Progress Tracking
```javascript
const calculateApplicationProgress = (application) => {
  const sections = [
    'personalInfo',
    'academicInfo',
    'essays',
    'extracurriculars',
    'documents'
  ];

  let completedSections = 0;

  sections.forEach(section => {
    switch (section) {
      case 'personalInfo':
        if (application.personalInfo?.firstName && 
            application.personalInfo?.lastName && 
            application.personalInfo?.email) {
          completedSections++;
        }
        break;
      case 'academicInfo':
        if (application.academicInfo?.gpa && 
            application.academicInfo?.graduationYear) {
          completedSections++;
        }
        break;
      case 'essays':
        if (application.essays && application.essays.length > 0 && 
            application.essays.every(essay => essay.answer)) {
          completedSections++;
        }
        break;
      case 'extracurriculars':
        if (application.extracurriculars && application.extracurriculars.length > 0) {
          completedSections++;
        }
        break;
      case 'documents':
        if (application.documents && application.documents.length > 0) {
          completedSections++;
        }
        break;
    }
  });

  return Math.round((completedSections / sections.length) * 100);
};
```

### 3. Validation
```javascript
const validateApplication = (application) => {
  const errors = [];

  // Required personal info
  if (!application.personalInfo?.firstName) {
    errors.push('First name is required');
  }
  if (!application.personalInfo?.lastName) {
    errors.push('Last name is required');
  }
  if (!application.personalInfo?.email) {
    errors.push('Email is required');
  }

  // Academic info validation
  if (application.academicInfo?.gpa && 
      (application.academicInfo.gpa < 0 || application.academicInfo.gpa > 4)) {
    errors.push('GPA must be between 0 and 4');
  }

  // Essay validation
  if (application.essays) {
    application.essays.forEach((essay, index) => {
      if (!essay.answer || essay.answer.trim().length === 0) {
        errors.push(`Essay ${index + 1} is required`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
```

## Performance Optimization

### 1. Lazy Loading
```javascript
// Lazy load application editor
const ApplicationEditor = lazy(() => import('./ApplicationEditor'));

// Usage with Suspense
<Suspense fallback={<div>Loading editor...</div>}>
  <ApplicationEditor applicationId={applicationId} />
</Suspense>
```

### 2. Debounced Search
```javascript
const useDebouncedSearch = (callback, delay = 500) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm) {
        callback(searchTerm);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, callback, delay]);

  return [searchTerm, setSearchTerm];
};
```

## Support

For additional support or questions about application integration:
- Check the API documentation: `/docs/openapi.json`
- Review test files: `/tests/`
- Contact the development team

---

*Last updated: June 2024*