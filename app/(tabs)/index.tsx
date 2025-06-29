import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Clock, Plus, Filter } from 'lucide-react-native';
import { Job } from '@/types';
import { dataService } from '@/services/dataService';
import { LocationService } from '@/services/locationService';
import JobPostForm from '@/components/JobPostForm';
import BidsList from '@/components/BidsList';

export default function JobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showJobForm, setShowJobForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showBids, setShowBids] = useState(false);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Cleaning', 'Gardening', 'Painting', 'Handyman', 'Plumbing', 'Electrical'];

  useEffect(() => {
    loadJobs();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    setUserLocation(location);
  };

  const loadJobs = async () => {
    try {
      setLoading(true);
      const location = await LocationService.getCurrentLocation();
      const fetchedJobs = await dataService.getJobs(location || undefined);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (jobData: any) => {
    try {
      await dataService.createJob(jobData);
      setShowJobForm(false);
      loadJobs();
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
      loadJobs();
      Alert.alert('Success', 'Bid accepted! The provider has been notified.');
    } catch (error) {
      console.error('Error accepting bid:', error);
      Alert.alert('Error', 'Failed to accept bid. Please try again.');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    // In a real app, you'd implement bid rejection
    Alert.alert('Success', 'Bid rejected.');
  };

  const handleMessageProvider = (providerId: string) => {
    // Navigate to messages with this provider
    Alert.alert('Message', 'Opening chat with provider...');
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return '#6B7280';
      case 'bidding': return '#F59E0B';
      case 'confirmed': return '#2563EB';
      case 'in-progress': return '#059669';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || job.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Jobs</Text>
        <Text style={styles.headerSubtitle}>Find your next piece job</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#6B7280" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

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

      <ScrollView style={styles.jobsList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery || activeFilter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Be the first to post a job in your area!'
              }
            </Text>
          </View>
        ) : (
          filteredJobs.map((job) => (
            <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => handleJobPress(job)}>
              {job.images.length > 0 && (
                <Image source={{ uri: job.images[0] }} style={styles.jobImage} />
              )}
              <View style={styles.jobContent}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <View style={styles.badgeContainer}>
                    <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(job.urgency) }]}>
                      <Text style={styles.urgencyText}>
                        {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                      <Text style={styles.statusText}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>
                
                <View style={styles.jobMeta}>
                  <View style={styles.locationContainer}>
                    <MapPin color="#6B7280" size={14} />
                    <Text style={styles.locationText}>{job.location}</Text>
                  </View>
                  
                  <View style={styles.timeContainer}>
                    <Clock color="#6B7280" size={14} />
                    <Text style={styles.timeText}>{job.timePosted}</Text>
                  </View>
                </View>
                
                <View style={styles.jobFooter}>
                  <Text style={styles.budgetText}>{job.budget}</Text>
                  <View style={styles.bidsContainer}>
                    <Text style={styles.bidsText}>{job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}</Text>
                    <Star color="#F59E0B" size={14} fill="#F59E0B" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => setShowJobForm(true)}>
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>

      {/* Job Post Form Modal */}
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

      {/* Bids List Modal */}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filtersContainer: {
    paddingLeft: 24,
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  jobsList: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  jobImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  jobContent: {
    padding: 16,
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
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  badgeContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  bidsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bidsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginRight: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
});