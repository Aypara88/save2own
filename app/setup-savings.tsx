import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Sparkles,
  Clock,
  DollarSign,
  CheckCircle
} from "lucide-react-native";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";
import { useSavings } from "@/providers/savings-provider";

export default function SetupSavingsScreen() {
  const { productId } = useLocalSearchParams();
  const { createSaving } = useSavings();
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  const [customAmount, setCustomAmount] = useState("");
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Product not found</Text>
      </SafeAreaView>
    );
  }

  const frequencies = [
    { 
      id: "daily", 
      name: "Daily", 
      icon: "☀️",
      suggestedAmount: Math.ceil(product.price / 365),
      duration: "365 days"
    },
    { 
      id: "weekly", 
      name: "Weekly", 
      icon: "📅",
      suggestedAmount: Math.ceil(product.price / 52),
      duration: "52 weeks"
    },
    { 
      id: "monthly", 
      name: "Monthly", 
      icon: "🗓️",
      suggestedAmount: Math.ceil(product.price / 12),
      duration: "12 months"
    },
  ];

  const selectedFreq = frequencies.find(f => f.id === selectedFrequency);
  const amount = customAmount ? parseInt(customAmount) : selectedFreq?.suggestedAmount || 0;
  const completionTime = amount > 0 ? Math.ceil(product.price / amount) : 0;

  const handleCreateSaving = async () => {
    if (amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid savings amount");
      return;
    }

    const success = await createSaving(product, amount, selectedFrequency as "daily" | "weekly" | "monthly");
    
    if (success) {
      Alert.alert(
        "Savings Goal Created! 🎉",
        `You're now saving ${formatCurrency(amount)} ${selectedFrequency} towards your ${product.name}`,
        [
          {
            text: "View Progress",
            onPress: () => router.push("/savings" as any),
          }
        ]
      );
    } else {
      Alert.alert("Error", "Failed to create savings goal. Please try again.");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Savings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.productSummary}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
            </View>
            <View style={styles.targetIcon}>
              <Target color="#059669" size={24} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Savings Frequency</Text>
            <View style={styles.frequencyOptions}>
              {frequencies.map((freq) => (
                <TouchableOpacity
                  key={freq.id}
                  style={[
                    styles.frequencyOption,
                    selectedFrequency === freq.id && styles.frequencyOptionActive,
                  ]}
                  onPress={() => {
                    setSelectedFrequency(freq.id);
                    setCustomAmount("");
                  }}
                >
                  <Text style={styles.frequencyEmoji}>{freq.icon}</Text>
                  <Text style={[
                    styles.frequencyName,
                    selectedFrequency === freq.id && styles.frequencyNameActive,
                  ]}>
                    {freq.name}
                  </Text>
                  <Text style={[
                    styles.frequencyAmount,
                    selectedFrequency === freq.id && styles.frequencyAmountActive,
                  ]}>
                    {formatCurrency(freq.suggestedAmount)}
                  </Text>
                  <Text style={[
                    styles.frequencyDuration,
                    selectedFrequency === freq.id && styles.frequencyDurationActive,
                  ]}>
                    {freq.duration}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Amount (Optional)</Text>
            <View style={styles.inputContainer}>
              <DollarSign color="#6B7280" size={20} />
              <TextInput
                style={styles.amountInput}
                placeholder={`Suggested: ${formatCurrency(selectedFreq?.suggestedAmount || 0)}`}
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Savings Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Clock color="#6B7280" size={16} />
                  <Text style={styles.summaryLabel}>Frequency</Text>
                </View>
                <Text style={styles.summaryValue}>{selectedFreq?.name}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <DollarSign color="#6B7280" size={16} />
                  <Text style={styles.summaryLabel}>Amount per {selectedFrequency}</Text>
                </View>
                <Text style={styles.summaryValue}>{formatCurrency(amount)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Calendar color="#6B7280" size={16} />
                  <Text style={styles.summaryLabel}>Completion Time</Text>
                </View>
                <Text style={styles.summaryValue}>
                  {completionTime} {selectedFrequency === "daily" ? "days" : selectedFrequency === "weekly" ? "weeks" : "months"}
                </Text>
              </View>
              
              <View style={[styles.summaryRow, styles.summaryRowHighlight]}>
                <View style={styles.summaryItem}>
                  <Target color="#059669" size={16} />
                  <Text style={[styles.summaryLabel, styles.summaryLabelHighlight]}>Target Amount</Text>
                </View>
                <Text style={[styles.summaryValue, styles.summaryValueHighlight]}>
                  {formatCurrency(product.price)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <CheckCircle color="#059669" size={16} />
                <Text style={styles.benefitText}>Automatic savings deduction</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle color="#059669" size={16} />
                <Text style={styles.benefitText}>Product reserved for you</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle color="#059669" size={16} />
                <Text style={styles.benefitText}>Free delivery when complete</Text>
              </View>
              <View style={styles.benefitItem}>
                <CheckCircle color="#059669" size={16} />
                <Text style={styles.benefitText}>Cancel anytime (small fee applies)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateSaving}
        >
          <Sparkles color="#fff" size={20} />
          <Text style={styles.createButtonText}>Create Savings Goal</Text>
        </TouchableOpacity>
      </View>
      </SafeAreaView>
    </>
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
  backButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  productSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
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
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#059669",
  },
  targetIcon: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  frequencyOptions: {
    gap: 12,
  },
  frequencyOption: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  frequencyOptionActive: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  frequencyEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  frequencyName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  frequencyNameActive: {
    color: "#059669",
  },
  frequencyAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  frequencyAmountActive: {
    color: "#059669",
  },
  frequencyDuration: {
    fontSize: 12,
    color: "#6B7280",
  },
  frequencyDurationActive: {
    color: "#047857",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  amountInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#111827",
  },
  summaryCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryRowHighlight: {
    backgroundColor: "#F0FDF4",
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  summaryLabelHighlight: {
    color: "#047857",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  summaryValueHighlight: {
    color: "#059669",
    fontSize: 16,
    fontWeight: "700",
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: "#374151",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  createButton: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});