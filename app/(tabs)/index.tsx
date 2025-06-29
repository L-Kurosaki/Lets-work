import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Search, MapPin, Star, Clock, Camera, Plus } from 'lucide-react-native';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: string;
  timePosted: string;
  bids: number;
  category: string;
  image?: string;
  urgency: 'low' | 'medium' | 'high';
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Deep Clean 3-Bedroom House',
    description: 'Need a thorough cleaning of my 3-bedroom house in Sandton. Kitchen, bathrooms, and all living areas.',
    location: 'Sandton, Johannesburg',
    budget: 'R800 - R1200',
    timePosted: '2 hours ago',
    bids: 12,
    category: 'Cleaning',
    image: 'https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=400',
    urgency: 'medium'
  },
  {
    id: '2',
    title: 'Garden Maintenance & Lawn Care',
    description: 'Weekly garden maintenance needed. Trimming hedges, lawn mowing, and general garden cleanup.',
    location: 'Rosebank, Johannesburg',
    budget: 'R400 - R600',
    timePosted: '4 hours ago',
    bids: 8,
    category: 'Gardening',
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400',
    urgency: 'low'
  },
  {
    id: '3',
    title: 'Painting Interior Walls',
    description: 'Need 2 bedrooms painted with quality paint. Previous experience required.',
    location: 'Cape Town CBD',
    budget: 'R1500 - R2000',
    timePosted: '1 day ago',
    bids: 15,
    category: 'Painting',
    urgency: 'high'
  }
];

export default function JobsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Cleaning', 'Gardening', 'Painting', 'Handyman'];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

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
        {mockJobs.map((job) => (
          <TouchableOpacity key={job.id} style={styles.jobCard}>
            {job.image && (
              <Image source={{ uri: job.image }} style={styles.jobImage} />
            )}
            <View style={styles.jobContent}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(job.urgency) }]}>
                  <Text style={styles.urgencyText}>
                    {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
                  </Text>
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
                  <Text style={styles.bidsText}>{job.bids} bids</Text>
                  <Star color="#F59E0B" size={14} fill="#F59E0B" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Plus color="#FFFFFF" size={24} />
      </TouchableOpacity>
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
});