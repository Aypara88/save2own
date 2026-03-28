import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Product } from "@/data/products";

interface Saving {
  id: string;
  product: Product;
  targetAmount: number;
  currentAmount: number;
  contributionAmount: number;
  frequency: "daily" | "weekly" | "monthly";
  startDate: string;
  estimatedEndDate: string;
  status: "active" | "completed" | "cancelled";
  completedDate?: string;
}

interface SavingsState {
  activeSavings: Saving[];
  completedSavings: Saving[];
  createSaving: (
    product: Product,
    contributionAmount: number,
    frequency: "daily" | "weekly" | "monthly"
  ) => Promise<boolean>;
  contributeTo: (savingId: string, amount: number) => Promise<boolean>;
  cancelSaving: (savingId: string) => Promise<boolean>;
}

export const [SavingsProvider, useSavings] = createContextHook<SavingsState>(() => {
  const [activeSavings, setActiveSavings] = useState<Saving[]>([]);
  const [completedSavings, setCompletedSavings] = useState<Saving[]>([]);

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    try {
      const savingsData = await AsyncStorage.getItem("savings");
      if (savingsData) {
        const parsed = JSON.parse(savingsData);
        setActiveSavings(parsed.active || []);
        setCompletedSavings(parsed.completed || []);
      }
    } catch (error) {
      console.error("Error loading savings:", error);
    }
  };

  const saveSavingsData = async (newActive?: Saving[], newCompleted?: Saving[]) => {
    try {
      await AsyncStorage.setItem(
        "savings",
        JSON.stringify({ 
          active: newActive ?? activeSavings, 
          completed: newCompleted ?? completedSavings 
        })
      );
    } catch (error) {
      console.error("Error saving savings:", error);
    }
  };

  const createSaving = async (
    product: Product,
    contributionAmount: number,
    frequency: "daily" | "weekly" | "monthly"
  ) => {
    try {
      const daysToComplete = calculateDaysToComplete(
        product.price,
        contributionAmount,
        frequency
      );
      
      const newSaving: Saving = {
        id: Date.now().toString(),
        product,
        targetAmount: product.price,
        currentAmount: 0,
        contributionAmount,
        frequency,
        startDate: new Date().toISOString(),
        estimatedEndDate: calculateEndDate(daysToComplete),
        status: "active",
      };

      const newActiveSavings = [...activeSavings, newSaving];
      setActiveSavings(newActiveSavings);
      await saveSavingsData(newActiveSavings, completedSavings);
      
      return true;
    } catch (error) {
      console.error("Error creating saving:", error);
      return false;
    }
  };

  const contributeTo = async (savingId: string, amount: number) => {
    try {
      let newActiveSavings = [...activeSavings];
      let newCompletedSavings = [...completedSavings];
      
      const savingIndex = newActiveSavings.findIndex(s => s.id === savingId);
      if (savingIndex === -1) return false;
      
      const saving = newActiveSavings[savingIndex];
      const newAmount = saving.currentAmount + amount;
      
      if (newAmount >= saving.targetAmount) {
        // Move to completed
        const completedSaving = {
          ...saving,
          currentAmount: saving.targetAmount,
          status: "completed" as const,
          completedDate: new Date().toISOString(),
        };
        
        newCompletedSavings.push(completedSaving);
        newActiveSavings.splice(savingIndex, 1);
      } else {
        newActiveSavings[savingIndex] = { ...saving, currentAmount: newAmount };
      }
      
      setActiveSavings(newActiveSavings);
      setCompletedSavings(newCompletedSavings);
      
      await saveSavingsData(newActiveSavings, newCompletedSavings);
      return true;
    } catch (error) {
      console.error("Error contributing:", error);
      return false;
    }
  };

  const cancelSaving = async (savingId: string) => {
    try {
      const newActiveSavings = activeSavings.filter((s) => s.id !== savingId);
      setActiveSavings(newActiveSavings);
      await saveSavingsData(newActiveSavings, completedSavings);
      return true;
    } catch (error) {
      console.error("Error cancelling saving:", error);
      return false;
    }
  };

  const calculateDaysToComplete = (
    target: number,
    contribution: number,
    frequency: "daily" | "weekly" | "monthly"
  ) => {
    const periods = Math.ceil(target / contribution);
    switch (frequency) {
      case "daily":
        return periods;
      case "weekly":
        return periods * 7;
      case "monthly":
        return periods * 30;
      default:
        return periods;
    }
  };

  const calculateEndDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  };

  return {
    activeSavings,
    completedSavings,
    createSaving,
    contributeTo,
    cancelSaving,
  };
});