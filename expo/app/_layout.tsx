import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/providers/auth-provider";
import { WalletProvider } from "@/providers/wallet-provider";
import { SavingsProvider } from "@/providers/savings-provider";
import { FavoritesProvider } from "@/providers/favorites-provider";
import { BackendProvider } from "@/providers/backend-provider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    const init = async () => {
      try {
        await SystemUI.setBackgroundColorAsync("#059669");
      } catch (e) {
        console.log("SystemUI background set failed", e);
      } finally {
        SplashScreen.hideAsync();
      }
    };
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#059669" }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#059669"
          translucent={false}
        />
        <BackendProvider>
          <AuthProvider>
            <WalletProvider>
              <SavingsProvider>
                <FavoritesProvider>
                  <RootLayoutNav />
                </FavoritesProvider>
              </SavingsProvider>
            </WalletProvider>
          </AuthProvider>
        </BackendProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}