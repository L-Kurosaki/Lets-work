import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { Shield, Clock, TriangleAlert as AlertTriangle, Phone, CircleCheck as CheckCircle, MapPin, User } from 'lucide-react-native';
import { Job } from '@/types';
import { NotificationService } from '@/services/notificationService';
import { dataService } from '@/services/dataService';

interface SecurityMonitorProps {
  job: Job;
  onEmergencyAlert?: () => void;
}

export default function SecurityMonitor({ job, onEmergencyAlert }: SecurityMonitorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertLevel, setAlertLevel] = useState<'safe' | 'warning' | 'critical'>('safe');
  const [checkInStatus, setCheckInStatus] = useState<'pending' | 'confirmed' | 'overdue'>('pending');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyCheckTriggered, setEmergencyCheckTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (job.status === 'in-progress' && job.startTime) {
      const elapsedHours = (currentTime.getTime() - job.startTime.getTime()) / (1000 * 60 * 60);
      
      // 4-hour emergency check
      if (elapsedHours >= 4 && !emergencyCheckTriggered) {
        setEmergencyCheckTriggered(true);
        triggerEmergencyCheck();
      }
      
      if (elapsedHours > job.estimatedDuration + 2) {
        setAlertLevel('critical');
        setCheckInStatus('overdue');
        onEmergencyAlert?.();
      } else if (elapsedHours > job.estimatedDuration) {
        setAlertLevel('warning');
        setCheckInStatus('overdue');
      } else {
        setAlertLevel('safe');
        setCheckInStatus('confirmed');
      }
    }
  }, [currentTime, job, emergencyCheckTriggered]);

  const triggerEmergencyCheck = async () => {
    setShowEmergencyModal(true);
    
    // Trigger emergency check in data service
    await dataService.triggerEmergencyCheck(job.id);
    
    // Send notification
    NotificationService.scheduleNotification(
      'Emergency Safety Check',
      `Job "${job.title}" has been running for 4+ hours. Please confirm your safety status.`,
      { jobId: job.id, type: 'emergency_check' }
    );
  };

  const getElapsedTime = () => {
    if (!job.startTime) return '0h 0m';
    
    const elapsed = currentTime.getTime() - job.startTime.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = () => {
    switch (alertLevel) {
      case 'safe': return '#059669';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (alertLevel) {
      case 'safe': return 'Job in Progress';
      case 'warning': return 'Extended Duration';
      case 'critical': return 'Emergency Alert';
      default: return 'Monitoring';
    }
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Contact',
      'This will contact our security partner immediately. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Security', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would initiate an emergency call
            Alert.alert('Security Contacted', 'Our security partner has been notified and will respond within 15 minutes.');
          }
        }
      ]
    );
  };

  const handleSafetyConfirmation = async () => {
    setCheckInStatus('confirmed');
    setAlertLevel('safe');
    setShowEmergencyModal(false);
    
    await dataService.confirmSafety(job.id, job.customerId);
    
    Alert.alert('Safety Confirmed', 'Thank you for confirming your safety. We will continue monitoring.');
  };

  const handleEmergencyResponse = () => {
    setShowEmergencyModal(false);
    handleEmergencyCall();
  };

  if (job.status !== 'in-progress') {
    return null;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Shield color={getStatusColor()} size={20} />
            <Text style={styles.title}>Security Monitor</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.statusText}>{getStatusText()}</Text>
          </View>
        </View>

        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <View style={styles.locationContainer}>
            <MapPin color="#6B7280" size={16} />
            <Text style={styles.jobLocation}>{job.location}</Text>
          </View>
        </View>

        <View style={styles.timeContainer}>
          <View style={styles.timeItem}>
            <Clock color="#6B7280" size={16} />
            <Text style={styles.timeLabel}>Elapsed Time</Text>
            <Text style={styles.timeValue}>{getElapsedTime()}</Text>
          </View>
          <View style={styles.timeItem}>
            <Text style={styles.timeLabel}>Expected Duration</Text>
            <Text style={styles.timeValue}>{job.estimatedDuration}h</Text>
          </View>
        </View>

        {alertLevel === 'warning' && (
          <View style={styles.warningContainer}>
            <AlertTriangle color="#F59E0B" size={20} />
            <Text style={styles.warningText}>
              Job is taking longer than expected. Security team has been notified.
            </Text>
          </View>
        )}

        {alertLevel === 'critical' && (
          <View style={styles.criticalContainer}>
            <View style={styles.criticalHeader}>
              <AlertTriangle color="#EF4444" size={20} />
              <Text style={styles.criticalText}>
                Emergency protocol activated. Security team is responding.
              </Text>
            </View>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
              <Phone color="#FFFFFF" size={20} />
              <Text style={styles.emergencyButtonText}>Call Security</Text>
            </TouchableOpacity>
          </View>
        )}

        {alertLevel === 'safe' && checkInStatus === 'pending' && (
          <TouchableOpacity style={styles.checkInButton} onPress={handleSafetyConfirmation}>
            <CheckCircle color="#059669" size={20} />
            <Text style={styles.checkInButtonText}>Confirm Job Progress</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            PieceJob monitors all active jobs for safety. Emergency checks occur every 4 hours. Our security partners respond to alerts within 15 minutes.
          </Text>
        </View>
      </View>

      {/* Emergency Check Modal */}
      <Modal
        visible={showEmergencyModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEmergencyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.emergencyModal}>
            <View style={styles.emergencyModalHeader}>
              <AlertTriangle color="#EF4444" size={32} />
              <Text style={styles.emergencyModalTitle}>Safety Check Required</Text>
            </View>
            
            <Text style={styles.emergencyModalText}>
              Your job has been running for 4+ hours. For your safety, please confirm that everything is okay.
            </Text>
            
            <View style={styles.jobDetailsContainer}>
              <Text style={styles.jobDetailsTitle}>Job Details:</Text>
              <Text style={styles.jobDetailsText}>• {job.title}</Text>
              <Text style={styles.jobDetailsText}>• {job.location}</Text>
              <Text style={styles.jobDetailsText}>• Running for: {getElapsedTime()}</Text>
            </View>

            <View style={styles.emergencyModalActions}>
              <TouchableOpacity 
                style={styles.safeButton} 
                onPress={handleSafetyConfirmation}
              >
                <CheckCircle color="#FFFFFF" size={20} />
                <Text style={styles.safeButtonText}>I'm Safe</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.helpButton} 
                onPress={handleEmergencyResponse}
              >
                <Phone color="#FFFFFF" size={20} />
                <Text style={styles.helpButtonText}>I Need Help</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.emergencyModalFooter}>
              If you don't respond within 10 minutes, we'll automatically contact emergency services.
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginLeft: 8,
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
  jobInfo: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeItem: {
    flex: 1,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  timeValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginLeft: 8,
  },
  criticalContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  criticalHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  criticalText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#991B1B',
    marginLeft: 8,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  checkInButton: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkInButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 8,
  },
  infoContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emergencyModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  emergencyModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emergencyModalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginTop: 12,
    textAlign: 'center',
  },
  emergencyModalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  jobDetailsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  jobDetailsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  jobDetailsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  emergencyModalActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  safeButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  helpButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emergencyModalFooter: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});