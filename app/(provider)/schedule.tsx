import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Phone, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

interface ScheduledJob {
  id: string;
  title: string;
  customerName: string;
  customerPhone: string;
  location: string;
  date: string;
  time: string;
  duration: number;
  amount: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  description: string;
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Mock scheduled jobs
  const scheduledJobs: ScheduledJob[] = [
    {
      id: '1',
      title: 'Deep Clean 3-Bedroom House',
      customerName: 'Michael Johnson',
      customerPhone: '+27 82 123 4567',
      location: 'Sandton, Johannesburg',
      date: '2024-01-15',
      time: '09:00',
      duration: 4,
      amount: 'R950',
      status: 'upcoming',
      description: 'Complete deep cleaning of 3-bedroom house including kitchen and bathrooms.'
    },
    {
      id: '2',
      title: 'Office Cleaning',
      customerName: 'Sarah Williams',
      customerPhone: '+27 83 987 6543',
      location: 'Rosebank, Johannesburg',
      date: '2024-01-15',
      time: '14:00',
      duration: 2,
      amount: 'R400',
      status: 'upcoming',
      description: 'Weekly office cleaning for small business.'
    },
    {
      id: '3',
      title: 'Post-Construction Cleanup',
      customerName: 'David Chen',
      customerPhone: '+27 84 555 1234',
      location: 'Melville, Johannesburg',
      date: '2024-01-16',
      time: '08:00',
      duration: 6,
      amount: 'R1200',
      status: 'upcoming',
      description: 'Cleanup after home renovation project.'
    }
  ];

  const getJobsForDate = (date: string) => {
    return scheduledJobs.filter(job => job.date === date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'in-progress': return '#F59E0B';
      default: return '#2563EB';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="#059669" size={16} />;
      case 'in-progress':
        return <AlertCircle color="#F59E0B" size={16} />;
      default:
        return <Clock color="#2563EB" size={16} />;
    }
  };

  const handleStartJob = (job: ScheduledJob) => {
    Alert.alert(
      'Start Job',
      `Are you ready to start "${job.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Job', 
          onPress: () => {
            Alert.alert('Job Started', 'Timer started. Customer has been notified.');
          }
        }
      ]
    );
  };

  const handleCallCustomer = (phone: string) => {
    Alert.alert('Call Customer', `Calling ${phone}...`);
  };

  const renderJobCard = (job: ScheduledJob) => (
    <View key={job.id} style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.timeContainer}>
          <Clock color="#6B7280" size={16} />
          <Text style={styles.timeText}>{job.time}</Text>
          <Text style={styles.durationText}>({job.duration}h)</Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon(job.status)}
          <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>
            {job.status.replace('-', ' ').toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.jobTitle}>{job.title}</Text>
      <Text style={styles.jobDescription}>{job.description}</Text>

      <View style={styles.customerInfo}>
        <View style={styles.customerRow}>
          <User color="#6B7280" size={16} />
          <Text style={styles.customerName}>{job.customerName}</Text>
        </View>
        <View style={styles.customerRow}>
          <MapPin color="#6B7280" size={16} />
          <Text style={styles.locationText}>{job.location}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <Text style={styles.amountText}>{job.amount}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => handleCallCustomer(job.customerPhone)}
          >
            <Phone color="#2563EB" size={16} />
          </TouchableOpacity>
          {job.status === 'upcoming' && (
            <TouchableOpacity 
              style={styles.startButton}
              onPress={() => handleStartJob(job)}
            >
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const todaysJobs = getJobsForDate(selectedDate);
  const totalEarnings = todaysJobs.reduce((sum, job) => {
    const amount = parseFloat(job.amount.replace('R', ''));
    return sum + amount;
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Schedule</Text>
        <Text style={styles.headerSubtitle}>Manage your upcoming jobs</Text>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <Calendar color="#2563EB" size={20} />
        <Text style={styles.selectedDate}>
          {new Date(selectedDate).toLocaleDateString('en-ZA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>

      {/* Daily Summary */}
      <View style={styles.dailySummary}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{todaysJobs.length}</Text>
          <Text style={styles.summaryLabel}>Jobs Today</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>R{totalEarnings}</Text>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>
            {todaysJobs.reduce((sum, job) => sum + job.duration, 0)}h
          </Text>
          <Text style={styles.summaryLabel}>Total Hours</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {todaysJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar color="#D1D5DB" size={64} />
            <Text style={styles.emptyTitle}>No jobs scheduled</Text>
            <Text style={styles.emptyDescription}>
              You have no jobs scheduled for this date. Check the Available Jobs tab to find new opportunities.
            </Text>
          </View>
        ) : (
          <View style={styles.jobsList}>
            {todaysJobs
              .sort((a, b) => a.time.localeCompare(b.time))
              .map(renderJobCard)}
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginLeft: 12,
  },
  dailySummary: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
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
  summaryNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
  jobsList: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
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
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#0F172A',
    marginLeft: 8,
  },
  durationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  customerInfo: {
    marginBottom: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginLeft: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#059669',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  startButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});