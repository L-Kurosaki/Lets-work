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
    // Initialize with more diverse mock data across different locations
    this.jobs = [
      {
        id: '1',
        title: 'Deep Clean 3-Bedroom House',
        description: 'Need a thorough cleaning of my 3-bedroom house in Sandton. Kitchen, bathrooms, and all living areas. Looking for someone with experience in deep cleaning and attention to detail.',
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
        description: 'Weekly garden maintenance needed. Trimming hedges, lawn mowing, and general garden cleanup. Must have own equipment.',
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
      },
      {
        id: '3',
        title: 'Interior Wall Painting',
        description: 'Need to paint the interior walls of my 2-bedroom apartment. All materials will be provided. Looking for experienced painter.',
        location: 'Melville, Johannesburg',
        coordinates: { latitude: -26.1875, longitude: 28.0103 },
        budget: 'R1500 - R2500',
        timePosted: '1 day ago',
        bids: [],
        category: 'Painting',
        images: ['https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400'],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer2',
        estimatedDuration: 6
      },
      {
        id: '4',
        title: 'Bathroom Plumbing Repair',
        description: 'Leaking tap and blocked drain in main bathroom. Need urgent repair. Must be licensed plumber.',
        location: 'Fourways, Johannesburg',
        coordinates: { latitude: -25.9269, longitude: 28.0094 },
        budget: 'R500 - R800',
        timePosted: '3 hours ago',
        bids: [],
        category: 'Plumbing',
        images: ['https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=400'],
        urgency: 'high',
        status: 'posted',
        customerId: 'customer3',
        estimatedDuration: 2
      },
      {
        id: '5',
        title: 'Electrical Socket Installation',
        description: 'Need 3 new electrical sockets installed in home office. Must be qualified electrician with COC.',
        location: 'Randburg, Johannesburg',
        coordinates: { latitude: -26.0939, longitude: 27.9621 },
        budget: 'R800 - R1200',
        timePosted: '6 hours ago',
        bids: [],
        category: 'Electrical',
        images: ['https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400'],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer4',
        estimatedDuration: 3
      },
      {
        id: '6',
        title: 'Moving Assistance',
        description: 'Need help moving from 2-bedroom apartment to new house. Heavy furniture included. Need 2-3 people.',
        location: 'Bryanston, Johannesburg',
        coordinates: { latitude: -26.0469, longitude: 28.0187 },
        budget: 'R1000 - R1500',
        timePosted: '5 hours ago',
        bids: [],
        category: 'Moving',
        images: ['https://images.pexels.com/photos/7464230/pexels-photo-7464230.jpeg?auto=compress&cs=tinysrgb&w=400'],
        urgency: 'high',
        status: 'posted',
        customerId: 'customer5',
        estimatedDuration: 5
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
      },
      {
        id: 'provider3',
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.7,
        reviewCount: 203,
        specialty: 'Interior Painting',
        location: 'Melville',
        coordinates: { latitude: -26.1875, longitude: 28.0103 },
        hourlyRate: 'R200/hour',
        completedJobs: 312,
        isVerified: true,
        badges: ['Master Painter', 'Quality Guarantee'],
        description: 'Professional painter with 12+ years experience. Specializing in interior and exterior painting.',
        qualifications: [],
        isOnline: true
      },
      {
        id: 'provider4',
        name: 'John Williams',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.9,
        reviewCount: 156,
        specialty: 'Plumbing',
        location: 'Fourways',
        coordinates: { latitude: -25.9269, longitude: 28.0094 },
        hourlyRate: 'R250/hour',
        completedJobs: 189,
        isVerified: true,
        badges: ['Licensed Plumber', 'Emergency Service'],
        description: 'Licensed plumber with 15+ years experience. Available for emergency repairs and installations.',
        qualifications: [],
        isOnline: true
      }
    ];
  }

  // Job methods with improved location filtering
  async getJobs(userLocation?: LocationCoords, radiusKm: number = 25): Promise<Job[]> {
    let filteredJobs = [...this.jobs];

    if (userLocation) {
      // Filter jobs within radius
      filteredJobs = filteredJobs.filter(job => {
        if (!job.coordinates) return true; // Include jobs without coordinates
        const distance = LocationService.calculateDistance(userLocation, job.coordinates);
        return distance <= radiusKm;
      });

      // Add distance to jobs and sort by distance
      filteredJobs = filteredJobs.map(job => ({
        ...job,
        distance: job.coordinates 
          ? LocationService.formatDistance(LocationService.calculateDistance(userLocation, job.coordinates))
          : undefined
      })).sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        const distanceA = LocationService.calculateDistance(userLocation, a.coordinates);
        const distanceB = LocationService.calculateDistance(userLocation, b.coordinates);
        return distanceA - distanceB;
      });
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

  // Provider methods with improved location filtering
  async getProviders(userLocation?: LocationCoords, radiusKm: number = 25): Promise<Provider[]> {
    let filteredProviders = [...this.providers];

    if (userLocation) {
      // Filter providers within radius
      filteredProviders = filteredProviders.filter(provider => {
        if (!provider.coordinates) return true; // Include providers without coordinates
        const distance = LocationService.calculateDistance(userLocation, provider.coordinates);
        return distance <= radiusKm;
      });

      // Add distance to providers and sort by distance
      filteredProviders = filteredProviders.map(provider => ({
        ...provider,
        distance: provider.coordinates 
          ? LocationService.formatDistance(LocationService.calculateDistance(userLocation, provider.coordinates))
          : undefined
      })).sort((a, b) => {
        if (!a.coordinates || !b.coordinates) return 0;
        const distanceA = LocationService.calculateDistance(userLocation, a.coordinates);
        const distanceB = LocationService.calculateDistance(userLocation, b.coordinates);
        return distanceA - distanceB;
      });
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

  // Security monitoring methods
  async startJobMonitoring(jobId: string): Promise<void> {
    const job = await this.getJobById(jobId);
    if (job) {
      await this.updateJobStatus(jobId, 'in-progress');
      
      // Schedule 4-hour emergency check
      setTimeout(async () => {
        const updatedJob = await this.getJobById(jobId);
        if (updatedJob && updatedJob.status === 'in-progress') {
          await this.triggerEmergencyCheck(jobId);
        }
      }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
    }
  }

  async triggerEmergencyCheck(jobId: string): Promise<void> {
    const job = await this.getJobById(jobId);
    if (!job) return;

    // Create emergency notification
    await this.createNotification({
      userId: job.customerId,
      type: 'security_alert',
      title: 'Emergency Check Required',
      message: `Job "${job.title}" has been running for 4+ hours. Please confirm safety status.`,
      data: { jobId, type: 'emergency_check' }
    });

    // In a real app, this would trigger:
    // 1. SMS to customer's emergency contact
    // 2. Call to security partner
    // 3. GPS location check
    // 4. Provider welfare check
    
    console.log(`Emergency check triggered for job ${jobId}`);
  }

  async confirmSafety(jobId: string, userId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: 'security_alert',
      title: 'Safety Confirmed',
      message: 'Thank you for confirming your safety. Monitoring continues.',
      data: { jobId, type: 'safety_confirmed' }
    });
  }
}

export const dataService = new DataService();