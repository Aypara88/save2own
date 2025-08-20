import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Heart } from "lucide-react-native";
import { router } from "expo-router";
import { useFavorites } from "@/providers/favorites-provider";
import { products } from "@/data/products";
import { formatCurrency } from "@/utils/format";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite } = useFavorites();

  const favProducts = useMemo(() => products.filter(p => favorites.includes(p.id)), [favorites]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" testID="btn-back">
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>My Favorites</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {favProducts.length === 0 ? (
          <View style={styles.empty}>
            <Heart color="#9CA3AF" size={36} />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySub}>Tap the heart on any product to save it here.</Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {favProducts.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => router.push({ pathname: "/product-detail", params: { productId: p.id } })}
                accessibilityRole="button"
                testID={`fav-card-${p.id}`}
              >
                <Image source={{ uri: p.image }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={2}>{p.name}</Text>
                  <Text style={styles.price}>{formatCurrency(p.price)}</Text>
                  <TouchableOpacity
                    style={styles.unfav}
                    onPress={() => toggleFavorite(p.id)}
                    accessibilityRole="button"
                    testID={`btn-unfav-${p.id}`}
                  >
                    <Heart size={16} color="#EF4444" fill="#EF4444" />
                    <Text style={styles.unfavText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  content: { padding: 16 },
  empty: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 8 },
  emptySub: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  image: { width: '100%', height: 120 },
  info: { padding: 12, gap: 6 },
  name: { fontSize: 14, fontWeight: '700', color: '#111827', height: 38, lineHeight: 19 },
  price: { fontSize: 16, fontWeight: '800', color: '#059669' },
  unfav: { marginTop: 4, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9999 },
  unfavText: { color: '#991B1B', fontSize: 12, fontWeight: '700' },
});