import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Phone, Shield, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface EmergencyButtonProps {
  onEmergencyCall: () => void;
  jobId?: string;
}

export default function EmergencyButton({ onEmergencyCall, jobId }: EmergencyButtonProps) {
  const handleEmergencyPress = () => {
    Alert.alert(
      'Emergency Alert',
      'This will immediately contact our security partners and emergency services. Only use in genuine emergencies.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Emergency', 
          style: 'destructive',
          onPress: onEmergencyCall
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shield color="#EF4444" size={20} />
        <Text style={styles.title}>Emergency Support</Text>
      </View>
      
      <Text style={styles.description}>
        If you feel unsafe or need immediate assistance, press the button below. 
        Our security partners will respond within 15 minutes.
      </Text>
      
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyPress}>
        <AlertTriangle color="#FFFFFF" size={24} />
        <Text style={styles.emergencyButtonText}>Emergency Alert</Text>
        <Phone color="#FFFFFF" size={20} />
      </TouchableOpacity>
      
      <View style={styles.info}>
        <Text style={styles.infoText}>
          • GPS location automatically shared{'\n'}
          • Security team dispatched immediately{'\n'}
          • Emergency contacts notified{'\n'}
          • Police contacted if needed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#991B1B',
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F1D1D',
    lineHeight: 20,
    marginBottom: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emergencyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginHorizontal: 12,
  },
  info: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7F1D1D',
    lineHeight: 16,
  },
});