import { Job, Bid, Provider, User, Message, Review, Notification } from '@/types';
import { LocationService, LocationCoords } from './locationService';

// Mock data storage - In production, this would be replaced with actual API calls
class DataService {
  private jobs: Job[] = [];
  private bids: Bid[] = [];
  private providers: Provider[] = [];
  private users: User[] = [];
  private messages: Message[] = [];
  private reviews: Review[] = [];
  private notifications: Notification[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with existing mock data
    this.jobs = [
      {
        id: '1',
        title: 'Deep Clean 3-Bedroom House',
        description: 'Need a thorough cleaning of my 3-bedroom house in Sandton. Kitchen, bathrooms, and all living areas.',
        location: 'Sandton, Johannesburg',
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        budget: 'R800 - R1200',
        timePosted: '2 hours ago',
        bids: [],
        category: 'Cleaning',
        images: ['https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=400'],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer1',
        estimatedDuration: 4
      },
      {
        id: '2',
        title: 'Garden Maintenance & Lawn Care',
        description: 'Weekly garden maintenance needed. Trimming hedges, lawn mowing, and general garden cleanup.',
        location: 'Rosebank, Johannesburg',
        coordinates: { latitude: -26.1448, longitude: 28.0436 },
        budget: 'R400 - R600',
        timePosted: '4 hours ago',
        bids: [],
        category: 'Gardening',
        images: ['https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400'],
        urgency: 'low',
        status: 'posted',
        customerId: 'customer1',
        estimatedDuration: 3
      }
    ];

    this.providers = [
      {
        id: 'provider1',
        name: 'Sarah Mokoena',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        reviewCount: 127,
        specialty: 'Deep Cleaning',
        location: 'Sandton',
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        hourlyRate: 'R180/hour',
        completedJobs: 245,
        isVerified: true,
        badges: ['Top Rated', 'Quick Response'],
        description: 'Professional cleaner with 8+ years experience. Specializing in residential deep cleaning and move-in/out services.',
        qualifications: [],
        isOnline: true
      },
      {
        id: 'provider2',
        name: 'Themba Dlamini',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        reviewCount: 89,
        specialty: 'Garden Maintenance',
        location: 'Rosebank',
        coordinates: { latitude: -26.1448, longitude: 28.0436 },
        hourlyRate: 'R150/hour',
        completedJobs: 156,
        isVerified: true,
        badges: ['Eco-Friendly', 'Reliable'],
        description: 'Experienced gardener with expertise in lawn care, hedge trimming, and landscape maintenance.',
        qualifications: [],
        isOnline: true
      }
    ];
  }

  // Job methods
  async getJobs(userLocation?: LocationCoords, radiusKm: number = 10): Promise<Job[]> {
    let filteredJobs = [...this.jobs];

    if (userLocation) {
      filteredJobs = filteredJobs.filter(job => {
        if (!job.coordinates) return true;
        return LocationService.isWithinRadius(userLocation, job.coordinates, radiusKm);
      });

      // Add distance to jobs
      filteredJobs = filteredJobs.map(job => ({
        ...job,
        distance: job.coordinates 
          ? LocationService.formatDistance(LocationService.calculateDistance(userLocation, job.coordinates))
          : undefined
      }));
    }

    return filteredJobs;
  }

  async getJobById(id: string): Promise<Job | null> {
    return this.jobs.find(job => job.id === id) || null;
  }

  async createJob(jobData: Omit<Job, 'id' | 'bids' | 'timePosted' | 'status'>): Promise<Job> {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      bids: [],
      timePosted: 'Just now',
      status: 'posted'
    };

    this.jobs.unshift(newJob);
    return newJob;
  }

  async updateJobStatus(jobId: string, status: Job['status']): Promise<void> {
    const jobIndex = this.jobs.findIndex(job => job.id === jobId);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].status = status;
      if (status === 'in-progress') {
        this.jobs[jobIndex].startTime = new Date();
      } else if (status === 'completed') {
        this.jobs[jobIndex].completedTime = new Date();
      }
    }
  }

  // Bid methods
  async getBidsForJob(jobId: string): Promise<Bid[]> {
    return this.bids.filter(bid => bid.jobId === jobId);
  }

  async createBid(bidData: Omit<Bid, 'id' | 'timeSubmitted' | 'status'>): Promise<Bid> {
    const newBid: Bid = {
      ...bidData,
      id: Date.now().toString(),
      timeSubmitted: 'Just now',
      status: 'pending'
    };

    this.bids.push(newBid);
    
    // Update job's bids array
    const jobIndex = this.jobs.findIndex(job => job.id === bidData.jobId);
    if (jobIndex !== -1) {
      this.jobs[jobIndex].bids.push(newBid);
    }

    return newBid;
  }

  async acceptBid(bidId: string): Promise<void> {
    const bidIndex = this.bids.findIndex(bid => bid.id === bidId);
    if (bidIndex !== -1) {
      const bid = this.bids[bidIndex];
      bid.status = 'accepted';

      // Update job status and assign provider
      const jobIndex = this.jobs.findIndex(job => job.id === bid.jobId);
      if (jobIndex !== -1) {
        this.jobs[jobIndex].status = 'confirmed';
        this.jobs[jobIndex].providerId = bid.providerId;
      }

      // Reject other bids for the same job
      this.bids.forEach(b => {
        if (b.jobId === bid.jobId && b.id !== bidId) {
          b.status = 'rejected';
        }
      });
    }
  }

  // Provider methods
  async getProviders(userLocation?: LocationCoords, radiusKm: number = 10): Promise<Provider[]> {
    let filteredProviders = [...this.providers];

    if (userLocation) {
      filteredProviders = filteredProviders.filter(provider => {
        if (!provider.coordinates) return true;
        return LocationService.isWithinRadius(userLocation, provider.coordinates, radiusKm);
      });

      // Add distance to providers
      filteredProviders = filteredProviders.map(provider => ({
        ...provider,
        distance: provider.coordinates 
          ? LocationService.formatDistance(LocationService.calculateDistance(userLocation, provider.coordinates))
          : undefined
      }));
    }

    return filteredProviders;
  }

  async getProviderById(id: string): Promise<Provider | null> {
    return this.providers.find(provider => provider.id === id) || null;
  }

  // Message methods
  async getMessagesForJob(jobId: string): Promise<Message[]> {
    return this.messages.filter(message => message.jobId === jobId);
  }

  async sendMessage(messageData: Omit<Message, 'id' | 'timestamp' | 'read'>): Promise<Message> {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    this.messages.push(newMessage);
    return newMessage;
  }

  // Notification methods
  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter(notification => notification.userId === userId);
  }

  async createNotification(notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>): Promise<Notification> {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };

    this.notifications.unshift(newNotification);
    return newNotification;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const notificationIndex = this.notifications.findIndex(n => n.id === notificationId);
    if (notificationIndex !== -1) {
      this.notifications[notificationIndex].read = true;
    }
  }
}

export const dataService = new DataService();