import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Clock, DollarSign, Send, Star, Shield } from 'lucide-react-native';
import { Bid, Job, Provider } from '@/types';

interface BiddingInterfaceProps {
  job: Job;
  onSubmitBid: (bidData: Omit<Bid, 'id' | 'timeSubmitted' | 'status'>) => void;
  onClose: () => void;
  currentProvider: Provider;
}

export default function BiddingInterface({ job, onSubmitBid, onClose, currentProvider }: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState(job.estimatedDuration.toString());

  const handleSubmitBid = () => {
    if (!bidAmount.trim() || !message.trim() || !estimatedDuration.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields to submit your bid.');
      return;
    }

    const amount = parseFloat(bidAmount.replace(/[^\d.]/g, ''));
    const duration = parseInt(estimatedDuration);

    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid bid amount.');
      return;
    }

    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid estimated duration.');
      return;
    }

    const bidData = {
      jobId: job.id,
      providerId: currentProvider.id,
      providerName: currentProvider.name,
      providerAvatar: currentProvider.avatar,
      amount: `R${amount}`,
      message: message.trim(),
      estimatedDuration: duration
    };

    onSubmitBid(bidData);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Submit Your Bid</Text>
          <Text style={styles.headerSubtitle}>Review the job details and submit your proposal</Text>
        </View>

        {/* Job Summary */}
        <View style={styles.jobSummary}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(job.urgency) }]}>
              <Text style={styles.urgencyText}>
                {job.urgency.charAt(0).toUpperCase() + job.urgency.slice(1)}
              </Text>
            </View>
          </View>
          
          <Text style={styles.jobDescription}>{job.description}</Text>
          
          <View style={styles.jobMeta}>
            <Text style={styles.jobLocation}>{job.location}</Text>
            <Text style={styles.jobBudget}>Budget: {job.budget}</Text>
          </View>

          {job.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
              {job.images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.jobImage} />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Bid Form */}
        <View style={styles.bidForm}>
          <Text style={styles.sectionTitle}>Your Proposal</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Bid Amount *</Text>
            <View style={styles.inputWithIcon}>
              <DollarSign color="#6B7280" size={20} />
              <TextInput
                style={styles.inputWithIconText}
                value={bidAmount}
                onChangeText={setBidAmount}
                placeholder="e.g. R800"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimated Duration (hours) *</Text>
            <View style={styles.inputWithIcon}>
              <Clock color="#6B7280" size={20} />
              <TextInput
                style={styles.inputWithIconText}
                value={estimatedDuration}
                onChangeText={setEstimatedDuration}
                placeholder="e.g. 4"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message to Customer *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Explain your approach, experience, and why you're the right person for this job..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Provider Profile Summary */}
        <View style={styles.profileSummary}>
          <Text style={styles.sectionTitle}>Your Profile Summary</Text>
          <View style={styles.profileHeader}>
            <Image source={{ uri: currentProvider.avatar }} style={styles.providerAvatar} />
            <View style={styles.providerInfo}>
              <View style={styles.providerNameContainer}>
                <Text style={styles.providerName}>{currentProvider.name}</Text>
                {currentProvider.isVerified && (
                  <Shield color="#059669" size={16} fill="#059669" />
                )}
              </View>
              <View style={styles.ratingContainer}>
                <Star color="#F59E0B" size={14} fill="#F59E0B" />
                <Text style={styles.ratingText}>
                  {currentProvider.rating} ({currentProvider.reviewCount} reviews)
                </Text>
              </View>
              <Text style={styles.completedJobs}>
                {currentProvider.completedJobs} jobs completed
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitBid}>
          <Send color="#FFFFFF" size={20} />
          <Text style={styles.submitButtonText}>Submit Bid</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
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
  jobSummary: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    marginRight: 12,
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
    marginBottom: 16,
  },
  jobLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 4,
  },
  jobBudget: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  imageContainer: {
    marginTop: 12,
  },
  jobImage: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  bidForm: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWithIconText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  profileSummary: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  completedJobs: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});