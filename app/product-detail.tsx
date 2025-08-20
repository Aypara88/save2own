import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, Stack } from "expo-router";
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  Sparkles, 
  Target, 
  Shield,
  Truck
} from "lucide-react-native";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.container}>
          <Text>Product not found</Text>
        </SafeAreaView>
      </>
    );
  }

  const handleStartSaving = () => {
    router.push({
      pathname: "/setup-savings" as any,
      params: { productId: product.id },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            color={isFavorite ? "#EF4444" : "#6B7280"} 
            size={24} 
            fill={isFavorite ? "#EF4444" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
          />
          <View style={styles.ratingBadge}>
            <Star color="#F59E0B" size={16} fill="#F59E0B" />
            <Text style={styles.ratingText}>4.8 (2.1k reviews)</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.productHeader}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{product.category}</Text>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Save to Own?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: "#EFF6FF" }]}>
                  <Target color="#2563EB" size={20} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Flexible Savings</Text>
                  <Text style={styles.benefitText}>Save at your own pace - daily, weekly, or monthly</Text>
                </View>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: "#F0FDF4" }]}>
                  <Shield color="#059669" size={20} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Secure & Protected</Text>
                  <Text style={styles.benefitText}>Your savings are safe and guaranteed</Text>
                </View>
              </View>
              
              <View style={styles.benefitItem}>
                <View style={[styles.benefitIcon, { backgroundColor: "#FEF3C7" }]}>
                  <Truck color="#D97706" size={20} />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={styles.benefitTitle}>Free Delivery</Text>
                  <Text style={styles.benefitText}>Get your product delivered to your doorstep</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Savings Calculator</Text>
            <View style={styles.calculatorCard}>
              <View style={styles.calculatorRow}>
                <Text style={styles.calculatorLabel}>Save ₦10,000 monthly</Text>
                <Text style={styles.calculatorValue}>
                  Complete in {Math.ceil(product.price / 10000)} months
                </Text>
              </View>
              <View style={styles.calculatorRow}>
                <Text style={styles.calculatorLabel}>Save ₦5,000 weekly</Text>
                <Text style={styles.calculatorValue}>
                  Complete in {Math.ceil(product.price / (5000 * 4))} months
                </Text>
              </View>
              <View style={styles.calculatorRow}>
                <Text style={styles.calculatorLabel}>Save ₦1,000 daily</Text>
                <Text style={styles.calculatorValue}>
                  Complete in {Math.ceil(product.price / (1000 * 30))} months
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.startSavingButton}
          onPress={handleStartSaving}
          accessibilityRole="button"
          testID="save-to-own-cta"
        >
          <Sparkles color="#fff" size={20} />
          <Text style={styles.startSavingButtonText}>Save to Own</Text>
        </TouchableOpacity>
      </View>
        </SafeAreaView>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
  favoriteButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
  },
  imageContainer: {
    position: "relative",
    marginTop: 80,
  },
  productImage: {
    width: width,
    height: 300,
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  content: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productHeader: {
    marginBottom: 24,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  productName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 34,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "800",
    color: "#059669",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#6B7280",
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  calculatorCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  calculatorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  calculatorLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  calculatorValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  startSavingButton: {
    backgroundColor: "#059669",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startSavingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});