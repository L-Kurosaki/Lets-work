import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Star, MapPin, Shield, Award, MessageCircle, Plus, Search, Filter } from 'lucide-react-native';
import { Provider, Job } from '@/types';
import { dataService } from '@/services/dataService';
import { LocationService } from '@/services/locationService';
import BiddingInterface from '@/components/BiddingInterface';
import ProviderCard from '@/components/ProviderCard';

export default function ProvidersScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showBiddingInterface, setShowBiddingInterface] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'providers' | 'jobs'>('providers');

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

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadProviders(), loadJobs()]);
    setRefreshing(false);
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

  const handleMessageProvider = (providerId: string) => {
    Alert.alert('Message', `Opening chat with provider ${providerId}...`);
  };

  const renderJobCard = (job: Job) => (
    <TouchableOpacity 
      key={job.id} 
      style={styles.jobCard}
      onPress={() => handleBidOnJob(job)}
    >
      <View style={styles.jobCardHeader}>
        <Text style={styles.jobCardTitle} numberOfLines={2}>{job.title}</Text>
        <View style={styles.urgencyBadge}>
          <Text style={styles.urgencyText}>{job.urgency}</Text>
        </View>
      </View>
      <Text style={styles.jobCardDescription} numberOfLines={2}>{job.description}</Text>
      <Text style={styles.jobCardBudget}>{job.budget}</Text>
      <View style={styles.jobCardMeta}>
        <View style={styles.jobCardLocation}>
          <MapPin color="#6B7280" size={14} />
          <Text style={styles.jobCardLocationText}>{job.location}</Text>
        </View>
        <Text style={styles.jobCardBids}>{job.bids.length} bids</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Providers</Text>
        <Text style={styles.headerSubtitle}>Vetted professionals and available jobs</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'providers' && styles.activeTab]}
          onPress={() => setActiveTab('providers')}
        >
          <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>
            Top Providers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>
            Available Jobs ({jobs.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'providers' ? (
          <View style={styles.section}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading providers...</Text>
              </View>
            ) : (
              providers.map((provider) => (
                <ProviderCard
                  key={provider.id}
                  provider={provider}
                  onPress={handleProviderPress}
                  onMessage={handleMessageProvider}
                />
              ))
            )}
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jobs Available for Bidding</Text>
            {jobs.length === 0 ? (
              <View style={styles.noJobsContainer}>
                <Text style={styles.noJobsText}>No jobs available for bidding</Text>
                <Text style={styles.noJobsSubtext}>Check back later for new opportunities</Text>
              </View>
            ) : (
              <View style={styles.jobsGrid}>
                {jobs.map(renderJobCard)}
              </View>
            )}
          </View>
        )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#2563EB',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
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
  noJobsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noJobsText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  noJobsSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  jobsGrid: {
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  urgencyBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    textTransform: 'capitalize',
  },
  jobCardDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobCardBudget: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginBottom: 12,
  },
  jobCardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobCardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  jobCardLocationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  jobCardBids: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
});