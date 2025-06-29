import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Star, MapPin, Shield, Award, MessageCircle, Plus } from 'lucide-react-native';
import { Provider, Job } from '@/types';
import { dataService } from '@/services/dataService';
import { LocationService } from '@/services/locationService';
import BiddingInterface from '@/components/BiddingInterface';

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showBiddingInterface, setShowBiddingInterface] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock current provider for bidding (in real app, this would come from auth)
  const currentProvider: Provider = {
    id: 'provider1',
    name: 'Sarah Mokoena',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 127,
    specialty: 'Deep Cleaning',
    location: 'Sandton',
    hourlyRate: 'R180/hour',
    completedJobs: 245,
    isVerified: true,
    badges: ['Top Rated', 'Quick Response'],
    description: 'Professional cleaner with 8+ years experience.',
    qualifications: [],
    isOnline: true
  };

  useEffect(() => {
    loadProviders();
    loadJobs();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const location = await LocationService.getCurrentLocation();
      const fetchedProviders = await dataService.getProviders(location || undefined);
      setProviders(fetchedProviders);
    } catch (error) {
      console.error('Error loading providers:', error);
      Alert.alert('Error', 'Failed to load providers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      const fetchedJobs = await dataService.getJobs(location || undefined);
      // Filter for jobs that are open for bidding
      const openJobs = fetchedJobs.filter(job => job.status === 'posted');
      setJobs(openJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const handleProviderPress = (provider: Provider) => {
    setSelectedProvider(provider);
    // In a real app, this would navigate to provider profile
    Alert.alert('Provider Profile', `View ${provider.name}'s full profile and reviews.`);
  };

  const handleBidOnJob = (job: Job) => {
    setSelectedJob(job);
    setShowBiddingInterface(true);
  };

  const handleSubmitBid = async (bidData: any) => {
    try {
      await dataService.createBid(bidData);
      setShowBiddingInterface(false);
      setSelectedJob(null);
      Alert.alert('Success', 'Your bid has been submitted successfully!');
      loadJobs(); // Refresh jobs to update bid count
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Failed to submit bid. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" size={14} color="#F59E0B" fill="#F59E0B" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={14} color="#E5E7EB" />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Providers</Text>
        <Text style={styles.headerSubtitle}>Vetted professionals near you</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Available Jobs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jobs Available for Bidding</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jobsScroll}>
            {jobs.map((job) => (
              <TouchableOpacity 
                key={job.id} 
                style={styles.jobCard}
                onPress={() => handleBidOnJob(job)}
              >
                {job.images.length > 0 && (
                  <Image source={{ uri: job.images[0] }} style={styles.jobCardImage} />
                )}
                <View style={styles.jobCardContent}>
                  <Text style={styles.jobCardTitle} numberOfLines={2}>{job.title}</Text>
                  <Text style={styles.jobCardBudget}>{job.budget}</Text>
                  <View style={styles.jobCardMeta}>
                    <Text style={styles.jobCardLocation}>{job.location}</Text>
                    <Text style={styles.jobCardBids}>{job.bids.length} bids</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {jobs.length === 0 && (
              <View style={styles.noJobsContainer}>
                <Text style={styles.noJobsText}>No jobs available for bidding</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Providers Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Providers</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading providers...</Text>
            </View>
          ) : (
            providers.map((provider) => (
              <TouchableOpacity 
                key={provider.id} 
                style={styles.providerCard}
                onPress={() => handleProviderPress(provider)}
              >
                <View style={styles.providerHeader}>
                  <Image source={{ uri: provider.avatar }} style={styles.avatar} />
                  <View style={styles.providerInfo}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.providerName}>{provider.name}</Text>
                      {provider.isVerified && (
                        <Shield color="#059669" size={16} fill="#059669" />
                      )}
                      {provider.isOnline && (
                        <View style={styles.onlineIndicator} />
                      )}
                    </View>
                    
                    <View style={styles.ratingContainer}>
                      <View style={styles.stars}>
                        {renderStars(provider.rating)}
                      </View>
                      <Text style={styles.ratingText}>
                        {provider.rating} ({provider.reviewCount})
                      </Text>
                    </View>
                    
                    <Text style={styles.specialty}>{provider.specialty}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.messageButton}>
                    <MessageCircle color="#2563EB" size={20} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {provider.description}
                </Text>

                <View style={styles.badgesContainer}>
                  {provider.badges.map((badge, index) => (
                    <View key={index} style={styles.badge}>
                      <Award color="#059669" size={12} />
                      <Text style={styles.badgeText}>{badge}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.providerMeta}>
                  <View style={styles.locationContainer}>
                    <MapPin color="#6B7280" size={14} />
                    <Text style={styles.locationText}>{provider.location}</Text>
                    {provider.distance && (
                      <Text style={styles.distanceText}>• {provider.distance}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.providerFooter}>
                  <View style={styles.statsContainer}>
                    <Text style={styles.hourlyRate}>{provider.hourlyRate}</Text>
                    <Text style={styles.completedJobs}>
                      {provider.completedJobs} jobs completed
                    </Text>
                  </View>
                  
                  <TouchableOpacity style={styles.hireButton}>
                    <Text style={styles.hireButtonText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bidding Interface Modal */}
      <Modal
        visible={showBiddingInterface}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedJob && (
          <BiddingInterface
            job={selectedJob}
            currentProvider={currentProvider}
            onSubmitBid={handleSubmitBid}
            onClose={() => {
              setShowBiddingInterface(false);
              setSelectedJob(null);
            }}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  jobsScroll: {
    paddingLeft: 24,
  },
  jobCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobCardImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  jobCardContent: {
    padding: 12,
  },
  jobCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 18,
  },
  jobCardBudget: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginBottom: 8,
  },
  jobCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobCardLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  jobCardBids: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  noJobsContainer: {
    padding: 24,
    alignItems: 'center',
  },
  noJobsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  specialty: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  messageButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginLeft: 4,
  },
  providerMeta: {
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 4,
  },
  providerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
  },
  hourlyRate: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  completedJobs: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  hireButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  hireButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});