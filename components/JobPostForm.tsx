import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView, Dimensions } from 'react-native';
import { useState } from 'react';
import { Camera, MapPin, DollarSign, X, Plus, Clock, Zap, CircleAlert as AlertCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LocationService } from '@/services/locationService';
import { Job } from '@/types';

interface JobPostFormProps {
  onSubmit: (jobData: Omit<Job, 'id' | 'bids' | 'timePosted' | 'status'>) => void;
  onCancel: () => void;
}

const { width } = Dimensions.get('window');

export default function JobPostForm({ onSubmit, onCancel }: JobPostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const categories = [
    { id: 'Cleaning', label: 'Cleaning', icon: '🧹', color: '#3B82F6' },
    { id: 'Gardening', label: 'Gardening', icon: '🌱', color: '#10B981' },
    { id: 'Painting', label: 'Painting', icon: '🎨', color: '#F59E0B' },
    { id: 'Handyman', label: 'Handyman', icon: '🔧', color: '#8B5CF6' },
    { id: 'Plumbing', label: 'Plumbing', icon: '🚿', color: '#06B6D4' },
    { id: 'Electrical', label: 'Electrical', icon: '⚡', color: '#F97316' },
    { id: 'Moving', label: 'Moving', icon: '📦', color: '#EF4444' },
    { id: 'Other', label: 'Other', icon: '⭐', color: '#6B7280' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Flexible', description: 'Can wait a few days', color: '#10B981', icon: '🕐' },
    { value: 'medium', label: 'Soon', description: 'Within 1-2 days', color: '#F59E0B', icon: '⏰' },
    { value: 'high', label: 'Urgent', description: 'ASAP - Today/Tomorrow', color: '#EF4444', icon: '🚨' }
  ];

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera access is needed to take photos of your job site.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Photo library access is needed to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const coords = await LocationService.getCurrentLocation();
      if (coords) {
        setLocation(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      } else {
        Alert.alert('Location Error', 'Unable to get your current location. Please enter manually.');
      }
    } catch (error) {
      Alert.alert('Location Error', 'Failed to get location. Please enter manually.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !budget.trim() || !category || !estimatedDuration) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Photo Required', 'Please add at least one photo of the job site to help providers understand the work needed.');
      return;
    }

    const duration = parseInt(estimatedDuration);
    if (isNaN(duration) || duration <= 0) {
      Alert.alert('Invalid Duration', 'Please enter a valid estimated duration in hours.');
      return;
    }

    try {
      const coords = await LocationService.getCurrentLocation();
      
      const jobData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        coordinates: coords,
        budget: budget.trim(),
        category,
        images,
        urgency,
        customerId: 'customer1',
        estimatedDuration: duration
      };

      onSubmit(jobData);
    } catch (error) {
      Alert.alert('Error', 'Failed to create job. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <X color="#64748B" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 2</Text>
        </View>

        {/* Job Title */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What needs to be done?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Deep clean my 3-bedroom house"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose a category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  category === cat.id && styles.activeCategoryCard,
                  { borderColor: category === cat.id ? cat.color : '#E2E8F0' }
                ]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryLabel,
                  category === cat.id && { color: cat.color }
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe the job in detail</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide specific details about what you need done. Include any special requirements, materials needed, or preferences..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add photos</Text>
          <Text style={styles.sectionSubtitle}>Help providers understand the job better (at least 1 required)</Text>
          
          <View style={styles.photoSection}>
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
                <Camera color="#2563EB" size={24} />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
                <Plus color="#2563EB" size={24} />
                <Text style={styles.photoButtonText}>Choose Photo</Text>
              </TouchableOpacity>
            </View>

            {images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
                {images.map((image, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: image }} style={styles.photoThumbnail} />
                    <TouchableOpacity 
                      style={styles.removePhotoButton}
                      onPress={() => removeImage(index)}
                    >
                      <X color="#FFFFFF" size={16} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where is this job?</Text>
          <View style={styles.locationRow}>
            <View style={styles.locationInput}>
              <MapPin color="#64748B" size={20} />
              <TextInput
                style={styles.locationText}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter address or area"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <TouchableOpacity 
              style={styles.locationButton} 
              onPress={getCurrentLocation}
              disabled={isLoadingLocation}
            >
              <Text style={styles.locationButtonText}>
                {isLoadingLocation ? 'Getting...' : 'Use Current'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Budget and Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget & Time</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetInput}>
              <DollarSign color="#64748B" size={20} />
              <TextInput
                style={styles.budgetText}
                value={budget}
                onChangeText={setBudget}
                placeholder="R500 - R800"
                placeholderTextColor="#94A3B8"
              />
            </View>
            <View style={styles.durationInput}>
              <Clock color="#64748B" size={20} />
              <TextInput
                style={styles.durationText}
                value={estimatedDuration}
                onChangeText={setEstimatedDuration}
                placeholder="4h"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Urgency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How urgent is this?</Text>
          <View style={styles.urgencyContainer}>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.urgencyCard,
                  urgency === level.value && { 
                    backgroundColor: level.color + '15',
                    borderColor: level.color 
                  }
                ]}
                onPress={() => setUrgency(level.value as any)}
              >
                <Text style={styles.urgencyIcon}>{level.icon}</Text>
                <Text style={[
                  styles.urgencyLabel,
                  urgency === level.value && { color: level.color }
                ]}>
                  {level.label}
                </Text>
                <Text style={styles.urgencyDescription}>{level.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <AlertCircle color="#2563EB" size={20} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Once posted, verified providers will submit bids. You can review their profiles, ratings, and proposals before choosing the best fit for your job.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Post Job & Get Bids</Text>
          <Zap color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  progressContainer: {
    paddingVertical: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#0F172A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  titleInput: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  textArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (width - 72) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    paddingVertical: 20,
    alignItems: 'center',
  },
  activeCategoryCard: {
    backgroundColor: '#F8FAFC',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
  },
  photoSection: {
    marginTop: 16,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 20,
  },
  photoButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
    marginLeft: 8,
  },
  photoScroll: {
    marginTop: 16,
  },
  photoContainer: {
    position: 'relative',
    marginRight: 12,
  },
  photoThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  locationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  locationButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  locationButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetInput: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  budgetText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  durationInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  durationText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0F172A',
  },
  urgencyContainer: {
    gap: 12,
  },
  urgencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  urgencyLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#334155',
    marginRight: 12,
  },
  urgencyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1E40AF',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});