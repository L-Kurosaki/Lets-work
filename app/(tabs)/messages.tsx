import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Clock, CircleCheck as CheckCircle2 } from 'lucide-react-native';

interface Message {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle: string;
  status: 'active' | 'completed' | 'pending';
}

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Sarah Mokoena',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'I can start the cleaning job tomorrow at 9 AM. Does that work for you?',
    timestamp: '2 min ago',
    unread: true,
    jobTitle: 'Deep Clean 3-Bedroom House',
    status: 'active'
  },
  {
    id: '2',
    name: 'Themba Dlamini',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'Garden maintenance completed. Thank you for choosing my services!',
    timestamp: '1 hour ago',
    unread: false,
    jobTitle: 'Garden Maintenance & Lawn Care',
    status: 'completed'
  },
  {
    id: '3',
    name: 'Maria Santos',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'I\'ve submitted my bid for R1800. I can complete the painting in 2 days.',
    timestamp: '3 hours ago',
    unread: true,
    jobTitle: 'Painting Interior Walls',
    status: 'pending'
  },
  {
    id: '4',
    name: 'John Williams',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    lastMessage: 'The plumbing repair was successful. Please rate my service when you have a moment.',
    timestamp: '1 day ago',
    unread: false,
    jobTitle: 'Bathroom Plumbing Repair',
    status: 'completed'
  }
];

export default function MessagesScreen() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock color="#F59E0B" size={16} />;
      case 'completed':
        return <CheckCircle2 color="#059669" size={16} />;
      case 'pending':
        return <MessageCircle color="#6B7280" size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#FEF3C7';
      case 'completed':
        return '#ECFDF5';
      case 'pending':
        return '#F3F4F6';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Stay connected with your providers</Text>
      </View>

      <ScrollView style={styles.messagesList} showsVerticalScrollIndicator={false}>
        {mockMessages.map((message) => (
          <TouchableOpacity key={message.id} style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Image source={{ uri: message.avatar }} style={styles.avatar} />
              <View style={styles.messageInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.senderName}>{message.name}</Text>
                  <Text style={styles.timestamp}>{message.timestamp}</Text>
                </View>
                
                <View style={styles.jobContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(message.status) }]}>
                    {getStatusIcon(message.status)}
                    <Text style={styles.statusText}>{message.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.jobTitle} numberOfLines={1}>{message.jobTitle}</Text>
                <Text style={styles.messagePreview} numberOfLines={2}>
                  {message.lastMessage}
                </Text>
              </View>
              
              {message.unread && <View style={styles.unreadIndicator} />}
            </View>
          </TouchableOpacity>
        ))}
        
        {mockMessages.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle color="#D1D5DB" size={64} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDescription}>
              Start a conversation with service providers to discuss your jobs
            </Text>
          </View>
        )}
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
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  jobContainer: {
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  jobTitle: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});