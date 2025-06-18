# Common App Web

A comprehensive university application platform built with Next.js, TypeScript, and modern web technologies.

## Features

- **Multi-role Authentication**: Support for students, universities, and system administrators
- **University Search & Comparison**: Advanced search with filtering and comparison tools
- **Application Management**: Complete application workflow from submission to review
- **Payment Processing**: Integrated payment gateway for application fees
- **Admin Dashboard**: Comprehensive admin tools for managing universities and applications
- **Responsive Design**: Mobile-first design with modern UI components

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Form Handling**: React Hook Form, Zod validation
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library
- **Development**: ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd common-app-web
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

This project includes comprehensive tests for all major components, utilities, and functionality.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD (with coverage and no watch)
npm run test:ci
```

### Test Structure

The test suite is organized as follows:

```
├── __tests__/
│   └── integration/          # Integration tests
├── components/
│   └── __tests__/           # Component tests
├── hooks/
│   └── __tests__/           # Custom hooks tests
├── lib/
│   ├── __tests__/           # Utility function tests
│   ├── services/__tests__/  # Service class tests
│   └── validations/__tests__/ # Validation schema tests
├── store/
│   └── __tests__/           # State management tests
├── jest.config.js           # Jest configuration
└── jest.setup.js            # Test setup and mocks
```

### Test Categories

1. **Unit Tests**: Individual components, functions, and utilities
2. **Integration Tests**: Page rendering and component interaction
3. **Hook Tests**: Custom React hooks behavior
4. **Validation Tests**: Zod schema validation
5. **Service Tests**: Business logic and API interactions
6. **Store Tests**: State management functionality

### Key Test Features

- **Comprehensive Mocking**: All external dependencies are properly mocked
- **Authentication Testing**: Tests for different user roles and auth states
- **Responsive Testing**: Tests for different viewport sizes
- **Error Handling**: Tests for error boundaries and edge cases
- **Accessibility**: Basic accessibility testing included

### Coverage Goals

- **Components**: 90%+ coverage for all UI components
- **Utilities**: 95%+ coverage for all utility functions
- **Hooks**: 100% coverage for custom hooks
- **Services**: 85%+ coverage for business logic
- **Validation**: 100% coverage for schema validation

### Writing New Tests

When adding new features, ensure you:

1. Add unit tests for new components
2. Test all props and user interactions
3. Mock external dependencies appropriately
4. Test error states and edge cases
5. Maintain high test coverage

Example test structure:
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { YourComponent } from '../your-component'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    const mockFn = jest.fn()
    render(<YourComponent onClick={mockFn} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockFn).toHaveBeenCalledTimes(1)
  })
})
```

## Project Structure

```
├── app/                     # Next.js app directory
│   ├── (routes)/           # Route groups
│   ├── admin/              # University admin pages
│   ├── student/            # Student pages
│   ├── system-admin/       # System admin pages
│   └── globals.css         # Global styles
├── components/             # Reusable components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Custom components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and configurations
│   ├── api/                # API client and endpoints
│   ├── services/           # Business logic services
│   ├── validations/        # Zod schemas
│   └── utils/              # Utility functions
├── store/                  # Zustand stores
├── types/                  # TypeScript type definitions
└── data/                   # Mock data and configurations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ci` - Run tests for CI/CD

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
