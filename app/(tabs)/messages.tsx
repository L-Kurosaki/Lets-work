import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { MessageCircle, Clock, CircleCheck as CheckCircle2, ArrowLeft } from 'lucide-react-native';
import { Message } from '@/types';
import { dataService } from '@/services/dataService';
import ChatInterface from '@/components/ChatInterface';

interface MessageThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  jobTitle: string;
  status: 'active' | 'completed' | 'pending';
  userId: string;
}

export default function MessagesScreen() {
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showChat, setShowChat] = useState(false);

  const currentUserId = 'customer1'; // In a real app, this would come from auth

  useEffect(() => {
    loadMessageThreads();
  }, []);

  const loadMessageThreads = () => {
    // Mock message threads - in a real app, this would come from the API
    const mockThreads: MessageThread[] = [
      {
        id: '1',
        name: 'Sarah Mokoena',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'I can start the cleaning job tomorrow at 9 AM. Does that work for you?',
        timestamp: '2 min ago',
        unread: true,
        jobTitle: 'Deep Clean 3-Bedroom House',
        status: 'active',
        userId: 'provider1'
      },
      {
        id: '2',
        name: 'Themba Dlamini',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'Garden maintenance completed. Thank you for choosing my services!',
        timestamp: '1 hour ago',
        unread: false,
        jobTitle: 'Garden Maintenance & Lawn Care',
        status: 'completed',
        userId: 'provider2'
      },
      {
        id: '3',
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'I\'ve submitted my bid for R1800. I can complete the painting in 2 days.',
        timestamp: '3 hours ago',
        unread: true,
        jobTitle: 'Painting Interior Walls',
        status: 'pending',
        userId: 'provider3'
      },
      {
        id: '4',
        name: 'John Williams',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        lastMessage: 'The plumbing repair was successful. Please rate my service when you have a moment.',
        timestamp: '1 day ago',
        unread: false,
        jobTitle: 'Bathroom Plumbing Repair',
        status: 'completed',
        userId: 'provider4'
      }
    ];

    setMessageThreads(mockThreads);
  };

  const loadMessages = (threadId: string) => {
    // Mock messages for the selected thread
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'provider1',
        receiverId: currentUserId,
        content: 'Hi! I saw your cleaning job posting. I have 8+ years of experience in deep cleaning.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text',
        read: true
      },
      {
        id: '2',
        senderId: currentUserId,
        receiverId: 'provider1',
        content: 'Great! Can you tell me more about your approach to deep cleaning?',
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        type: 'text',
        read: true
      },
      {
        id: '3',
        senderId: 'provider1',
        receiverId: currentUserId,
        content: 'I use eco-friendly products and follow a systematic approach. I can start tomorrow at 9 AM if that works for you.',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        type: 'text',
        read: false
      }
    ];

    setMessages(mockMessages);
  };

  const handleThreadPress = (thread: MessageThread) => {
    setSelectedThread(thread);
    loadMessages(thread.id);
    setShowChat(true);
    
    // Mark thread as read
    setMessageThreads(prev => 
      prev.map(t => 
        t.id === thread.id ? { ...t, unread: false } : t
      )
    );
  };

  const handleSendMessage = async (content: string, type: 'text' | 'image') => {
    if (!selectedThread) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      receiverId: selectedThread.userId,
      content,
      timestamp: new Date().toISOString(),
      type,
      read: false
    };

    setMessages(prev => [...prev, newMessage]);

    // Update the thread's last message
    setMessageThreads(prev =>
      prev.map(thread =>
        thread.id === selectedThread.id
          ? { ...thread, lastMessage: content, timestamp: 'Just now' }
          : thread
      )
    );

    // In a real app, you would send this to your backend
    try {
      await dataService.sendMessage({
        senderId: newMessage.senderId,
        receiverId: newMessage.receiverId,
        content: newMessage.content,
        type: newMessage.type,
        jobId: selectedThread.id
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

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
        {messageThreads.map((thread) => (
          <TouchableOpacity key={thread.id} style={styles.messageCard} onPress={() => handleThreadPress(thread)}>
            <View style={styles.messageHeader}>
              <Image source={{ uri: thread.avatar }} style={styles.avatar} />
              <View style={styles.messageInfo}>
                <View style={styles.nameContainer}>
                  <Text style={styles.senderName}>{thread.name}</Text>
                  <Text style={styles.timestamp}>{thread.timestamp}</Text>
                </View>
                
                <View style={styles.jobContainer}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(thread.status) }]}>
                    {getStatusIcon(thread.status)}
                    <Text style={styles.statusText}>{thread.status}</Text>
                  </View>
                </View>
                
                <Text style={styles.jobTitle} numberOfLines={1}>{thread.jobTitle}</Text>
                <Text style={styles.messagePreview} numberOfLines={2}>
                  {thread.lastMessage}
                </Text>
              </View>
              
              {thread.unread && <View style={styles.unreadIndicator} />}
            </View>
          </TouchableOpacity>
        ))}
        
        {messageThreads.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle color="#D1D5DB" size={64} />
            <Text style={styles.emptyTitle}>No messages yet</Text>
            <Text style={styles.emptyDescription}>
              Start a conversation with service providers to discuss your jobs
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedThread && (
          <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setShowChat(false)}
              >
                <ArrowLeft color="#2563EB" size={24} />
              </TouchableOpacity>
              <Image source={{ uri: selectedThread.avatar }} style={styles.chatAvatar} />
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderName}>{selectedThread.name}</Text>
                <Text style={styles.chatHeaderJob}>{selectedThread.jobTitle}</Text>
              </View>
            </View>
            
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={currentUserId}
            />
          </View>
        )}
      </Modal>
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
  chatContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  chatHeaderJob: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});