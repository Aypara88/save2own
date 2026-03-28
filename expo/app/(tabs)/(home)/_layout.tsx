import { Stack } from "expo-router";
import React from "react";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add-funds" />
      <Stack.Screen name="savings-detail" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="quick-save" />
      <Stack.Screen name="cash-out" />
      <Stack.Screen name="favorites" />
    </Stack>
  );
}