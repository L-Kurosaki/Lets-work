import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Search, MapPin, Plus, Filter, Zap, TrendingUp, Navigation, Bell } from 'lucide-react-native';
import { Job } from '@/types';
import { dataService } from '@/services/dataService';
import { LocationService } from '@/services/locationService';
import JobPostForm from '@/components/JobPostForm';
import BidsList from '@/components/BidsList';
import SecurityMonitor from '@/components/SecurityMonitor';
import JobCard from '@/components/JobCard';

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showBids, setShowBids] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const filters = ['All', 'Cleaning', 'Gardening', 'Painting', 'Handyman', 'Plumbing', 'Electrical', 'Moving'];

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      // First try to get current location
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
        setLocationPermissionGranted(true);
        await loadJobs(location);
      } else {
        // Try IP-based location as fallback
        const ipLocation = await LocationService.getApproximateLocation();
        if (ipLocation) {
          setUserLocation(ipLocation);
          await loadJobs(ipLocation);
        } else {
          // Load jobs without location filtering
          await loadJobs();
        }
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      await loadJobs(); // Load jobs without location
    }
  };

  const loadJobs = async (location?: {latitude: number, longitude: number}) => {
    try {
      setLoading(true);
      const fetchedJobs = await dataService.getJobs(location);
      setJobs(fetchedJobs);
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

  const requestLocationPermission = async () => {
    try {
      const hasPermission = await LocationService.requestPermissions();
      if (hasPermission) {
        const location = await LocationService.getCurrentLocation();
        if (location) {
          setUserLocation(location);
          setLocationPermissionGranted(true);
          await loadJobs(location);
          Alert.alert('Location Enabled', 'Now showing jobs near your location!');
        }
      } else {
        Alert.alert(
          'Location Permission',
          'Location access helps us show you jobs nearby. You can still browse all jobs without it.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const handleCreateJob = async (jobData: any) => {
    try {
      await dataService.createJob(jobData);
      setShowJobForm(false);
      await loadJobs(userLocation || undefined);
      Alert.alert('Success', 'Your job has been posted successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to create job. Please try again.');
    }
  };

  const handleJobPress = async (job: Job) => {
    setSelectedJob(job);
    setShowBids(true);
  };

  const handleAcceptBid = async (bidId: string) => {
    try {
      await dataService.acceptBid(bidId);
      setShowBids(false);
      await loadJobs(userLocation || undefined);
      Alert.alert('Success', 'Bid accepted! The provider has been notified.');
    } catch (error) {
      console.error('Error accepting bid:', error);
      Alert.alert('Error', 'Failed to accept bid. Please try again.');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    Alert.alert('Success', 'Bid rejected.');
  };

  const handleMessageProvider = (providerId: string) => {
    Alert.alert('Message', 'Opening chat with provider...');
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || job.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const inProgressJobs = filteredJobs.filter(job => job.status === 'in-progress');

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Find Your Next</Text>
            <Text style={styles.headerTitleAccent}>Piece Job</Text>
          </View>
          <View style={styles.headerActions}>
            {!locationPermissionGranted && (
              <TouchableOpacity style={styles.locationButton} onPress={requestLocationPermission}>
                <Navigation color="#2563EB" size={20} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.notificationDot} />
              <Bell color="#2563EB" size={24} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.headerSubtitle}>
          {userLocation 
            ? 'Trusted local services near you' 
            : 'Trusted local services • Enable location for nearby jobs'
          }
        </Text>
      </View>

      {/* Enhanced Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cleaning, gardening, repairs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter color="#6B7280" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Filters */}
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
        {/* Security Monitor for in-progress jobs */}
        {inProgressJobs.map(job => (
          <SecurityMonitor 
            key={`security-${job.id}`}
            job={job}
            onEmergencyAlert={() => {
              Alert.alert('Emergency Alert', 'Security team has been notified.');
            }}
          />
        ))}

        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Finding jobs near you...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Zap color="#D1D5DB" size={48} />
            </View>
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || activeFilter !== 'All' 
                ? 'Try adjusting your search or filters'
                : userLocation 
                  ? 'Be the first to post a job in your area!'
                  : 'Enable location to see jobs near you, or post the first job!'
              }
            </Text>
            <TouchableOpacity style={styles.emptyAction} onPress={() => setShowJobForm(true)}>
              <Text style={styles.emptyActionText}>Post Your First Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.jobsGrid}>
            {filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onPress={handleJobPress}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Enhanced FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowJobForm(true)}>
        <Plus color="#FFFFFF" size={24} />
        <Text style={styles.fabText}>Post Job</Text>
      </TouchableOpacity>

      {/* Modals */}
      <Modal
        visible={showJobForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <JobPostForm
          onSubmit={handleCreateJob}
          onCancel={() => setShowJobForm(false)}
        />
      </Modal>

      <Modal
        visible={showBids}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedJob && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedJob.title}</Text>
              <TouchableOpacity onPress={() => setShowBids(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
            <BidsList
              bids={selectedJob.bids}
              onAcceptBid={handleAcceptBid}
              onRejectBid={handleRejectBid}
              onMessageProvider={handleMessageProvider}
            />
          </View>
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
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    lineHeight: 38,
  },
  headerTitleAccent: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
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
    paddingBottom: 100,
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
    borderTopColor: '#2563EB',
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
    marginBottom: 24,
  },
  emptyAction: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyActionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 28,
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  fabText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    flex: 1,
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
});