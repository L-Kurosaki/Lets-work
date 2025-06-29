import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Star, MapPin, Shield, Award, MessageCircle } from 'lucide-react-native';
import { Provider } from '@/types';

interface ProviderCardProps {
  provider: Provider;
  onPress: (provider: Provider) => void;
  onMessage?: (providerId: string) => void;
}

export default function ProviderCard({ provider, onPress, onMessage }: ProviderCardProps) {
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
    <TouchableOpacity style={styles.container} onPress={() => onPress(provider)}>
      <View style={styles.header}>
        <Image source={{ uri: provider.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{provider.name}</Text>
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
        
        {onMessage && (
          <TouchableOpacity 
            style={styles.messageButton}
            onPress={() => onMessage(provider.id)}
          >
            <MessageCircle color="#2563EB" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {provider.description}
      </Text>

      <View style={styles.badgesContainer}>
        {provider.badges.slice(0, 3).map((badge, index) => (
          <View key={index} style={styles.badge}>
            <Award color="#059669" size={12} />
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ))}
      </View>

      <View style={styles.meta}>
        <View style={styles.locationContainer}>
          <MapPin color="#6B7280" size={14} />
          <Text style={styles.locationText}>{provider.location}</Text>
          {provider.distance && (
            <Text style={styles.distanceText}>• {provider.distance}</Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <Text style={styles.hourlyRate}>{provider.hourlyRate}</Text>
          <Text style={styles.completedJobs}>
            {provider.completedJobs} jobs completed
          </Text>
        </View>
        
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View Profile</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
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
  info: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
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
  meta: {
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
  footer: {
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
  viewButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});