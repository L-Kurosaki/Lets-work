import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MapPin, Clock, Users, Star, Zap } from 'lucide-react-native';
import { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onPress: (job: Job) => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
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

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⏰';
      case 'low': return '🕐';
      default: return '⏰';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(job)}>
      <View style={styles.header}>
        {job.images.length > 0 && (
          <Image source={{ uri: job.images[0] }} style={styles.image} />
        )}
        <View style={styles.urgencyIndicator}>
          <View style={[styles.urgencyDot, { backgroundColor: getUrgencyColor(job.urgency) }]} />
        </View>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{job.category}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
          <View style={styles.badgeContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
              <Text style={styles.statusText}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{job.description}</Text>
        
        <View style={styles.meta}>
          <View style={styles.locationContainer}>
            <MapPin color="#6B7280" size={14} />
            <Text style={styles.locationText}>{job.location}</Text>
            {job.distance && (
              <Text style={styles.distanceText}> • {job.distance}</Text>
            )}
          </View>
          
          <View style={styles.timeContainer}>
            <Clock color="#6B7280" size={14} />
            <Text style={styles.timeText}>{job.timePosted}</Text>
          </View>
        </View>

        <View style={styles.urgencyRow}>
          <Text style={styles.urgencyIcon}>{getUrgencyIcon(job.urgency)}</Text>
          <Text style={[styles.urgencyText, { color: getUrgencyColor(job.urgency) }]}>
            {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)} Priority
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.budgetContainer}>
            <Text style={styles.budgetText}>{job.budget}</Text>
            <Text style={styles.durationText}>{job.estimatedDuration}h estimated</Text>
          </View>
          <View style={styles.bidsContainer}>
            <Users color="#2563EB" size={16} />
            <Text style={styles.bidsText}>{job.bids.length} bid{job.bids.length !== 1 ? 's' : ''}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  header: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  urgencyIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 16,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 6,
  },
  distanceText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginLeft: 6,
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  urgencyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  urgencyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetContainer: {
    flex: 1,
  },
  budgetText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#059669',
    marginBottom: 2,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  bidsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  bidsText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 6,
  },
});