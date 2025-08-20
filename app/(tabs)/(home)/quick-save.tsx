import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, Zap, Calendar, DollarSign } from "lucide-react-native";
import { useWallet } from "@/providers/wallet-provider";
import { useSavings } from "@/providers/savings-provider";
import { formatCurrency } from "@/utils/format";
import { products } from "@/data/products";

export default function QuickSaveScreen() {
  const [amount, setAmount] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  
  const { balance, lockFunds } = useWallet();
  const { createSaving } = useSavings();

  const quickAmounts = [1000, 2000, 5000, 10000];
  const frequencies = [
    { key: "daily" as const, label: "Daily", icon: "📅" },
    { key: "weekly" as const, label: "Weekly", icon: "📊" },
    { key: "monthly" as const, label: "Monthly", icon: "🗓️" },
  ];

  const handleQuickSave = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product to save for");
      return;
    }

    if (numAmount > balance) {
      Alert.alert("Error", "Insufficient balance. Please add funds first.");
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const success = await createSaving(product, numAmount, frequency);
    if (success) {
      lockFunds(numAmount);
      Alert.alert(
        "Success", 
        `Quick save of ${formatCurrency(numAmount)} started for ${product.name}!`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } else {
      Alert.alert("Error", "Failed to create savings goal. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Quick Save</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Save Amount</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <View style={styles.quickAmounts}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickAmountButton}
                onPress={() => setAmount(quickAmount.toString())}
              >
                <Text style={styles.quickAmountText}>
                  {formatCurrency(quickAmount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Product</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.productsRow}>
              {products.slice(0, 5).map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[
                    styles.productCard,
                    selectedProduct === product.id && styles.selectedProduct
                  ]}
                  onPress={() => setSelectedProduct(product.id)}
                >
                  <Image
                    source={{ uri: product.image }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Frequency</Text>
          <View style={styles.frequencyOptions}>
            {frequencies.map((freq) => (
              <TouchableOpacity
                key={freq.key}
                style={[
                  styles.frequencyOption,
                  frequency === freq.key && styles.selectedFrequency
                ]}
                onPress={() => setFrequency(freq.key)}
              >
                <Text style={styles.frequencyEmoji}>{freq.icon}</Text>
                <Text style={[
                  styles.frequencyText,
                  frequency === freq.key && styles.selectedFrequencyText
                ]}>
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (!amount || !selectedProduct || parseFloat(amount) <= 0) && styles.disabledButton
          ]}
          onPress={handleQuickSave}
          disabled={!amount || !selectedProduct || parseFloat(amount) <= 0}
        >
          <Zap color="#fff" size={20} />
          <Text style={styles.saveButtonText}>
            Start Quick Save
          </Text>
        </TouchableOpacity>
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
  balanceCard: {
    backgroundColor: "#ECFDF5",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#047857",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#065F46",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
  productsRow: {
    flexDirection: "row",
    gap: 12,
  },
  productCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    width: 120,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedProduct: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 10,
    color: "#6B7280",
    textAlign: "center",
  },
  frequencyOptions: {
    flexDirection: "row",
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedFrequency: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  frequencyEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  selectedFrequencyText: {
    color: "#059669",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});