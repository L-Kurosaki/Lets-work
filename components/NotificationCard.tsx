import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, MessageCircle, Star } from 'lucide-react-native';
import { Notification } from '@/types';

interface NotificationCardProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
  onMarkAsRead?: (notificationId: string) => void;
}

export default function NotificationCard({ notification, onPress, onMarkAsRead }: NotificationCardProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'bid_received':
        return <Star color="#F59E0B" size={20} />;
      case 'bid_accepted':
        return <CheckCircle color="#059669" size={20} />;
      case 'job_started':
        return <Bell color="#2563EB" size={20} />;
      case 'job_completed':
        return <CheckCircle color="#059669" size={20} />;
      case 'message':
        return <MessageCircle color="#2563EB" size={20} />;
      case 'security_alert':
        return <AlertTriangle color="#EF4444" size={20} />;
      default:
        return <Bell color="#6B7280" size={20} />;
    }
  };

  const getBackgroundColor = () => {
    if (!notification.read) {
      switch (notification.type) {
        case 'security_alert':
          return '#FEF2F2';
        case 'bid_accepted':
        case 'job_completed':
          return '#ECFDF5';
        case 'bid_received':
          return '#FFFBEB';
        default:
          return '#EFF6FF';
      }
    }
    return '#FFFFFF';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: getBackgroundColor() }]}
      onPress={() => onPress?.(notification)}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, !notification.read && styles.unreadTitle]}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{formatTime(notification.timestamp)}</Text>
      </View>
      
      {!notification.read && (
        <View style={styles.unreadDot} />
      )}
      
      {onMarkAsRead && !notification.read && (
        <TouchableOpacity 
          style={styles.markReadButton}
          onPress={() => onMarkAsRead(notification.id)}
        >
          <CheckCircle color="#059669" size={16} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#111827',
  },
  message: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 4,
  },
  time: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
    marginTop: 4,
  },
  markReadButton: {
    padding: 4,
    marginLeft: 8,
  },
});