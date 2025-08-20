import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Plus,
  Banknote,
  Bell,
  Target,
  History,
  Sparkles,
  TrendingUp,
  Zap,
  Heart,
} from "lucide-react-native";
import { useWallet } from "@/providers/wallet-provider";
import { useSavings } from "@/providers/savings-provider";
import { formatCurrency } from "@/utils/format";
import { LinearGradient } from "expo-linear-gradient";
import BouncePressable from "@/components/BouncePressable";

export default function HomeScreen() {
  const { balance } = useWallet();
  const { activeSavings } = useSavings();

  const top3 = useMemo(() => activeSavings.slice(0, 3), [activeSavings]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>Adebayo</Text>
        </View>
        <BouncePressable
          style={styles.notificationButton}
          onPress={() => router.push("/(tabs)/(home)/notifications")}
          accessibilityRole="button"
          testID="btn-notifications"
        >
          <Bell color="#374151" size={24} />
        </BouncePressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1600&auto=format&fit=crop" }}
          style={styles.balanceCard}
          imageStyle={styles.balanceCardImage}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.65)"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.balanceCardOverlay}
          >
          <View style={styles.balanceHeader}>
            <View>
              <Text style={styles.balanceLabel}>Total Savings</Text>
              <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
              <Text style={styles.balanceSubtext}>Available for new goals</Text>
            </View>
            <View style={styles.sparkleIconDark}>
              <Sparkles color="#A7F3D0" size={32} />
            </View>
          </View>

          <View style={styles.actionButtons}>
            <BouncePressable
              style={styles.actionButton}
              onPress={() => router.push("/(tabs)/(home)/add-funds")}
              accessibilityRole="button"
              testID="btn-add-funds"
            >
              <View style={styles.actionButtonIconWrap}>
                <Plus color="#059669" size={18} />
              </View>
              <View style={styles.actionButtonLabelWrap}>
                <Text style={styles.actionButtonText} numberOfLines={1} ellipsizeMode="tail">Add Funds</Text>
              </View>
            </BouncePressable>

            <BouncePressable
              style={styles.actionButton}
              onPress={() => router.push("./cash-out")}
              accessibilityRole="button"
              testID="btn-cash-out"
            >
              <View style={styles.actionButtonIconWrap}>
                <Banknote color="#059669" size={18} />
              </View>
              <View style={styles.actionButtonLabelWrap}>
                <Text style={styles.actionButtonText} numberOfLines={1} ellipsizeMode="tail">Cash Out</Text>
              </View>
            </BouncePressable>
          </View>
          </LinearGradient>
        </ImageBackground>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <BouncePressable
              style={styles.quickAction}
              onPress={() => router.push("./quick-save")}
              accessibilityRole="button"
              testID="qa-quick-save"
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#EFF6FF" }]}>
                <Zap color="#2563EB" size={24} />
              </View>
              <Text style={styles.quickActionText}>Quick Save</Text>
            </BouncePressable>
            <BouncePressable
              style={styles.quickAction}
              onPress={() => router.push("/savings")}
              accessibilityRole="button"
              testID="qa-history"
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#FEF3C7" }]}>
                <History color="#D97706" size={24} />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </BouncePressable>
            <BouncePressable 
              style={styles.quickAction} 
              accessibilityRole="button" 
              testID="qa-favorites"
              onPress={() => router.push("./favorites")}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: "#FEF2F2" }]}>
                <Heart color="#EF4444" size={24} />
              </View>
              <Text style={styles.quickActionText}>Favorites</Text>
            </BouncePressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <TrendingUp color="#059669" size={20} />
              <Text style={styles.sectionTitle}>Active Savings Goals</Text>
            </View>
            <BouncePressable onPress={() => router.push("/savings")} accessibilityRole="button" testID="btn-see-all-goals">
              <Text style={styles.seeAll}>See All</Text>
            </BouncePressable>
          </View>

          {activeSavings.length === 0 ? (
            <View style={styles.emptyState}>
              <Target color="#9CA3AF" size={48} />
              <Text style={styles.emptyStateTitle}>No active savings yet</Text>
              <Text style={styles.emptyStateSubtext}>Start saving towards your dream products</Text>
              <BouncePressable
                style={styles.startSavingButton}
                onPress={() => router.push("/marketplace")}
                accessibilityRole="button"
                testID="btn-start-saving"
              >
                <Text style={styles.startSavingButtonText}>Start Saving</Text>
              </BouncePressable>
            </View>
          ) : (
            top3.map((saving) => (
              <BouncePressable
                key={saving.id}
                style={styles.savingCard}
                onPress={() =>
                  router.push({ pathname: "/(tabs)/(home)/savings-detail", params: { id: saving.id } })
                }
                accessibilityRole="button"
                testID={`saving-card-${saving.id}`}
              >
                <Image source={{ uri: saving.product.image }} style={styles.savingImage} />
                <View style={styles.savingInfo}>
                  <Text style={styles.savingName}>{saving.product.name}</Text>
                  <Text style={styles.savingProgress}>
                    {formatCurrency(saving.currentAmount)} of {formatCurrency(saving.targetAmount)}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(saving.currentAmount / saving.targetAmount) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.savingPercentage}>
                    {Math.round((saving.currentAmount / saving.targetAmount) * 100)}% Complete
                  </Text>
                </View>
              </BouncePressable>
            ))
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  greeting: {
    fontSize: 14,
    color: "#6B7280",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  notificationButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  balanceCard: {
    margin: 20,
    padding: 0,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 180,
  },
  balanceCardImage: {
    borderRadius: 20,
  },
  balanceCardOverlay: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  sparkleIconDark: {
    backgroundColor: "rgba(5, 150, 105, 0.25)",
    padding: 12,
    borderRadius: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#D1FAE5",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 12,
    color: "#A7F3D0",
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 18,
  },
  actionButton: {
    flex: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 52,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
    letterSpacing: 0.3,
    flexShrink: 1,
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  actionButtonLabelWrap: {
    paddingHorizontal: 12,
    maxWidth: '75%',
  },
  seeAll: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  startSavingButton: {
    backgroundColor: "#059669",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startSavingButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  savingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  savingImage: {
    width: 68,
    height: 68,
    borderRadius: 14,
    marginRight: 16,
  },
  savingInfo: {
    flex: 1,
  },
  savingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  savingProgress: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  savingPercentage: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    gap: 16,
  },
  quickAction: {
    alignItems: 'center',
    width: 96,
  },
  quickActionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  actionButtonIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
  },
});
