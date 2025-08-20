import { Tabs } from "expo-router";
import { House, Store, PiggyBank } from "lucide-react-native";
import React, { useMemo } from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/providers/auth-provider";

export default function TabLayout() {
  const { user } = useAuth();

  const initials = useMemo(() => {
    const name = user?.fullName ?? "";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] ?? "P";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  }, [user?.fullName]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#059669",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: "Marketplace",
          tabBarIcon: ({ color, size }) => (
            <Store color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: "Savings",
          tabBarIcon: ({ color, size }) => (
            <PiggyBank color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, size }) => (
            <View
              testID="tab-profile-avatar"
              accessibilityLabel="Profile tab"
              style={styles.avatarWrapper}
           >
              <View
                style={[
                  styles.ring,
                  focused ? styles.ringActive : styles.ringInactive,
                  { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 },
                ]}
              >
                {user?.avatarUrl ? (
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={{ width: size, height: size, borderRadius: size / 2 }}
                  />
                ) : (
                  <View
                    style={{
                      width: size,
                      height: size,
                      borderRadius: size / 2,
                      backgroundColor: "#E5E7EB",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "700", color: "#374151" }}>
                      {initials}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  ringActive: {
    borderColor: "#059669",
  },
  ringInactive: {
    borderColor: "#E5E7EB",
  },
});