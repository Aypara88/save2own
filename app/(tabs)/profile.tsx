import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  UserRound,
  Wallet,
  History,
  Shield,
  Settings2,
  MessageCircleQuestion,
  LogOut,
  ChevronRight,
  Sparkles,
  Edit3,
} from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { useWallet } from "@/providers/wallet-provider";
import { formatCurrency } from "@/utils/format";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { balance } = useWallet();

  const handleLogout = useCallback(() => {
    logout();
    router.replace("/(auth)/login");
  }, []);

  const menuItems = [
    {
      icon: UserRound,
      title: "Personal Information",
      subtitle: "Manage your profile details",
      onPress: () => router.push("/profile-edit"),
      color: "#3B82F6",
      bgColor: "#EFF6FF",
    },
    {
      icon: Wallet,
      title: "Bank Accounts",
      subtitle: "Add or remove bank accounts",
      onPress: () => router.push("/bank-accounts"),
      color: "#059669",
      bgColor: "#ECFDF5",
    },
    {
      icon: History,
      title: "Transaction History",
      subtitle: "View all your transactions",
      onPress: () => router.push("/transactions"),
      color: "#D97706",
      bgColor: "#FEF3C7",
    },
    {
      icon: Shield,
      title: "Security",
      subtitle: "PIN and security settings",
      onPress: () => router.push("/security"),
      color: "#DC2626",
      bgColor: "#FEF2F2",
    },
    {
      icon: Settings2,
      title: "Settings",
      subtitle: "App preferences and notifications",
      onPress: () => router.push("/settings"),
      color: "#6B7280",
      bgColor: "#F3F4F6",
    },
    {
      icon: MessageCircleQuestion,
      title: "Help & Support",
      subtitle: "FAQs and customer support",
      onPress: () => router.push("/support"),
      color: "#7C3AED",
      bgColor: "#F3E8FF",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity testID="profile-edit-button" accessibilityLabel="Edit profile" onPress={() => router.push("/profile-edit")} style={styles.editButton}>
          <Edit3 color="#6B7280" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0) || "A"}
              </Text>
            </View>
            <View style={styles.sparkleContainer}>
              <Sparkles color="#F59E0B" size={24} />
            </View>
          </View>
          <Text style={styles.userName}>{user?.fullName || "Adebayo"}</Text>
          <Text style={styles.userPhone}>+234{user?.phoneNumber || "8012345678"}</Text>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Savings</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={index}
                testID={`profile-menu-item-${index}`}
                accessibilityLabel={item.title}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIconContainer, { backgroundColor: item.bgColor }]}>
                    <Icon color={item.color} size={20} />
                  </View>
                  <View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#9CA3AF" size={20} />
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity testID="logout-button" accessibilityLabel="Log out" style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#EF4444" size={20} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  editButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  profileCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  profileHeader: {
    position: "relative",
    marginBottom: 16,
  },
  sparkleContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FEF3C7",
    padding: 6,
    borderRadius: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#D1FAE5",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#059669",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },
  balanceContainer: {
    width: "100%",
    backgroundColor: "#ECFDF5",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 12,
    color: "#059669",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  version: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});