import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "savings";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface WalletState {
  balance: number;
  lockedFunds: number;
  transactions: Transaction[];
  addFunds: (amount: number) => Promise<boolean>;
  withdrawFunds: (amount: number) => Promise<boolean>;
  lockFunds: (amount: number) => void;
  unlockFunds: (amount: number) => void;
}

export const [WalletProvider, useWallet] = createContextHook<WalletState>(() => {
  const [balance, setBalance] = useState(0);
  const [lockedFunds, setLockedFunds] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const walletData = await AsyncStorage.getItem("wallet");
      if (walletData) {
        const parsed = JSON.parse(walletData);
        setBalance(parsed.balance || 0);
        setLockedFunds(parsed.lockedFunds || 0);
        setTransactions(parsed.transactions || []);
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  };

  const saveWalletData = async (newBalance?: number, newLockedFunds?: number, newTransactions?: Transaction[]) => {
    try {
      await AsyncStorage.setItem(
        "wallet",
        JSON.stringify({ 
          balance: newBalance ?? balance, 
          lockedFunds: newLockedFunds ?? lockedFunds, 
          transactions: newTransactions ?? transactions 
        })
      );
    } catch (error) {
      console.error("Error saving wallet:", error);
    }
  };

  const addFunds = async (amount: number) => {
    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "deposit",
        amount,
        description: "Wallet Top-up",
        date: new Date().toISOString(),
        status: "completed",
      };

      const newBalance = balance + amount;
      const newTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(newTransactions);
      
      await saveWalletData(newBalance, lockedFunds, newTransactions);
      return true;
    } catch (error) {
      console.error("Error adding funds:", error);
      return false;
    }
  };

  const withdrawFunds = async (amount: number) => {
    try {
      if (balance - lockedFunds < amount) {
        return false;
      }

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "withdrawal",
        amount,
        description: "Withdrawal",
        date: new Date().toISOString(),
        status: "completed",
      };

      const newBalance = balance - amount;
      const newTransactions = [newTransaction, ...transactions];
      
      setBalance(newBalance);
      setTransactions(newTransactions);
      
      await saveWalletData(newBalance, lockedFunds, newTransactions);
      return true;
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      return false;
    }
  };

  const lockFunds = (amount: number) => {
    const newLockedFunds = lockedFunds + amount;
    setLockedFunds(newLockedFunds);
    saveWalletData(balance, newLockedFunds, transactions);
  };

  const unlockFunds = (amount: number) => {
    const newLockedFunds = Math.max(0, lockedFunds - amount);
    setLockedFunds(newLockedFunds);
    saveWalletData(balance, newLockedFunds, transactions);
  };

  return {
    balance,
    lockedFunds,
    transactions,
    addFunds,
    withdrawFunds,
    lockFunds,
    unlockFunds,
  };
});