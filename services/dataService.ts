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
    // Initialize with comprehensive mock data
    this.jobs = [
      {
        id: '1',
        title: 'Deep Clean 3-Bedroom House',
        description: 'Need a thorough cleaning of my 3-bedroom house in Sandton. Kitchen, bathrooms, and all living areas. Looking for someone with experience in deep cleaning and attention to detail. House is approximately 180sqm with 2 bathrooms, open plan kitchen/living area, and 3 bedrooms. Prefer eco-friendly cleaning products.',
        location: 'Sandton, Johannesburg',
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        budget: 'R800 - R1200',
        timePosted: '2 hours ago',
        bids: [
          {
            id: 'bid1',
            jobId: '1',
            providerId: 'provider1',
            providerName: 'Sarah Mokoena',
            providerAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
            amount: 'R950',
            message: 'Hi! I have 8+ years of experience in deep cleaning and use only eco-friendly products. I can complete this job in 4-5 hours and guarantee excellent results. I bring all my own equipment and supplies.',
            timeSubmitted: '1 hour ago',
            status: 'pending',
            estimatedDuration: 4
          },
          {
            id: 'bid2',
            jobId: '1',
            providerId: 'provider5',
            providerName: 'Linda Nkomo',
            providerAvatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
            amount: 'R850',
            message: 'Professional cleaning service with 6 years experience. I specialize in deep cleaning and have excellent references. Can start tomorrow morning.',
            timeSubmitted: '45 minutes ago',
            status: 'pending',
            estimatedDuration: 5
          }
        ],
        category: 'Cleaning',
        images: [
          'https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/6197119/pexels-photo-6197119.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer1',
        estimatedDuration: 4
      },
      {
        id: '2',
        title: 'Garden Maintenance & Lawn Care',
        description: 'Weekly garden maintenance needed for large suburban garden. Includes lawn mowing, hedge trimming, weeding, and general garden cleanup. Garden is approximately 500sqm with established flower beds, vegetable garden, and large lawn area. Must have own equipment and transport.',
        location: 'Rosebank, Johannesburg',
        coordinates: { latitude: -26.1448, longitude: 28.0436 },
        budget: 'R400 - R600',
        timePosted: '4 hours ago',
        bids: [
          {
            id: 'bid3',
            jobId: '2',
            providerId: 'provider2',
            providerName: 'Themba Dlamini',
            providerAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
            amount: 'R500',
            message: 'I have 10+ years of gardening experience and all professional equipment. I can maintain your garden weekly and ensure it stays beautiful year-round.',
            timeSubmitted: '2 hours ago',
            status: 'pending',
            estimatedDuration: 3
          }
        ],
        category: 'Gardening',
        images: [
          'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'low',
        status: 'posted',
        customerId: 'customer1',
        estimatedDuration: 3
      },
      {
        id: '3',
        title: 'Interior Wall Painting',
        description: 'Need to paint the interior walls of my 2-bedroom apartment. All materials will be provided including primer, paint, brushes, and rollers. Looking for experienced painter who can work cleanly and efficiently. Walls are in good condition, just need a fresh coat.',
        location: 'Melville, Johannesburg',
        coordinates: { latitude: -26.1875, longitude: 28.0103 },
        budget: 'R1500 - R2500',
        timePosted: '1 day ago',
        bids: [
          {
            id: 'bid4',
            jobId: '3',
            providerId: 'provider3',
            providerName: 'Maria Santos',
            providerAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
            amount: 'R1800',
            message: 'Professional painter with 12+ years experience. I guarantee clean, precise work and will protect all furniture and floors. Can complete in 2 days.',
            timeSubmitted: '18 hours ago',
            status: 'pending',
            estimatedDuration: 6
          }
        ],
        category: 'Painting',
        images: [
          'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer2',
        estimatedDuration: 6
      },
      {
        id: '4',
        title: 'Bathroom Plumbing Repair',
        description: 'Urgent plumbing repair needed in main bathroom. Leaking tap in basin and blocked drain in shower. Water pressure also seems low. Need licensed plumber with experience in residential repairs. Can provide access anytime.',
        location: 'Fourways, Johannesburg',
        coordinates: { latitude: -25.9269, longitude: 28.0094 },
        budget: 'R500 - R800',
        timePosted: '3 hours ago',
        bids: [
          {
            id: 'bid5',
            jobId: '4',
            providerId: 'provider4',
            providerName: 'John Williams',
            providerAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
            amount: 'R650',
            message: 'Licensed plumber with 15+ years experience. I can fix both issues today and check the water pressure. All work comes with 6-month guarantee.',
            timeSubmitted: '1 hour ago',
            status: 'pending',
            estimatedDuration: 2
          }
        ],
        category: 'Plumbing',
        images: [
          'https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'high',
        status: 'posted',
        customerId: 'customer3',
        estimatedDuration: 2
      },
      {
        id: '5',
        title: 'Electrical Socket Installation',
        description: 'Need 3 new electrical sockets installed in home office. Current setup is insufficient for all equipment. Must be qualified electrician with valid COC. Prefer someone who can work during weekday business hours.',
        location: 'Randburg, Johannesburg',
        coordinates: { latitude: -26.0939, longitude: 27.9621 },
        budget: 'R800 - R1200',
        timePosted: '6 hours ago',
        bids: [],
        category: 'Electrical',
        images: [
          'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer4',
        estimatedDuration: 3
      },
      {
        id: '6',
        title: 'Moving Assistance - 2 Bedroom Apartment',
        description: 'Need help moving from 2-bedroom apartment to new house across town. Heavy furniture included (couch, dining table, beds, appliances). Need 2-3 strong people with moving experience. Truck/bakkie will be provided.',
        location: 'Bryanston, Johannesburg',
        coordinates: { latitude: -26.0469, longitude: 28.0187 },
        budget: 'R1000 - R1500',
        timePosted: '5 hours ago',
        bids: [],
        category: 'Moving',
        images: [
          'https://images.pexels.com/photos/7464230/pexels-photo-7464230.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'high',
        status: 'posted',
        customerId: 'customer5',
        estimatedDuration: 5
      },
      {
        id: '7',
        title: 'Kitchen Deep Clean & Appliance Service',
        description: 'Complete kitchen deep clean including oven, refrigerator, microwave, and all surfaces. Kitchen hasn\'t been deep cleaned in 6 months. Need someone experienced with appliance cleaning and food safety standards.',
        location: 'Parktown, Johannesburg',
        coordinates: { latitude: -26.1715, longitude: 28.0441 },
        budget: 'R600 - R900',
        timePosted: '8 hours ago',
        bids: [],
        category: 'Cleaning',
        images: [
          'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'medium',
        status: 'posted',
        customerId: 'customer6',
        estimatedDuration: 4
      },
      {
        id: '8',
        title: 'Handyman - Multiple Small Repairs',
        description: 'Various small repairs around the house: fix squeaky door hinges, replace broken tiles, patch small holes in walls, fix loose cabinet handles. Looking for reliable handyman who can handle multiple tasks efficiently.',
        location: 'Greenside, Johannesburg',
        coordinates: { latitude: -26.1542, longitude: 28.0186 },
        budget: 'R800 - R1200',
        timePosted: '12 hours ago',
        bids: [],
        category: 'Handyman',
        images: [
          'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=400'
        ],
        urgency: 'low',
        status: 'posted',
        customerId: 'customer7',
        estimatedDuration: 4
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
        badges: ['Top Rated', 'Quick Response', 'Eco-Friendly'],
        description: 'Professional cleaner with 8+ years experience. Specializing in residential deep cleaning and move-in/out services. I use only eco-friendly products and guarantee satisfaction.',
        qualifications: [
          {
            id: 'qual1',
            type: 'certificate',
            title: 'Professional Cleaning Certificate',
            description: 'Certified by SA Cleaning Institute',
            verificationStatus: 'verified',
            dateAdded: '2023-01-15'
          }
        ],
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
        badges: ['Eco-Friendly', 'Reliable', 'Landscaping Expert'],
        description: 'Experienced gardener with expertise in lawn care, hedge trimming, and landscape maintenance. I have my own professional equipment and transport.',
        qualifications: [
          {
            id: 'qual2',
            type: 'certificate',
            title: 'Horticulture Certificate',
            description: 'Certified in garden maintenance and landscaping',
            verificationStatus: 'verified',
            dateAdded: '2023-02-20'
          }
        ],
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
        badges: ['Master Painter', 'Quality Guarantee', 'Interior Specialist'],
        description: 'Professional painter with 12+ years experience. Specializing in interior and exterior painting with attention to detail and clean work practices.',
        qualifications: [
          {
            id: 'qual3',
            type: 'license',
            title: 'Professional Painter License',
            description: 'Licensed professional painter',
            verificationStatus: 'verified',
            dateAdded: '2023-01-10'
          }
        ],
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
        badges: ['Licensed Plumber', 'Emergency Service', '24/7 Available'],
        description: 'Licensed plumber with 15+ years experience. Available for emergency repairs and installations. All work comes with guarantee.',
        qualifications: [
          {
            id: 'qual4',
            type: 'license',
            title: 'Master Plumber License',
            description: 'Licensed master plumber with COC',
            verificationStatus: 'verified',
            dateAdded: '2023-01-05'
          }
        ],
        isOnline: true
      },
      {
        id: 'provider5',
        name: 'Linda Nkomo',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.6,
        reviewCount: 78,
        specialty: 'House Cleaning',
        location: 'Sandton',
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        hourlyRate: 'R160/hour',
        completedJobs: 134,
        isVerified: true,
        badges: ['Reliable', 'Detail Oriented'],
        description: 'Professional cleaning service with 6 years experience. I specialize in residential cleaning and have excellent references.',
        qualifications: [],
        isOnline: true
      },
      {
        id: 'provider6',
        name: 'David Mthembu',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
        rating: 4.8,
        reviewCount: 92,
        specialty: 'Electrical Work',
        location: 'Randburg',
        coordinates: { latitude: -26.0939, longitude: 27.9621 },
        hourlyRate: 'R280/hour',
        completedJobs: 167,
        isVerified: true,
        badges: ['Licensed Electrician', 'Safety Certified', 'COC Provider'],
        description: 'Qualified electrician with 10+ years experience. Specializing in residential electrical work and safety compliance.',
        qualifications: [
          {
            id: 'qual5',
            type: 'license',
            title: 'Electrical License',
            description: 'Licensed electrician with COC certification',
            verificationStatus: 'verified',
            dateAdded: '2023-01-12'
          }
        ],
        isOnline: false
      }
    ];

    // Initialize bids in jobs
    this.jobs.forEach(job => {
      job.bids = this.bids.filter(bid => bid.jobId === job.id);
    });

    // Initialize users
    this.users = [
      {
        id: 'customer1',
        name: 'Michael Johnson',
        email: 'michael.j@email.com',
        location: 'Sandton, Johannesburg',
        coordinates: { latitude: -26.1076, longitude: 28.0567 },
        isProvider: false,
        joinDate: '2023-06-15',
        verificationStatus: 'verified'
      },
      {
        id: 'customer2',
        name: 'Emma Thompson',
        email: 'emma.t@email.com',
        location: 'Melville, Johannesburg',
        coordinates: { latitude: -26.1875, longitude: 28.0103 },
        isProvider: false,
        joinDate: '2023-08-20',
        verificationStatus: 'verified'
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
    const job = this.jobs.find(job => job.id === id);
    if (job) {
      // Ensure bids are populated
      job.bids = this.bids.filter(bid => bid.jobId === id);
    }
    return job || null;
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
        
        // Update bids in job object
        this.jobs[jobIndex].bids = this.jobs[jobIndex].bids.map(b => 
          b.id === bidId ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' }
        );
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

  // Review methods
  async createReview(reviewData: Omit<Review, 'id' | 'timestamp'>): Promise<Review> {
    const newReview: Review = {
      ...reviewData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    this.reviews.push(newReview);
    
    // Update provider rating
    const provider = this.providers.find(p => p.id === reviewData.revieweeId);
    if (provider) {
      const providerReviews = this.reviews.filter(r => r.revieweeId === provider.id);
      const avgRating = providerReviews.reduce((sum, r) => sum + r.rating, 0) / providerReviews.length;
      provider.rating = Math.round(avgRating * 10) / 10;
      provider.reviewCount = providerReviews.length;
    }

    return newReview;
  }

  async getReviewsForProvider(providerId: string): Promise<Review[]> {
    return this.reviews.filter(review => review.revieweeId === providerId);
  }
}

export const dataService = new DataService();