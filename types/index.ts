export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  budget: string;
  timePosted: string;
  bids: Bid[];
  category: string;
  images: string[];
  urgency: 'low' | 'medium' | 'high';
  status: 'posted' | 'bidding' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  customerId: string;
  providerId?: string;
  estimatedDuration: number; // in hours
  startTime?: Date;
  completedTime?: Date;
}

export interface Bid {
  id: string;
  jobId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  amount: string;
  message: string;
  timeSubmitted: string;
  status: 'pending' | 'accepted' | 'rejected';
  estimatedDuration: number;
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  distance?: string;
  hourlyRate: string;
  completedJobs: number;
  isVerified: boolean;
  badges: string[];
  description: string;
  qualifications: Qualification[];
  isOnline: boolean;
}

export interface Qualification {
  id: string;
  type: 'certificate' | 'license' | 'experience' | 'reference';
  title: string;
  description: string;
  imageUrl?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  dateAdded: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  jobId?: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'system';
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isProvider: boolean;
  rating?: number;
  reviewCount?: number;
  joinDate: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  revieweeId: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'bid_received' | 'bid_accepted' | 'job_started' | 'job_completed' | 'message' | 'security_alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}