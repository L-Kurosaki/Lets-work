import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { Shield, Clock, TriangleAlert as AlertTriangle, Phone } from 'lucide-react-native';

interface SecurityMonitorProps {
  jobId: string;
  startTime: Date;
  expectedDuration: number; // in hours
  onEmergencyAlert?: () => void;
}

export default function SecurityMonitor({ 
  jobId, 
  startTime, 
  expectedDuration, 
  onEmergencyAlert 
}: SecurityMonitorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertLevel, setAlertLevel] = useState<'safe' | 'warning' | 'critical'>('safe');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const elapsedHours = (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    if (elapsedHours > expectedDuration + 2) {
      setAlertLevel('critical');
      onEmergencyAlert?.();
    } else if (elapsedHours > expectedDuration) {
      setAlertLevel('warning');
    } else {
      setAlertLevel('safe');
    }
  }, [currentTime, startTime, expectedDuration]);

  const getElapsedTime = () => {
    const elapsed = currentTime.getTime() - startTime.getTime();
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

  return (
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

      <View style={styles.timeContainer}>
        <View style={styles.timeItem}>
          <Clock color="#6B7280" size={16} />
          <Text style={styles.timeLabel}>Elapsed Time</Text>
          <Text style={styles.timeValue}>{getElapsedTime()}</Text>
        </View>
        <View style={styles.timeItem}>
          <Text style={styles.timeLabel}>Expected Duration</Text>
          <Text style={styles.timeValue}>{expectedDuration}h</Text>
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
          <TouchableOpacity style={styles.emergencyButton}>
            <Phone color="#FFFFFF" size={20} />
            <Text style={styles.emergencyButtonText}>Call Security</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          PieceJob monitors all active jobs for safety. Our security partners respond to alerts within 15 minutes.
        </Text>
      </View>
    </View>
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
});