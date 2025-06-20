# Program Integration Guide

This guide provides complete integration instructions for frontend developers to work with the CommonApply Backend program endpoints.

## Table of Contents
- [Authentication](#authentication)
- [Program Endpoints](#program-endpoints)
- [Program Data Structure](#program-data-structure)
- [Integration Examples](#integration-examples)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)

## Authentication

All program endpoints require JWT authentication. Include the token in the Authorization header:

```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## Program Endpoints

### 1. List Programs
**Endpoint:** `GET /api/v1/programs`

**Query Parameters:**
- `page` (number, default: 1) - Page number for pagination
- `limit` (number, default: 10) - Items per page (max: 50)
- `universityId` (string) - Filter by university ID
- `type` (string) - Filter by program type
- `level` (string) - Filter by education level (undergraduate, graduate, doctoral)
- `search` (string) - Search in program name and description
- `sortBy` (string) - Sort field (name, duration, tuition, createdAt)
- `sortOrder` (string) - Sort direction (asc, desc)

**Example Request:**
```javascript
const getPrograms = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_BASE_URL}/api/v1/programs?${queryParams}`, {
    headers
  });
  return response.json();
};

// Usage examples
const allPrograms = await getPrograms();
const engineeringPrograms = await getPrograms({ 
  search: 'engineering', 
  level: 'undergraduate' 
});
const universityPrograms = await getPrograms({ 
  universityId: 'university-uuid-here' 
});
```

### 2. Get Program by ID
**Endpoint:** `GET /api/v1/programs/:id`

```javascript
const getProgramById = async (programId) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/programs/${programId}`, {
    headers
  });
  return response.json();
};
```

### 3. Get Program Types
**Endpoint:** `GET /api/v1/programs/types`

```javascript
const getProgramTypes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/v1/programs/types`, {
    headers
  });
  return response.json();
};
```

### 4. Create Program (University Admin Only)
**Endpoint:** `POST /api/v1/programs`

```javascript
const createProgram = async (programData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/programs`, {
    method: 'POST',
    headers,
    body: JSON.stringify(programData)
  });
  return response.json();
};

// Example usage
const newProgram = await createProgram({
  name: "Bachelor of Computer Science",
  description: "Comprehensive computer science program",
  universityId: "university-uuid-here",
  type: "Bachelor",
  level: "undergraduate",
  duration: 4,
  tuitionFee: 25000,
  currency: "USD",
  applicationDeadline: "2024-12-31T23:59:59Z",
  startDate: "2025-09-01T00:00:00Z",
  requirements: [
    "High school diploma",
    "SAT/ACT scores",
    "Letters of recommendation"
  ],
  eligibilityCriteria: {
    minimumGPA: 3.0,
    standardizedTestRequired: true,
    languageRequirements: "TOEFL 80+ or IELTS 6.5+"
  }
});
```

### 5. Update Program (University Admin Only)
**Endpoint:** `PUT /api/v1/programs/:id`

```javascript
const updateProgram = async (programId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/programs/${programId}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(updateData)
  });
  return response.json();
};
```

### 6. Delete Program (University Admin Only)
**Endpoint:** `DELETE /api/v1/programs/:id`

```javascript
const deleteProgram = async (programId) => {
  const response = await fetch(`${API_BASE_URL}/api/v1/programs/${programId}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
};
```

## Program Data Structure

### Program Object
```javascript
{
  id: "uuid",
  name: "Bachelor of Computer Science",
  description: "Comprehensive computer science program covering algorithms, data structures, and software engineering",
  university: {
    id: "uuid",
    name: "Tech University",
    slug: "tech-university",
    logo: "/images/universities/tech-logo.png"
  },
  type: "Bachelor",
  level: "undergraduate",
  duration: 4,
  tuitionFee: 25000,
  currency: "USD",
  applicationDeadline: "2024-12-31T23:59:59.000Z",
  startDate: "2025-09-01T00:00:00.000Z",
  requirements: [
    "High school diploma with minimum 3.0 GPA",
    "SAT score of 1200+ or ACT score of 26+",
    "Two letters of recommendation",
    "Personal essay"
  ],
  eligibilityCriteria: {
    minimumGPA: 3.0,
    standardizedTestRequired: true,
    languageRequirements: "TOEFL 80+ or IELTS 6.5+ for international students"
  },
  applicationCount: 150,
  acceptanceRate: 0.65,
  isActive: true,
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-06-20T14:20:00.000Z"
}
```

## Integration Examples

### React Hook for Program Management

```javascript
import { useState, useEffect } from 'react';

const useProgramsAPI = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrograms = async (filters = {}) => {
    setLoading(true);
    try {
      const response = await getPrograms(filters);
      if (response.success) {
        setPrograms(response.data.programs);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgramById = async (id) => {
    setLoading(true);
    try {
      const response = await getProgramById(id);
      if (response.success) {
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
  };

  return {
    programs,
    loading,
    error,
    fetchPrograms,
    fetchProgramById,
    setError
  };
};

// Usage in component
const ProgramList = () => {
  const { programs, loading, error, fetchPrograms } = useProgramsAPI();

  useEffect(() => {
    fetchPrograms();
  }, []);

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {programs.map(program => (
        <div key={program.id} className="program-card">
          <h3>{program.name}</h3>
          <p>{program.university.name}</p>
          <p>{program.type} • {program.duration} years</p>
          <p>${program.tuitionFee.toLocaleString()} {program.currency}</p>
        </div>
      ))}
    </div>
  );
};
```

### Program Search and Filter Component

```javascript
const ProgramSearch = () => {
  const [filters, setFilters] = useState({
    search: '',
    universityId: '',
    type: '',
    level: ''
  });
  const { programs, fetchPrograms } = useProgramsAPI();

  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchPrograms(filters);
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search programs..."
        value={filters.search}
        onChange={(e) => setFilters({...filters, search: e.target.value})}
      />
      
      <select
        value={filters.level}
        onChange={(e) => setFilters({...filters, level: e.target.value})}
      >
        <option value="">All Levels</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="graduate">Graduate</option>
        <option value="doctoral">Doctoral</option>
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters({...filters, type: e.target.value})}
      >
        <option value="">All Types</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Master">Master</option>
        <option value="PhD">PhD</option>
      </select>

      <button type="submit">Search</button>
    </form>
  );
};
```

### Program Creation Form (University Admin)

```javascript
const ProgramForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    level: 'undergraduate',
    duration: 4,
    tuitionFee: 0,
    currency: 'USD',
    applicationDeadline: '',
    startDate: '',
    requirements: [''],
    eligibilityCriteria: {
      minimumGPA: 0,
      standardizedTestRequired: false,
      languageRequirements: ''
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createProgram(formData);
      if (response.success) {
        onSuccess(response.data);
      }
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({...formData, requirements: newRequirements});
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Program Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />

      <textarea
        placeholder="Program Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />

      <select
        value={formData.level}
        onChange={(e) => setFormData({...formData, level: e.target.value})}
      >
        <option value="undergraduate">Undergraduate</option>
        <option value="graduate">Graduate</option>
        <option value="doctoral">Doctoral</option>
      </select>

      <input
        type="number"
        placeholder="Duration (years)"
        value={formData.duration}
        onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
      />

      <input
        type="number"
        placeholder="Tuition Fee"
        value={formData.tuitionFee}
        onChange={(e) => setFormData({...formData, tuitionFee: parseFloat(e.target.value)})}
      />

      <div>
        <h4>Requirements:</h4>
        {formData.requirements.map((req, index) => (
          <input
            key={index}
            type="text"
            value={req}
            onChange={(e) => updateRequirement(index, e.target.value)}
            placeholder={`Requirement ${index + 1}`}
          />
        ))}
        <button type="button" onClick={addRequirement}>Add Requirement</button>
      </div>

      <button type="submit">Create Program</button>
    </form>
  );
};
```

## Error Handling

```javascript
const handleAPIError = (response) => {
  switch (response.status) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 403:
      throw new Error('You do not have permission to perform this action');
    case 404:
      throw new Error('Program not found');
    case 422:
      throw new Error('Invalid program data provided');
    case 500:
      throw new Error('Server error. Please try again later');
    default:
      throw new Error('An unexpected error occurred');
  }
};

const safeAPICall = async (apiFunction) => {
  try {
    const response = await apiFunction();
    if (!response.ok) {
      handleAPIError(response);
    }
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## TypeScript Types

```typescript
interface University {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

interface EligibilityCriteria {
  minimumGPA: number;
  standardizedTestRequired: boolean;
  languageRequirements?: string;
}

interface Program {
  id: string;
  name: string;
  description: string;
  university: University;
  type: string;
  level: 'undergraduate' | 'graduate' | 'doctoral';
  duration: number;
  tuitionFee: number;
  currency: string;
  applicationDeadline: string;
  startDate: string;
  requirements: string[];
  eligibilityCriteria: EligibilityCriteria;
  applicationCount: number;
  acceptanceRate: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProgramFilters {
  page?: number;
  limit?: number;
  universityId?: string;
  type?: string;
  level?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ProgramResponse {
  success: boolean;
  data: {
    programs: Program[];
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

interface CreateProgramData {
  name: string;
  description: string;
  type: string;
  level: 'undergraduate' | 'graduate' | 'doctoral';
  duration: number;
  tuitionFee: number;
  currency: string;
  applicationDeadline: string;
  startDate: string;
  requirements: string[];
  eligibilityCriteria: EligibilityCriteria;
}
```

## Best Practices

1. **Caching**: Implement client-side caching for program data to reduce API calls
2. **Pagination**: Always handle pagination for large datasets
3. **Error Boundaries**: Use React error boundaries to handle API errors gracefully
4. **Loading States**: Show loading indicators during API calls
5. **Debouncing**: Debounce search inputs to avoid excessive API calls
6. **Validation**: Validate form data before sending to API
7. **Optimistic Updates**: Update UI optimistically for better user experience

## Rate Limiting

The API may have rate limiting in place. Handle rate limit responses (429 status) by implementing exponential backoff:

```javascript
const apiCallWithRetry = async (apiFunction, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiFunction();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (2 ** i)));
        continue;
      }
      throw error;
    }
  }
};
```

## Support

For additional support or questions about program integration:
- Check the API documentation: `/docs/openapi.json`
- Review test files: `/tests/`
- Contact the development team

---

*Last updated: June 2024*