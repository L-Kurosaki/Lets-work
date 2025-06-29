import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, Users, Zap, TrendingUp, Briefcase } from 'lucide-react-native';
import { Job } from '@/types';
import { dataService } from '@/services/dataService';
import { LocationService } from '@/services/locationService';
import BiddingInterface from '@/components/BiddingInterface';
import JobCard from '@/components/JobCard';

export default function ProviderJobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showBiddingInterface, setShowBiddingInterface] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const filters = ['All', 'Cleaning', 'Gardening', 'Painting', 'Handyman', 'Plumbing', 'Electrical', 'Moving'];

  // Mock current provider data
  const currentProvider = {
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
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
        await loadJobs(location);
      } else {
        await loadJobs();
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      await loadJobs();
    }
  };

  const loadJobs = async (location?: {latitude: number, longitude: number}) => {
    try {
      setLoading(true);
      const fetchedJobs = await dataService.getJobs(location);
      // Filter for jobs that are open for bidding
      const openJobs = fetchedJobs.filter(job => job.status === 'posted');
      setJobs(openJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobs(userLocation || undefined);
    setRefreshing(false);
  };

  const handleJobPress = (job: Job) => {
    setSelectedJob(job);
    setShowBiddingInterface(true);
  };

  const handleSubmitBid = async (bidData: any) => {
    try {
      await dataService.createBid(bidData);
      setShowBiddingInterface(false);
      setSelectedJob(null);
      Alert.alert('Success', 'Your bid has been submitted successfully!');
      await loadJobs(userLocation || undefined);
    } catch (error) {
      console.error('Error submitting bid:', error);
      Alert.alert('Error', 'Failed to submit bid. Please try again.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || job.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getJobMatchScore = (job: Job) => {
    // Calculate match score based on provider's specialty and location
    let score = 0;
    if (job.category.toLowerCase().includes(currentProvider.specialty.toLowerCase())) {
      score += 50;
    }
    if (job.location.includes(currentProvider.location)) {
      score += 30;
    }
    if (job.urgency === 'high') {
      score += 20;
    }
    return Math.min(score, 100);
  };

  const renderProviderJobCard = (job: Job) => {
    const matchScore = getJobMatchScore(job);
    const isHighMatch = matchScore >= 70;
    
    return (
      <TouchableOpacity key={job.id} style={[styles.jobCard, isHighMatch && styles.highMatchCard]} onPress={() => handleJobPress(job)}>
        {isHighMatch && (
          <View style={styles.matchBadge}>
            <Zap color="#FFFFFF" size={16} />
            <Text style={styles.matchBadgeText}>Great Match</Text>
          </View>
        )}
        
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
          <View style={styles.urgencyContainer}>
            <View style={[styles.urgencyDot, { backgroundColor: job.urgency === 'high' ? '#EF4444' : job.urgency === 'medium' ? '#F59E0B' : '#10B981' }]} />
            <Text style={styles.urgencyText}>{job.urgency}</Text>
          </View>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>

        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <DollarSign color="#059669" size={16} />
            <Text style={styles.budgetText}>{job.budget}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock color="#6B7280" size={16} />
            <Text style={styles.durationText}>{job.estimatedDuration}h</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <MapPin color="#6B7280" size={14} />
          <Text style={styles.locationText}>{job.location}</Text>
          {job.distance && (
            <Text style={styles.distanceText}> • {job.distance}</Text>
          )}
        </View>

        <View style={styles.jobFooter}>
          <View style={styles.competitionInfo}>
            <Users color="#F59E0B" size={16} />
            <Text style={styles.competitionText}>
              {job.bids.length} {job.bids.length === 1 ? 'bid' : 'bids'}
            </Text>
          </View>
          <Text style={styles.timePosted}>{job.timePosted}</Text>
        </View>

        {isHighMatch && (
          <View style={styles.matchInfo}>
            <Text style={styles.matchInfoText}>
              Matches your specialty and location
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Provider-specific Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Available Jobs</Text>
            <Text style={styles.headerSubtitle}>Find your next opportunity</Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredJobs.length}</Text>
              <Text style={styles.statLabel}>Open Jobs</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs by title or description..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#6B7280" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              activeFilter === filter && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Jobs List */}
      <ScrollView 
        style={styles.jobsList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Finding opportunities for you...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Briefcase color="#D1D5DB" size={48} />
            </View>
            <Text style={styles.emptyTitle}>No jobs available</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || activeFilter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Check back later for new opportunities'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.jobsGrid}>
            {filteredJobs
              .sort((a, b) => getJobMatchScore(b) - getJobMatchScore(a))
              .map(renderProviderJobCard)}
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  headerStats: {
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  filterButton: {
    marginLeft: 12,
    padding: 4,
  },
  filtersContainer: {
    paddingLeft: 24,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
  },
  filterChip: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterChip: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  jobsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  jobsGrid: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    borderTopColor: '#059669',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  highMatchCard: {
    borderWidth: 2,
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  matchBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
  },
  matchBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    flex: 1,
    marginRight: 12,
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  urgencyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginLeft: 6,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 4,
  },
  distanceText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  competitionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  competitionText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 6,
  },
  timePosted: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  matchInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  matchInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    textAlign: 'center',
  },
});