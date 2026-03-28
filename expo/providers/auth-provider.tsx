import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  isVerified: boolean;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  login: (phoneNumber: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const [AuthProvider, useAuth] = createContextHook<AuthState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const signUp = async (data: {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
  }) => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        isVerified: false,
        avatarUrl: undefined,
      };
      
      await AsyncStorage.setItem("tempUser", JSON.stringify(newUser));
      await AsyncStorage.setItem("tempPassword", data.password);
      
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      // Mock OTP verification - accept any 6-digit code
      if (otp.length === 6) {
        const tempUserData = await AsyncStorage.getItem("tempUser");
        if (tempUserData) {
          const tempUser = JSON.parse(tempUserData);
          tempUser.isVerified = true;
          
          setUser(tempUser);
          setIsAuthenticated(true);
          
          await AsyncStorage.setItem("user", JSON.stringify(tempUser));
          await AsyncStorage.removeItem("tempUser");
          
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("OTP verification error:", error);
      return false;
    }
  };

  const login = async (phoneNumber: string, password: string) => {
    try {
      const mockUser: User = {
        id: "1",
        fullName: "Adebayo Ogunlesi",
        phoneNumber: phoneNumber,
        email: "adebayo@example.com",
        isVerified: true,
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&q=80&auto=format&fit=crop",
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      await AsyncStorage.setItem("user", JSON.stringify(mockUser));
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    signUp,
    verifyOTP,
    login,
    logout,
    updateUser,
  };
});