import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Star, Shield, Clock, MessageCircle, Check, X } from 'lucide-react-native';
import { Bid } from '@/types';

interface BidsListProps {
  bids: Bid[];
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
  onMessageProvider: (providerId: string) => void;
}

export default function BidsList({ bids, onAcceptBid, onRejectBid, onMessageProvider }: BidsListProps) {
  const handleAcceptBid = (bid: Bid) => {
    Alert.alert(
      'Accept Bid',
      `Are you sure you want to accept ${bid.providerName}'s bid of ${bid.amount}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Accept', 
          style: 'default',
          onPress: () => onAcceptBid(bid.id)
        }
      ]
    );
  };

  const handleRejectBid = (bid: Bid) => {
    Alert.alert(
      'Reject Bid',
      `Are you sure you want to reject ${bid.providerName}'s bid?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => onRejectBid(bid.id)
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#059669';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  if (bids.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No bids yet</Text>
        <Text style={styles.emptyDescription}>
          Service providers will submit their bids here. You'll be notified when new bids arrive.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bids Received</Text>
        <Text style={styles.headerSubtitle}>{bids.length} provider{bids.length !== 1 ? 's' : ''} interested</Text>
      </View>

      {bids.map((bid) => (
        <View key={bid.id} style={styles.bidCard}>
          <View style={styles.bidHeader}>
            <Image source={{ uri: bid.providerAvatar }} style={styles.providerAvatar} />
            <View style={styles.providerInfo}>
              <View style={styles.providerNameContainer}>
                <Text style={styles.providerName}>{bid.providerName}</Text>
                <Shield color="#059669" size={16} fill="#059669" />
              </View>
              <View style={styles.bidMeta}>
                <Text style={styles.bidAmount}>{bid.amount}</Text>
                <View style={styles.durationContainer}>
                  <Clock color="#6B7280" size={14} />
                  <Text style={styles.duration}>{bid.estimatedDuration}h</Text>
                </View>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bid.status) }]}>
              <Text style={styles.statusText}>{getStatusText(bid.status)}</Text>
            </View>
          </View>

          <Text style={styles.bidMessage}>{bid.message}</Text>

          <View style={styles.bidFooter}>
            <Text style={styles.timeSubmitted}>{bid.timeSubmitted}</Text>
            
            {bid.status === 'pending' && (
              <View style={styles.bidActions}>
                <TouchableOpacity 
                  style={styles.messageButton}
                  onPress={() => onMessageProvider(bid.providerId)}
                >
                  <MessageCircle color="#2563EB" size={16} />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => handleRejectBid(bid)}
                >
                  <X color="#EF4444" size={16} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptBid(bid)}
                >
                  <Check color="#FFFFFF" size={16} />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bidHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  bidMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bidAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bidMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  bidFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSubmitted: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  bidActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  messageButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 4,
  },
  rejectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  acceptButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
});