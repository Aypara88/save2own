import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Banknote, ShieldCheck, Wallet } from "lucide-react-native";
import { router } from "expo-router";
import { useWallet } from "@/providers/wallet-provider";
import { formatCurrency } from "@/utils/format";

export default function CashOutScreen() {
  const { balance, lockedFunds, withdrawFunds } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [accountName, setAccountName] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const withdrawable = useMemo(() => Math.max(0, balance - lockedFunds), [balance, lockedFunds]);

  const handleCashOut = async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      Alert.alert("Error", "Enter a valid amount");
      return;
    }
    if (num > withdrawable) {
      Alert.alert("Insufficient funds", "You don't have enough available balance");
      return;
    }
    if (!accountName || !accountNumber || !bankName) {
      Alert.alert("Missing details", "Provide bank name, account number and account name");
      return;
    }

    try {
      setIsSubmitting(true);
      const ok = await withdrawFunds(num);
      if (ok) {
        Alert.alert("Request placed", "Cash out initiated. You'll receive funds shortly.", [
          { text: "Done", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Failed", "Could not process cash out. Try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" testID="btn-back">
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Cash Out</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Wallet color="#065F46" size={22} />
          <View style={styles.bannerInfo}>
            <Text style={styles.bannerLabel}>Withdrawable balance</Text>
            <Text style={styles.bannerAmount}>{formatCurrency(withdrawable)}</Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              testID="input-amount"
            />
          </View>
          <View style={styles.quickRow}>
            {[5000, 10000, 20000, 50000].map(v => (
              <TouchableOpacity key={v} style={styles.chip} onPress={() => setAmount(String(v))}>
                <Text style={styles.chipText}>{formatCurrency(v)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Bank</Text>
          <TextInput
            style={styles.textField}
            value={bankName}
            onChangeText={setBankName}
            placeholder="e.g. GTBank"
            placeholderTextColor="#9CA3AF"
            testID="input-bank"
          />
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.textField}
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
            maxLength={10}
            placeholder="1234567890"
            placeholderTextColor="#9CA3AF"
            testID="input-account-number"
          />
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.textField}
            value={accountName}
            onChangeText={setAccountName}
            placeholder="Full name"
            placeholderTextColor="#9CA3AF"
            testID="input-account-name"
          />
        </View>

        <View style={styles.notice}>
          <ShieldCheck color="#059669" size={18} />
          <Text style={styles.noticeText}>Bank withdrawals are processed securely. Transfers may take up to 24 hours.</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, (isSubmitting || withdrawable <= 0) && styles.submitDisabled]}
          disabled={isSubmitting || withdrawable <= 0}
          onPress={handleCashOut}
          accessibilityRole="button"
          testID="btn-submit-cashout"
        >
          <Banknote color="#fff" size={18} />
          <Text style={styles.submitText}>{isSubmitting ? 'Processing...' : 'Withdraw to Bank'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  backButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#111827' },
  placeholder: { width: 40 },
  content: { padding: 20, gap: 20 },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#A7F3D0', padding: 16, borderRadius: 16, gap: 12 },
  bannerInfo: { flex: 1 },
  bannerLabel: { fontSize: 12, color: '#065F46', marginBottom: 6, fontWeight: '600' },
  bannerAmount: { fontSize: 24, color: '#065F46', fontWeight: '800' },
  fieldGroup: { gap: 10 },
  label: { fontSize: 14, color: '#374151', fontWeight: '600' as const },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', paddingHorizontal: 14, paddingVertical: 14 },
  currency: { fontSize: 18, fontWeight: '700' as const, color: '#059669', marginRight: 6 },
  input: { flex: 1, fontSize: 18, fontWeight: '700' as const, color: '#111827' },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#F3F4F6', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 12, color: '#374151', fontWeight: '600' as const },
  textField: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#E5E7EB', paddingHorizontal: 14, paddingVertical: 12, color: '#111827', fontSize: 15 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F0FDF4', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  noticeText: { flex: 1, color: '#065F46', fontSize: 12, fontWeight: '600' as const },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#059669', paddingVertical: 16, borderRadius: 12, marginTop: 10 },
  submitDisabled: { backgroundColor: '#9CA3AF' },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' as const },
});