import { Tabs } from 'expo-router';
import { User, Briefcase, MessageCircle, Settings } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';

function TabBarIcon({ color, size, children }: { color: string; size: number; children: React.ReactNode }) {
  return (
    <View style={styles.tabIconContainer}>
      {children}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon color={color} size={size}>
              <Briefcase color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="providers"
        options={{
          title: 'Providers',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon color={color} size={size}>
              <User color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon color={color} size={size}>
              <MessageCircle color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon color={color} size={size}>
              <Settings color={color} size={size} />
            </TabBarIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});