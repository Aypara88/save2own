import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeft, CreditCard, Banknote, Smartphone } from "lucide-react-native";
import { useWallet } from "@/providers/wallet-provider";
import { formatCurrency } from "@/utils/format";

export default function AddFundsScreen() {
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"card" | "bank" | "ussd">("card");
  const { addFunds } = useWallet();

  const quickAmounts = [5000, 10000, 20000, 50000];

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const success = await addFunds(numAmount);
    if (success) {
      Alert.alert("Success", "Funds added successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } else {
      Alert.alert("Error", "Failed to add funds. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Funds</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Enter Amount</Text>
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

        <View style={styles.methodSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === "card" && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod("card")}
          >
            <CreditCard color="#059669" size={24} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Debit Card</Text>
              <Text style={styles.methodSubtitle}>Visa, Mastercard, Verve</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === "bank" && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod("bank")}
          >
            <Banknote color="#059669" size={24} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>Bank Transfer</Text>
              <Text style={styles.methodSubtitle}>Direct bank transfer</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodOption,
              selectedMethod === "ussd" && styles.selectedMethod
            ]}
            onPress={() => setSelectedMethod("ussd")}
          >
            <Smartphone color="#059669" size={24} />
            <View style={styles.methodInfo}>
              <Text style={styles.methodTitle}>USSD</Text>
              <Text style={styles.methodSubtitle}>*737# and other codes</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            (!amount || parseFloat(amount) <= 0) && styles.disabledButton
          ]}
          onPress={handleAddFunds}
          disabled={!amount || parseFloat(amount) <= 0}
        >
          <Text style={styles.addButtonText}>
            Add {amount ? formatCurrency(parseFloat(amount)) : "Funds"}
          </Text>
        </TouchableOpacity>
      </View>
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
  amountSection: {
    marginBottom: 32,
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
    paddingVertical: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  currency: {
    fontSize: 24,
    fontWeight: "600",
    color: "#059669",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
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
  methodSection: {
    marginBottom: 32,
  },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedMethod: {
    borderColor: "#059669",
    backgroundColor: "#F0FDF4",
  },
  methodInfo: {
    marginLeft: 16,
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  methodSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  addButton: {
    backgroundColor: "#059669",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});