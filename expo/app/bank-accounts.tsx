import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Wallet, Plus, Building2, CreditCard, Trash2 } from 'lucide-react-native';

type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
};

export default function BankAccountsScreen() {
  console.log('[BankAccountsScreen] render');
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      bankName: 'First Bank',
      accountNumber: '1234567890',
      accountName: 'John Doe',
      isDefault: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [bankName, setBankName] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('');

  const handleAddBank = () => {
    if (!bankName.trim() || !accountNumber.trim() || !accountName.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      accountName: accountName.trim(),
      isDefault: bankAccounts.length === 0,
    };

    setBankAccounts([...bankAccounts, newAccount]);
    setBankName('');
    setAccountNumber('');
    setAccountName('');
    setShowAddForm(false);
    Alert.alert('Success', 'Bank account added successfully');
  };

  const handleDeleteBank = (id: string) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to remove this bank account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setBankAccounts(bankAccounts.filter(account => account.id !== id));
          },
        },
      ]
    );
  };

  const handleSetDefault = (id: string) => {
    setBankAccounts(bankAccounts.map(account => ({
      ...account,
      isDefault: account.id === id,
    })));
    Alert.alert('Success', 'Default account updated');
  };

  const renderBankAccount = ({ item }: { item: BankAccount }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.bankIcon}>
          <Building2 color="#059669" size={20} />
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.bankName}>{item.bankName}</Text>
          <Text style={styles.accountNumber}>****{item.accountNumber.slice(-4)}</Text>
          <Text style={styles.accountName}>{item.accountName}</Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteBank(item.id)}
        >
          <Trash2 color="#EF4444" size={18} />
        </TouchableOpacity>
      </View>
      
      {item.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultText}>Default</Text>
        </View>
      )}
      
      {!item.isDefault && (
        <TouchableOpacity
          style={styles.setDefaultButton}
          onPress={() => handleSetDefault(item.id)}
        >
          <Text style={styles.setDefaultText}>Set as Default</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container} testID="bank-accounts-screen">
      <Stack.Screen 
        options={{ 
          title: 'Bank Accounts',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Wallet color="#fff" size={28} />
          <Text style={styles.heroTitle}>Manage bank accounts</Text>
          <Text style={styles.heroSub}>Add or remove your payout accounts for easy cash out.</Text>
        </View>

        {bankAccounts.length > 0 && (
          <View style={styles.accountsContainer}>
            <Text style={styles.sectionTitle}>Your Bank Accounts</Text>
            <FlatList
              data={bankAccounts}
              renderItem={renderBankAccount}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {showAddForm ? (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Bank Account</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bank Name</Text>
              <TextInput
                style={styles.input}
                value={bankName}
                onChangeText={setBankName}
                placeholder="e.g. First Bank, GTBank, UBA"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Number</Text>
              <TextInput
                style={styles.input}
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter 10-digit account number"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Account Name</Text>
              <TextInput
                style={styles.input}
                value={accountName}
                onChangeText={setAccountName}
                placeholder="Account holder name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setBankName('');
                  setAccountNumber('');
                  setAccountName('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddBank}
                testID="add-bank-button"
              >
                <Text style={styles.addButtonText}>Add Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => setShowAddForm(true)}
          >
            <Plus color="#059669" size={20} />
            <Text style={styles.addNewButtonText}>Add New Bank Account</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  hero: { 
    backgroundColor: '#059669', 
    borderRadius: 20, 
    padding: 24, 
    alignItems: 'center', 
    marginBottom: 24 
  },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  heroSub: { fontSize: 14, color: '#D1FAE5', textAlign: 'center' },
  accountsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  accountNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  accountName: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 8,
  },
  defaultBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  defaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  setDefaultButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addNewButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addNewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
});