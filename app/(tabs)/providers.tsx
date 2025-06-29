import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Shield, Award, MessageCircle } from 'lucide-react-native';

interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  location: string;
  distance: string;
  hourlyRate: string;
  completedJobs: number;
  isVerified: boolean;
  badges: string[];
  description: string;
}

const mockProviders: Provider[] = [
  {
    id: '1',
    name: 'Sarah Mokoena',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.9,
    reviewCount: 127,
    specialty: 'Deep Cleaning',
    location: 'Sandton',
    distance: '1.2 km away',
    hourlyRate: 'R180/hour',
    completedJobs: 245,
    isVerified: true,
    badges: ['Top Rated', 'Quick Response'],
    description: 'Professional cleaner with 8+ years experience. Specializing in residential deep cleaning and move-in/out services.'
  },
  {
    id: '2',
    name: 'Themba Dlamini',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.8,
    reviewCount: 89,
    specialty: 'Garden Maintenance',
    location: 'Rosebank',
    distance: '2.5 km away',
    hourlyRate: 'R150/hour',
    completedJobs: 156,
    isVerified: true,
    badges: ['Eco-Friendly', 'Reliable'],
    description: 'Experienced gardener with expertise in lawn care, hedge trimming, and landscape maintenance.'
  },
  {
    id: '3',
    name: 'Maria Santos',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: 4.7,
    reviewCount: 203,
    specialty: 'House Painting',
    location: 'Johannesburg CBD',
    distance: '3.8 km away',
    hourlyRate: 'R220/hour',
    completedJobs: 312,
    isVerified: true,
    badges: ['Expert', 'Fast Delivery'],
    description: 'Professional painter with 10+ years experience in interior and exterior painting projects.'
  },
];

export default function ProvidersScreen() {
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

      <ScrollView style={styles.providersList} showsVerticalScrollIndicator={false}>
        {mockProviders.map((provider) => (
          <TouchableOpacity key={provider.id} style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <Image source={{ uri: provider.avatar }} style={styles.avatar} />
              <View style={styles.providerInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  {provider.isVerified && (
                    <Shield color="#059669" size={16} fill="#059669" />
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
                <Text style={styles.distanceText}>• {provider.distance}</Text>
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
        ))}
      </ScrollView>
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
  providersList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  providerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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