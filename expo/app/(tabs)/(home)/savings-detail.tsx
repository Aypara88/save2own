import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Calendar, 
  Target,
  TrendingUp,
  Clock,
  CheckCircle
} from "lucide-react-native";
import { useSavings } from "@/providers/savings-provider";
import { useWallet } from "@/providers/wallet-provider";
import { formatCurrency } from "@/utils/format";

export default function SavingsDetailScreen() {
  const { id } = useLocalSearchParams();
  const { activeSavings, contributeTo, cancelSaving } = useSavings();
  const { balance, lockFunds } = useWallet();
  const [contributionAmount, setContributionAmount] = useState("");

  const saving = activeSavings.find(s => s.id === id);

  if (!saving) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="#374151" size={24} />
          </TouchableOpacity>
          <Text style={styles.title}>Savings Goal</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Savings goal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const progressPercentage = (saving.currentAmount / saving.targetAmount) * 100;
  const remainingAmount = saving.targetAmount - saving.currentAmount;

  const handleContribute = async () => {
    const amount = parseFloat(contributionAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (amount > balance) {
      Alert.alert("Error", "Insufficient balance. Please add funds first.");
      return;
    }

    const success = await contributeTo(saving.id, amount);
    if (success) {
      lockFunds(amount);
      setContributionAmount("");
      
      if (saving.currentAmount + amount >= saving.targetAmount) {
        Alert.alert(
          "Congratulations! 🎉",
          `You've completed your ${saving.product.name} savings goal! Your product will be delivered soon.`,
          [{ text: "OK", onPress: () => router.back() }]
        );
      } else {
        Alert.alert("Success", `${formatCurrency(amount)} added to your savings!`);
      }
    } else {
      Alert.alert("Error", "Failed to add contribution. Please try again.");
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Savings Goal",
      "Are you sure you want to cancel this savings goal? Your funds will be returned to your wallet.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            const success = await cancelSaving(saving.id);
            if (success) {
              Alert.alert("Cancelled", "Your savings goal has been cancelled and funds returned.", [
                { text: "OK", onPress: () => router.back() }
              ]);
            }
          }
        }
      ]
    );
  };

  const quickAmounts = [1000, 2000, 5000, 10000];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Savings Goal</Text>
        <TouchableOpacity onPress={handleCancel} style={styles.deleteButton}>
          <Trash2 color="#EF4444" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.productCard}>
          <Image source={{ uri: saving.product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{saving.product.name}</Text>
            <Text style={styles.productPrice}>{formatCurrency(saving.targetAmount)}</Text>
            <Text style={styles.productDescription}>{saving.product.description}</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View style={styles.progressTitleContainer}>
              <TrendingUp color="#059669" size={20} />
              <Text style={styles.progressTitle}>Progress</Text>
            </View>
            <Text style={styles.progressPercentage}>{Math.round(progressPercentage)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Saved</Text>
              <Text style={styles.statValue}>{formatCurrency(saving.currentAmount)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={styles.statValue}>{formatCurrency(remainingAmount)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailItem}>
            <Calendar color="#6B7280" size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Frequency</Text>
              <Text style={styles.detailValue}>
                {formatCurrency(saving.contributionAmount)} {saving.frequency}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Clock color="#6B7280" size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Started</Text>
              <Text style={styles.detailValue}>
                {new Date(saving.startDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Target color="#6B7280" size={20} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Estimated Completion</Text>
              <Text style={styles.detailValue}>
                {new Date(saving.estimatedEndDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.contributeSection}>
          <Text style={styles.sectionTitle}>Add Contribution</Text>
          
          <View style={styles.amountInput}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.input}
              value={contributionAmount}
              onChangeText={setContributionAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.quickAmounts}>
            {quickAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => setContributionAmount(amount.toString())}
              >
                <Text style={styles.quickAmountText}>
                  {formatCurrency(amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.contributeButton,
              (!contributionAmount || parseFloat(contributionAmount) <= 0) && styles.disabledButton
            ]}
            onPress={handleContribute}
            disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
          >
            <Plus color="#fff" size={20} />
            <Text style={styles.contributeButtonText}>
              Add {contributionAmount ? formatCurrency(parseFloat(contributionAmount)) : "Contribution"}
            </Text>
          </TouchableOpacity>
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
  deleteButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  productInfo: {
    alignItems: "center",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "600",
    color: "#059669",
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  progressSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#059669",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 6,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  detailsSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  contributeSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  currency: {
    fontSize: 20,
    fontWeight: "600",
    color: "#059669",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  quickAmounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  quickAmountButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  contributeButton: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  contributeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});