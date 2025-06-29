import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { Camera, MapPin, DollarSign, X, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { LocationService } from '@/services/locationService';
import { Job } from '@/types';

interface JobPostFormProps {
  onSubmit: (jobData: Omit<Job, 'id' | 'bids' | 'timePosted' | 'status'>) => void;
  onCancel: () => void;
}

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

  const categories = ['Cleaning', 'Gardening', 'Painting', 'Handyman', 'Plumbing', 'Electrical', 'Moving', 'Other'];
  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: '#10B981' },
    { value: 'medium', label: 'Medium Priority', color: '#F59E0B' },
    { value: 'high', label: 'Urgent', color: '#EF4444' }
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
        // In a real app, you'd reverse geocode these coordinates to get an address
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
        customerId: 'customer1', // In a real app, this would come from auth
        estimatedDuration: duration
      };

      onSubmit(jobData);
    } catch (error) {
      Alert.alert('Error', 'Failed to create job. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post a Job</Text>
        <Text style={styles.headerSubtitle}>Describe your job and get bids from trusted providers</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Deep clean 3-bedroom house"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && styles.activeCategoryChip
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.categoryText,
                  category === cat && styles.activeCategoryText
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the work needed in detail..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location *</Text>
          <View style={styles.locationContainer}>
            <View style={styles.inputWithIcon}>
              <MapPin color="#6B7280" size={20} />
              <TextInput
                style={styles.inputWithIconText}
                value={location}
                onChangeText={setLocation}
                placeholder="e.g. Sandton, Johannesburg"
                placeholderTextColor="#9CA3AF"
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Range *</Text>
          <View style={styles.inputWithIcon}>
            <DollarSign color="#6B7280" size={20} />
            <TextInput
              style={styles.inputWithIconText}
              value={budget}
              onChangeText={setBudget}
              placeholder="e.g. R500 - R800"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estimated Duration (hours) *</Text>
          <TextInput
            style={styles.input}
            value={estimatedDuration}
            onChangeText={setEstimatedDuration}
            placeholder="e.g. 4"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority Level *</Text>
          <View style={styles.urgencyContainer}>
            {urgencyLevels.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.urgencyChip,
                  urgency === level.value && { backgroundColor: level.color }
                ]}
                onPress={() => setUrgency(level.value as any)}
              >
                <Text style={[
                  styles.urgencyText,
                  urgency === level.value && styles.activeUrgencyText
                ]}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photos *</Text>
          <Text style={styles.helperText}>Add photos to help providers understand the job better (at least 1 required)</Text>
          
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
              <Camera color="#2563EB" size={20} />
              <Text style={styles.photoButtonText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
              <Plus color="#2563EB" size={20} />
              <Text style={styles.photoButtonText}>Choose Photo</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <View style={styles.photoGrid}>
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
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Post Job</Text>
        </TouchableOpacity>
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
  form: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  inputWithIconText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  locationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  locationButton: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  locationButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  activeCategoryChip: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyChip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  urgencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeUrgencyText: {
    color: '#FFFFFF',
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
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
  },
  photoButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginLeft: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  photoContainer: {
    position: 'relative',
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
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
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});