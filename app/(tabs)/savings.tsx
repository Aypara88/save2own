import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Plus, Target, CheckCircle, Calendar, TrendingUp } from "lucide-react-native";
import { useSavings } from "@/providers/savings-provider";
import { formatCurrency } from "@/utils/format";

export default function SavingsScreen() {
  const { activeSavings, completedSavings } = useSavings();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Savings</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/marketplace")}
        >
          <Target color="#fff" size={18} />
          <Text style={styles.addButtonText}>New Goal</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {activeSavings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp color="#059669" size={20} />
              <Text style={styles.sectionTitle}>Active Goals</Text>
            </View>
            {activeSavings.map((saving) => (
              <TouchableOpacity
                key={saving.id}
                style={styles.savingCard}
                onPress={() =>
                  router.push({
                    pathname: "/savings-detail",
                    params: { id: saving.id },
                  })
                }
              >
                <Image
                  source={{ uri: saving.product.image }}
                  style={styles.savingImage}
                />
                <View style={styles.savingInfo}>
                  <Text style={styles.savingName}>{saving.product.name}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              (saving.currentAmount / saving.targetAmount) *
                              100
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {Math.round(
                        (saving.currentAmount / saving.targetAmount) * 100
                      )}
                      %
                    </Text>
                  </View>
                  <View style={styles.savingDetails}>
                    <Text style={styles.savingAmount}>
                      {formatCurrency(saving.currentAmount)}
                    </Text>
                    <Text style={styles.savingTarget}>
                      of {formatCurrency(saving.targetAmount)}
                    </Text>
                  </View>
                  <View style={styles.nextPaymentContainer}>
                    <Calendar color="#6B7280" size={14} />
                    <Text style={styles.nextPayment}>
                      Next: {formatCurrency(saving.contributionAmount)}{" "}
                      {saving.frequency}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {completedSavings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle color="#10B981" size={20} />
              <Text style={styles.sectionTitle}>Completed Goals</Text>
            </View>
            {completedSavings.map((saving) => (
              <View key={saving.id} style={styles.completedCard}>
                <Image
                  source={{ uri: saving.product.image }}
                  style={styles.completedImage}
                />
                <View style={styles.completedInfo}>
                  <Text style={styles.completedName}>
                    {saving.product.name}
                  </Text>
                  <Text style={styles.completedDate}>
                    Completed on {saving.completedDate}
                  </Text>
                  <View style={styles.completedBadge}>
                    <CheckCircle color="#059669" size={14} />
                    <Text style={styles.completedBadgeText}>Delivered</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeSavings.length === 0 && completedSavings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No savings yet</Text>
            <Text style={styles.emptyStateText}>
              Start saving towards your dream products today!
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push("/marketplace")}
            >
              <Text style={styles.startButtonText}>Browse Products</Text>
            </TouchableOpacity>
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#059669",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  savingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  savingImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  savingInfo: {
    flex: 1,
  },
  savingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginRight: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    width: 35,
  },
  savingDetails: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  savingAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  savingTarget: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  nextPaymentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextPayment: {
    fontSize: 12,
    color: "#6B7280",
  },
  completedCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  completedImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  completedInfo: {
    flex: 1,
  },
  completedName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  completedDate: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 4,
  },
  completedBadgeText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  startButton: {
    backgroundColor: "#059669",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});