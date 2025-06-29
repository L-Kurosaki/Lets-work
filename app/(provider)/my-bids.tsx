import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, TrendingUp, DollarSign, Calendar } from 'lucide-react-native';
import { Bid, Job } from '@/types';
import { dataService } from '@/services/dataService';

interface BidWithJob extends Bid {
  job?: Job;
}

export default function MyBidsScreen() {
  const [bids, setBids] = useState<BidWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const currentProviderId = 'provider1'; // In real app, from auth

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = async () => {
    try {
      setLoading(true);
      // In real implementation, this would fetch provider's bids from API
      const allJobs = await dataService.getJobs();
      const providerBids: BidWithJob[] = [];
      
      allJobs.forEach(job => {
        job.bids.forEach(bid => {
          if (bid.providerId === currentProviderId) {
            providerBids.push({
              ...bid,
              job: job
            });
          }
        });
      });
      
      setBids(providerBids);
    } catch (error) {
      console.error('Error loading bids:', error);
      Alert.alert('Error', 'Failed to load your bids. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBids();
    setRefreshing(false);
  };

  const filteredBids = bids.filter(bid => bid.status === activeTab);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle color="#059669" size={20} />;
      case 'rejected':
        return <XCircle color="#EF4444" size={20} />;
      default:
        return <Clock color="#F59E0B" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#059669';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const renderBidCard = (bid: BidWithJob) => (
    <View key={bid.id} style={styles.bidCard}>
      <View style={styles.bidHeader}>
        <View style={styles.bidInfo}>
          <Text style={styles.jobTitle} numberOfLines={1}>
            {bid.job?.title || 'Job Title'}
          </Text>
          <View style={styles.statusContainer}>
            {getStatusIcon(bid.status)}
            <Text style={[styles.statusText, { color: getStatusColor(bid.status) }]}>
              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.bidAmount}>{bid.amount}</Text>
      </View>

      <Text style={styles.bidMessage} numberOfLines={2}>
        {bid.message}
      </Text>

      <View style={styles.bidMeta}>
        <View style={styles.metaItem}>
          <Clock color="#6B7280" size={16} />
          <Text style={styles.metaText}>{bid.estimatedDuration}h estimated</Text>
        </View>
        <View style={styles.metaItem}>
          <Calendar color="#6B7280" size={16} />
          <Text style={styles.metaText}>Submitted {bid.timeSubmitted}</Text>
        </View>
      </View>

      {bid.status === 'accepted' && (
        <View style={styles.acceptedActions}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startJobButton}>
            <Text style={styles.startJobButtonText}>Start Job</Text>
          </TouchableOpacity>
        </View>
      )}

      {bid.status === 'pending' && (
        <View style={styles.pendingInfo}>
          <Text style={styles.pendingText}>
            Waiting for customer response • {bid.job?.bids.length || 0} total bids
          </Text>
        </View>
      )}
    </View>
  );

  const getTabCount = (status: string) => {
    return bids.filter(bid => bid.status === status).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bids</Text>
        <Text style={styles.headerSubtitle}>Track your proposals and opportunities</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp color="#2563EB" size={24} />
          <Text style={styles.statNumber}>{bids.length}</Text>
          <Text style={styles.statLabel}>Total Bids</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle color="#059669" size={24} />
          <Text style={styles.statNumber}>{getTabCount('accepted')}</Text>
          <Text style={styles.statLabel}>Accepted</Text>
        </View>
        <View style={styles.statCard}>
          <Clock color="#F59E0B" size={24} />
          <Text style={styles.statNumber}>{getTabCount('pending')}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {(['pending', 'accepted', 'rejected'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner} />
            <Text style={styles.loadingText}>Loading your bids...</Text>
          </View>
        ) : filteredBids.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              {activeTab === 'pending' && <Clock color="#D1D5DB" size={48} />}
              {activeTab === 'accepted' && <CheckCircle color="#D1D5DB" size={48} />}
              {activeTab === 'rejected' && <XCircle color="#D1D5DB" size={48} />}
            </View>
            <Text style={styles.emptyTitle}>
              No {activeTab} bids
            </Text>
            <Text style={styles.emptyDescription}>
              {activeTab === 'pending' && 'Submit bids on available jobs to see them here'}
              {activeTab === 'accepted' && 'Accepted bids will appear here when customers choose your proposals'}
              {activeTab === 'rejected' && 'Keep improving your proposals to increase acceptance rates'}
            </Text>
          </View>
        ) : (
          <View style={styles.bidsContainer}>
            {filteredBids.map(renderBidCard)}
          </View>
        )}
      </ScrollView>
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
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
    borderBottomColor: '#059669',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#059669',
  },
  content: {
    flex: 1,
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
  bidsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  bidCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bidInfo: {
    flex: 1,
    marginRight: 16,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  bidAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  bidMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  bidMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 6,
  },
  acceptedActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  startJobButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  startJobButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  pendingInfo: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  pendingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    textAlign: 'center',
  },
});