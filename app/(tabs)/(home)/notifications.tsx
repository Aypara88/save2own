import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info } from "lucide-react-native";

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Savings Goal Completed!",
    message: "Congratulations! You've completed your iPhone 14 savings goal. Your product will be delivered soon.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "info",
    title: "Weekly Savings Reminder",
    message: "Don't forget to make your weekly contribution of ₦15,000 for your PS5 savings goal.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Low Wallet Balance",
    message: "Your wallet balance is running low. Add funds to continue your savings journey.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "4",
    type: "success",
    title: "Funds Added Successfully",
    message: "₦50,000 has been added to your wallet successfully via bank transfer.",
    time: "3 days ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle color="#10B981" size={24} />;
      case "warning":
        return <AlertCircle color="#F59E0B" size={24} />;
      case "info":
        return <Info color="#3B82F6" size={24} />;
      default:
        return <Bell color="#6B7280" size={24} />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "#F0FDF4";
      case "warning":
        return "#FFFBEB";
      case "info":
        return "#EFF6FF";
      default:
        return "#F9FAFB";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              { backgroundColor: getBackgroundColor(notification.type) },
              !notification.read && styles.unreadCard,
            ]}
          >
            <View style={styles.notificationHeader}>
              {getIcon(notification.type)}
              <View style={styles.notificationContent}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        
        {mockNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Bell color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySubtitle}>
              We'll notify you about important updates and savings milestones
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
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#059669",
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
  },
});