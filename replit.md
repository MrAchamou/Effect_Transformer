# Overview

The Visual Effects Transformer is a web application that transforms JavaScript visual effects by automatically integrating AI-powered enhancement modules. The system allows users to upload JavaScript effect files, select transformation levels (Standard, Professional, or Premium), and receive enhanced versions with improved performance, visual appeal, and intelligence. The application uses AI to analyze and reconstruct effects with modules ranging from basic optimization to advanced contextual adaptation and user preference learning.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React Single Page Application** built with Vite for fast development and optimized builds
- **Component-based structure** with reusable UI components using shadcn/ui design system
- **TanStack Query** for server state management and caching
- **Tailwind CSS** for styling with custom color schemes and responsive design
- **TypeScript** for type safety throughout the frontend

## Backend Architecture
- **Express.js REST API** handling file uploads, transformation requests, and status tracking
- **Modular service architecture** with separate services for AI transformation, file processing, and code validation
- **In-memory storage** using a Map-based storage system for transformation state management
- **Multer middleware** for secure file upload handling with validation
- **TypeScript** for backend type safety

## Data Management
- **Drizzle ORM** configured for PostgreSQL with schema definitions for transformations
- **Zod validation schemas** for request/response validation and type inference
- **File system storage** for uploaded and transformed JavaScript files
- **JSON configuration files** for transformation levels and module definitions

## AI Integration
- **Anthropic Claude API** integration for JavaScript code transformation
- **Three-tier transformation system** with increasing complexity:
  - Level 1 (Standard): 7 core modules for basic optimization
  - Level 2 (Professional): 13 modules including contextual adaptation
  - Level 3 (Premium): 23 modules with advanced AI features
- **Prompt engineering** with detailed transformation instructions for each level

## Code Processing Pipeline
- **File validation** ensuring JavaScript syntax and security checks
- **Content analysis** extracting visual properties and parameters from original effects
- **AI transformation** applying selected enhancement modules
- **Code optimization** with performance improvements and modern JavaScript features
- **Result packaging** with statistics and comparison data

## Security Measures
- **File type validation** restricting uploads to JavaScript files only
- **Code sanitization** detecting dangerous patterns and preventing execution of malicious code
- **Size limits** preventing oversized file uploads
- **Input validation** using Zod schemas for all API endpoints

# External Dependencies

## AI Services
- **Anthropic Claude API** (claude-sonnet-4-20250514) for advanced code transformation and analysis
- Requires `ANTHROPIC_API_KEY` environment variable for authentication

## Database
- **PostgreSQL** database configured through Drizzle ORM
- **Neon Database** serverless PostgreSQL for production deployments
- Requires `DATABASE_URL` environment variable

## Development Tools
- **Vite** for fast development server and optimized production builds
- **ESBuild** for server-side bundling and compilation
- **TypeScript compiler** for type checking and compilation

## UI Components
- **Radix UI** primitives for accessible, unstyled components
- **Lucide React** for consistent iconography
- **shadcn/ui** component library built on Radix UI and Tailwind CSS

## File Processing
- **Multer** for handling multipart form uploads
- **Node.js fs** module for file system operations
- **Path utilities** for secure file path handling

## Session Management
- **connect-pg-simple** for PostgreSQL-backed session storage (prepared for future authentication features)

## Validation and Type Safety
- **Zod** for runtime type validation and schema definition
- **Drizzle-Zod** for automatic schema generation from database models
- **TypeScript** for compile-time type checking across the entire stack