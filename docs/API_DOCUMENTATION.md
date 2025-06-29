# PieceJob API Documentation

## Overview

This document outlines the API structure and data models used in the PieceJob application. Currently implemented as a mock service layer, this serves as the blueprint for future backend implementation.

## Data Models

### Job Model

```typescript
interface Job {
  id: string;                    // Unique identifier
  title: string;                 // Job title
  description: string;           // Detailed description
  location: string;              // Human-readable location
  coordinates?: {                // GPS coordinates
    latitude: number;
    longitude: number;
  };
  budget: string;                // Budget range (e.g., "R500 - R800")
  timePosted: string;            // Relative time (e.g., "2 hours ago")
  bids: Bid[];                   // Array of submitted bids
  category: string;              // Job category
  images: string[];              // Array of image URLs
  urgency: 'low' | 'medium' | 'high';  // Priority level
  status: 'posted' | 'bidding' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  customerId: string;            // Customer who posted the job
  providerId?: string;           // Assigned provider (if confirmed)
  estimatedDuration: number;     // Expected duration in hours
  startTime?: Date;              // Job start timestamp
  completedTime?: Date;          // Job completion timestamp
}
```

### Bid Model

```typescript
interface Bid {
  id: string;                    // Unique identifier
  jobId: string;                 // Associated job ID
  providerId: string;            // Provider who submitted bid
  providerName: string;          // Provider display name
  providerAvatar: string;        // Provider profile image URL
  amount: string;                // Bid amount (e.g., "R750")
  message: string;               // Proposal message
  timeSubmitted: string;         // Submission time
  status: 'pending' | 'accepted' | 'rejected';  // Bid status
  estimatedDuration: number;     // Provider's time estimate
}
```

### Provider Model

```typescript
interface Provider {
  id: string;                    // Unique identifier
  name: string;                  // Full name
  avatar: string;                // Profile image URL
  rating: number;                // Average rating (0-5)
  reviewCount: number;           // Total reviews received
  specialty: string;             // Primary service category
  location: string;              // Base location
  coordinates?: {                // GPS coordinates
    latitude: number;
    longitude: number;
  };
  distance?: string;             // Distance from user (calculated)
  hourlyRate: string;            // Standard rate (e.g., "R180/hour")
  completedJobs: number;         // Total completed jobs
  isVerified: boolean;           // Verification status
  badges: string[];              // Achievement badges
  description: string;           // Profile description
  qualifications: Qualification[]; // Certifications and credentials
  isOnline: boolean;             // Current availability status
}
```

### Message Model

```typescript
interface Message {
  id: string;                    // Unique identifier
  senderId: string;              // Message sender ID
  receiverId: string;            // Message recipient ID
  jobId?: string;                // Associated job (optional)
  content: string;               // Message content
  timestamp: string;             // ISO timestamp
  type: 'text' | 'image' | 'system';  // Message type
  read: boolean;                 // Read status
}
```

### User Model

```typescript
interface User {
  id: string;                    // Unique identifier
  name: string;                  // Full name
  email: string;                 // Email address
  avatar?: string;               // Profile image URL
  location: string;              // Primary location
  coordinates?: {                // GPS coordinates
    latitude: number;
    longitude: number;
  };
  isProvider: boolean;           // Provider vs customer flag
  rating?: number;               // Average rating (for providers)
  reviewCount?: number;          // Total reviews
  joinDate: string;              // Registration date
  verificationStatus: 'pending' | 'verified' | 'rejected';
}
```

## Service Layer Methods

### DataService

#### Job Management

```typescript
// Get jobs with optional location filtering
async getJobs(userLocation?: LocationCoords, radiusKm?: number): Promise<Job[]>

// Get specific job by ID
async getJobById(id: string): Promise<Job | null>

// Create new job posting
async createJob(jobData: Omit<Job, 'id' | 'bids' | 'timePosted' | 'status'>): Promise<Job>

// Update job status
async updateJobStatus(jobId: string, status: Job['status']): Promise<void>
```

#### Bid Management

```typescript
// Get all bids for a specific job
async getBidsForJob(jobId: string): Promise<Bid[]>

// Submit new bid
async createBid(bidData: Omit<Bid, 'id' | 'timeSubmitted' | 'status'>): Promise<Bid>

// Accept a bid (also updates job status)
async acceptBid(bidId: string): Promise<void>
```

#### Provider Management

```typescript
// Get providers with location filtering
async getProviders(userLocation?: LocationCoords, radiusKm?: number): Promise<Provider[]>

// Get specific provider by ID
async getProviderById(id: string): Promise<Provider | null>
```

#### Messaging

```typescript
// Get messages for a specific job
async getMessagesForJob(jobId: string): Promise<Message[]>

// Send new message
async sendMessage(messageData: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message>
```

#### Notifications

```typescript
// Get user notifications
async getNotifications(userId: string): Promise<Notification[]>

// Create new notification
async createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification>

// Mark notification as read
async markNotificationAsRead(notificationId: string): Promise<void>
```

### LocationService

```typescript
// Request location permissions
static async requestPermissions(): Promise<boolean>

// Get current GPS coordinates
static async getCurrentLocation(): Promise<LocationCoords | null>

// Calculate distance between two points
static calculateDistance(coord1: LocationCoords, coord2: LocationCoords): number

// Format distance for display
static formatDistance(distance: number): string

// Check if point is within radius
static isWithinRadius(center: LocationCoords, point: LocationCoords, radiusKm: number): boolean
```

### NotificationService

```typescript
// Request notification permissions
static async requestPermissions(): Promise<boolean>

// Schedule notification
static async scheduleNotification(
  title: string, 
  body: string, 
  data?: any, 
  trigger?: NotificationTriggerInput
): Promise<string | null>

// Cancel scheduled notification
static async cancelNotification(notificationId: string): Promise<void>

// Setup notification handler
static setupNotificationHandler(): void
```

## Error Handling

### Standard Error Responses

```typescript
interface APIError {
  code: string;
  message: string;
  details?: any;
}

// Common error codes
const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER_ERROR: 'SERVER_ERROR'
};
```

### Error Handling Pattern

```typescript
try {
  const result = await dataService.getJobs();
  // Handle success
} catch (error) {
  console.error('Error loading jobs:', error);
  // Show user-friendly error message
  Alert.alert('Error', 'Failed to load jobs. Please try again.');
}
```

## Data Validation

### Input Validation Rules

```typescript
// Job creation validation
const validateJobData = (data: any): string[] => {
  const errors: string[] = [];
  
  if (!data.title?.trim()) errors.push('Title is required');
  if (!data.description?.trim()) errors.push('Description is required');
  if (!data.location?.trim()) errors.push('Location is required');
  if (!data.budget?.trim()) errors.push('Budget is required');
  if (!data.category) errors.push('Category is required');
  if (!data.images?.length) errors.push('At least one image is required');
  if (!data.estimatedDuration || data.estimatedDuration <= 0) {
    errors.push('Valid duration is required');
  }
  
  return errors;
};
```

## Future API Considerations

### Authentication

```typescript
// JWT token structure
interface AuthToken {
  userId: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  exp: number;
}

// Auth endpoints (future implementation)
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
```

### Real-time Features

```typescript
// WebSocket events (future implementation)
interface SocketEvents {
  'bid:new': (bid: Bid) => void;
  'job:updated': (job: Job) => void;
  'message:new': (message: Message) => void;
  'notification:new': (notification: Notification) => void;
}
```

### File Upload

```typescript
// File upload endpoints (future implementation)
POST /upload/image
POST /upload/document
DELETE /upload/:fileId
```

This API documentation provides the foundation for implementing a robust backend service for the PieceJob platform.