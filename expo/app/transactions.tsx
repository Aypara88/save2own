import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { History, ArrowUpRight, ArrowDownLeft, Filter, Calendar } from 'lucide-react-native';

type TransactionType = 'save' | 'cashout' | 'add_funds' | 'purchase';

type Transaction = {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
};

const TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    title: 'Quick Save',
    description: 'Saved for iPhone 15 Pro',
    amount: -2000,
    type: 'save',
    date: 'Aug 20, 2025',
    time: '2:30 PM',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Cash Out',
    description: 'Withdrawal to First Bank',
    amount: 5500,
    type: 'cashout',
    date: 'Aug 18, 2025',
    time: '10:15 AM',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Add Funds',
    description: 'Bank transfer from GTBank',
    amount: 10000,
    type: 'add_funds',
    date: 'Aug 15, 2025',
    time: '4:45 PM',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Product Purchase',
    description: 'MacBook Pro 14-inch',
    amount: -850000,
    type: 'purchase',
    date: 'Aug 12, 2025',
    time: '11:20 AM',
    status: 'completed',
  },
  {
    id: '5',
    title: 'Quick Save',
    description: 'Saved for vacation fund',
    amount: -5000,
    type: 'save',
    date: 'Aug 10, 2025',
    time: '6:00 PM',
    status: 'pending',
  },
];

export default function TransactionsScreen() {
  console.log('[TransactionsScreen] render');
  const [filter, setFilter] = useState<'all' | TransactionType>('all');
  
  const filteredTransactions = filter === 'all' 
    ? TRANSACTIONS 
    : TRANSACTIONS.filter(tx => tx.type === filter);

  const getTransactionIcon = (type: TransactionType, amount: number) => {
    if (amount > 0) {
      return <ArrowDownLeft color="#059669" size={20} />;
    } else {
      return <ArrowUpRight color="#DC2626" size={20} />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return '#059669';
      case 'pending': return '#D97706';
      case 'failed': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString();
    return amount > 0 ? `+₦${formatted}` : `-₦${formatted}`;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.iconContainer}>
          {getTransactionIcon(item.type, item.amount)}
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionDate}>{item.date}</Text>
            <Text style={styles.transactionTime}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: item.amount > 0 ? '#059669' : '#DC2626' }]}>
            {formatAmount(item.amount)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container} testID="transactions-screen">
      <Stack.Screen 
        options={{ 
          title: 'Transaction History',
          headerStyle: { backgroundColor: '#059669' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.hero}>
        <History color="#fff" size={28} />
        <Text style={styles.heroTitle}>Your Transaction History</Text>
        <Text style={styles.heroSub}>Track all your savings and spending activity</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'save' && styles.filterButtonActive]}
          onPress={() => setFilter('save')}
        >
          <Text style={[styles.filterText, filter === 'save' && styles.filterTextActive]}>Savings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'cashout' && styles.filterButtonActive]}
          onPress={() => setFilter('cashout')}
        >
          <Text style={[styles.filterText, filter === 'cashout' && styles.filterTextActive]}>Cash Out</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, filter === 'add_funds' && styles.filterButtonActive]}
          onPress={() => setFilter('add_funds')}
        >
          <Text style={[styles.filterText, filter === 'add_funds' && styles.filterTextActive]}>Add Funds</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <History color="#9CA3AF" size={48} />
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptyText}>Your transaction history will appear here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  hero: { 
    backgroundColor: '#059669', 
    padding: 24, 
    borderRadius: 20, 
    margin: 20, 
    alignItems: 'center' 
  },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 8, marginBottom: 4 },
  heroSub: { fontSize: 14, color: '#D1FAE5', textAlign: 'center' },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#fff',
  },
  list: { 
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});