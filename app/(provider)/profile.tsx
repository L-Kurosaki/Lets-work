import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { User, Settings, Bell, Shield, CreditCard, MapPin, Star, CircleHelp as HelpCircle, LogOut, ChevronRight, Camera, Award, TrendingUp, DollarSign, Calendar } from 'lucide-react-native';
import StatsCard from '@/components/StatsCard';

export default function ProviderProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [availabilityEnabled, setAvailabilityEnabled] = useState(true);

  const profileSections = [
    {
      title: 'Business',
      items: [
        { icon: User, label: 'Profile & Portfolio', value: null },
        { icon: Award, label: 'Qualifications & Certificates', value: '3 verified' },
        { icon: CreditCard, label: 'Payment & Banking', value: null },
        { icon: MapPin, label: 'Service Areas', value: 'Johannesburg North' },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: Bell, label: 'Job Notifications', value: notificationsEnabled, isSwitch: true, onToggle: setNotificationsEnabled },
        { icon: Calendar, label: 'Availability Status', value: availabilityEnabled, isSwitch: true, onToggle: setAvailabilityEnabled },
      ]
    },
    {
      title: 'Trust & Safety',
      items: [
        { icon: Shield, label: 'Verification Status', value: 'Verified' },
        { icon: Star, label: 'My Reviews', value: '4.9 (127 reviews)' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Provider Help Center', value: null },
        { icon: Settings, label: 'App Settings', value: null },
      ]
    }
  ];

  const renderProfileItem = (item: any, index: number) => (
    <TouchableOpacity key={index} style={styles.profileItem}>
      <View style={styles.itemLeft}>
        <View style={styles.iconContainer}>
          <item.icon color="#6B7280" size={20} />
        </View>
        <Text style={styles.itemLabel}>{item.label}</Text>
      </View>
      
      <View style={styles.itemRight}>
        {item.isSwitch ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#059669' }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <>
            {item.value && <Text style={styles.itemValue}>{item.value}</Text>}
            <ChevronRight color="#D1D5DB" size={20} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Provider Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Provider Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                style={styles.avatarImage}
              />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Sarah Mokoena</Text>
            <Text style={styles.userSpecialty}>Professional Deep Cleaning</Text>
            <Text style={styles.userLocation}>Sandton, Johannesburg</Text>
            <View style={styles.ratingContainer}>
              <Star color="#F59E0B" size={16} fill="#F59E0B" />
              <Text style={styles.ratingText}>4.9 (127 reviews)</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Provider Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <StatsCard
                icon={TrendingUp}
                title="Jobs Completed"
                value="245"
                color="#059669"
              />
            </View>
            <View style={styles.statCard}>
              <StatsCard
                icon={DollarSign}
                title="Total Earned"
                value="R89,500"
                color="#2563EB"
              />
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <StatsCard
                icon={Star}
                title="Average Rating"
                value="4.9"
                subtitle="Based on 127 reviews"
                color="#F59E0B"
              />
            </View>
            <View style={styles.statCard}>
              <StatsCard
                icon={Calendar}
                title="This Month"
                value="12"
                subtitle="Jobs completed"
                color="#8B5CF6"
              />
            </View>
          </View>
        </View>

        {/* Availability Status */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityHeader}>
            <View style={styles.availabilityStatus}>
              <View style={[styles.statusDot, { backgroundColor: availabilityEnabled ? '#10B981' : '#EF4444' }]} />
              <Text style={styles.availabilityText}>
                {availabilityEnabled ? 'Available for Jobs' : 'Not Available'}
              </Text>
            </View>
            <Switch
              value={availabilityEnabled}
              onValueChange={setAvailabilityEnabled}
              trackColor={{ false: '#E5E7EB', true: '#059669' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Text style={styles.availabilityDescription}>
            {availabilityEnabled 
              ? 'You will receive notifications for new job opportunities'
              : 'You will not receive job notifications while unavailable'
            }
          </Text>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => renderProfileItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut color="#EF4444" size={20} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>PieceJob Provider v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
    color: '#111827',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  userSpecialty: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#059669',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
  },
  availabilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  availabilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  availabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  availabilityText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  availabilityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 32,
  },
});