import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { Upload, Camera, FileText, Award, Shield, CheckCircle, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Qualification } from '@/types';

interface ProviderVerificationProps {
  qualifications: Qualification[];
  onAddQualification: (qualification: Omit<Qualification, 'id' | 'dateAdded'>) => void;
  onRemoveQualification: (qualificationId: string) => void;
}

export default function ProviderVerification({ 
  qualifications, 
  onAddQualification, 
  onRemoveQualification 
}: ProviderVerificationProps) {
  const [selectedType, setSelectedType] = useState<'certificate' | 'license' | 'experience' | 'reference'>('certificate');

  const qualificationTypes = [
    { value: 'certificate', label: 'Certificate', icon: Award, description: 'Professional certificates or training' },
    { value: 'license', label: 'License', icon: Shield, description: 'Government issued licenses' },
    { value: 'experience', label: 'Experience', icon: FileText, description: 'Work history and portfolio' },
    { value: 'reference', label: 'Reference', icon: CheckCircle, description: 'Client testimonials' }
  ];

  const handleAddQualification = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Photo library access is needed to upload documents.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedTypeData = qualificationTypes.find(t => t.value === selectedType);
        
        Alert.prompt(
          'Add Qualification',
          `Enter title for your ${selectedTypeData?.label.toLowerCase()}:`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add',
              onPress: (title) => {
                if (title?.trim()) {
                  onAddQualification({
                    type: selectedType,
                    title: title.trim(),
                    description: selectedTypeData?.description || '',
                    imageUrl: result.assets[0].uri,
                    verificationStatus: 'pending'
                  });
                }
              }
            }
          ],
          'plain-text'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add qualification. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take photos of documents.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const selectedTypeData = qualificationTypes.find(t => t.value === selectedType);
        
        Alert.prompt(
          'Add Qualification',
          `Enter title for your ${selectedTypeData?.label.toLowerCase()}:`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Add',
              onPress: (title) => {
                if (title?.trim()) {
                  onAddQualification({
                    type: selectedType,
                    title: title.trim(),
                    description: selectedTypeData?.description || '',
                    imageUrl: result.assets[0].uri,
                    verificationStatus: 'pending'
                  });
                }
              }
            }
          ],
          'plain-text'
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#059669';
      case 'rejected': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verified';
      case 'rejected': return 'Rejected';
      default: return 'Pending';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Provider Verification</Text>
        <Text style={styles.headerSubtitle}>
          Upload your qualifications to build trust with customers
        </Text>
      </View>

      {/* Qualification Type Selection */}
      <View style={styles.typeSelection}>
        <Text style={styles.sectionTitle}>Select Qualification Type</Text>
        <View style={styles.typeGrid}>
          {qualificationTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeCard,
                selectedType === type.value && styles.selectedTypeCard
              ]}
              onPress={() => setSelectedType(type.value as any)}
            >
              <type.icon 
                color={selectedType === type.value ? '#FFFFFF' : '#6B7280'} 
                size={24} 
              />
              <Text style={[
                styles.typeLabel,
                selectedType === type.value && styles.selectedTypeLabel
              ]}>
                {type.label}
              </Text>
              <Text style={[
                styles.typeDescription,
                selectedType === type.value && styles.selectedTypeDescription
              ]}>
                {type.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upload Actions */}
      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>Upload Document</Text>
        <View style={styles.uploadActions}>
          <TouchableOpacity style={styles.uploadButton} onPress={handleTakePhoto}>
            <Camera color="#2563EB" size={24} />
            <Text style={styles.uploadButtonText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleAddQualification}>
            <Upload color="#2563EB" size={24} />
            <Text style={styles.uploadButtonText}>Choose File</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Existing Qualifications */}
      <View style={styles.qualificationsSection}>
        <Text style={styles.sectionTitle}>Your Qualifications</Text>
        {qualifications.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#D1D5DB" size={48} />
            <Text style={styles.emptyTitle}>No qualifications added</Text>
            <Text style={styles.emptyDescription}>
              Add your certificates, licenses, and experience to build trust with customers
            </Text>
          </View>
        ) : (
          qualifications.map((qualification) => (
            <View key={qualification.id} style={styles.qualificationCard}>
              <View style={styles.qualificationHeader}>
                <View style={styles.qualificationInfo}>
                  <Text style={styles.qualificationTitle}>{qualification.title}</Text>
                  <Text style={styles.qualificationType}>
                    {qualificationTypes.find(t => t.value === qualification.type)?.label}
                  </Text>
                </View>
                <View style={styles.qualificationActions}>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(qualification.verificationStatus) }
                  ]}>
                    <Text style={styles.statusText}>
                      {getStatusText(qualification.verificationStatus)}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => onRemoveQualification(qualification.id)}
                  >
                    <X color="#EF4444" size={20} />
                  </TouchableOpacity>
                </View>
              </View>
              
              {qualification.imageUrl && (
                <Image 
                  source={{ uri: qualification.imageUrl }} 
                  style={styles.qualificationImage} 
                />
              )}
              
              <Text style={styles.qualificationDescription}>
                {qualification.description}
              </Text>
              
              <Text style={styles.qualificationDate}>
                Added {qualification.dateAdded}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Verification Process</Text>
        <Text style={styles.infoText}>
          • Documents are reviewed within 24-48 hours{'\n'}
          • Verified qualifications increase your visibility{'\n'}
          • Customers can see your verification status{'\n'}
          • You'll be notified of verification results
        </Text>
      </View>
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
  typeSelection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedTypeCard: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  typeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  selectedTypeLabel: {
    color: '#FFFFFF',
  },
  typeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedTypeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  uploadSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 8,
  },
  qualificationsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  qualificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  qualificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  qualificationInfo: {
    flex: 1,
  },
  qualificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  qualificationType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  qualificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  removeButton: {
    padding: 4,
  },
  qualificationImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  qualificationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  qualificationDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 24,
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});