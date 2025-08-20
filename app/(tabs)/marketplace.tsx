import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Search, SlidersHorizontal, Star, Heart, ShoppingCart, Sparkles } from "lucide-react-native";
import { products, Product } from "@/data/products";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "@/utils/format";
import { useFavorites } from "@/providers/favorites-provider";

export default function MarketplaceScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const categories = [
    { id: "All", name: "All", icon: "🛍️" },
    { id: "Electronics", name: "Electronics", icon: "📱" },
    { id: "Fashion", name: "Fashion", icon: "👕" },
    { id: "Home", name: "Home", icon: "🏠" },
    { id: "Gaming", name: "Gaming", icon: "🎮" },
  ];

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [searchQuery, selectedCategory]);

  const handleStartSaving = (product: any) => {
    router.push({
      pathname: "/setup-savings" as any,
      params: { productId: product.id },
    });
  };

  const handleOpenProduct = (product: any) => {
    router.push({
      pathname: "/product-detail",
      params: { productId: product.id },
    });
  };

  const toggleFavoriteLocal = (productId: string) => {
    toggleFavorite(productId);
  };

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryEmoji}>{item.icon}</Text>
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const ads: { id: string; image: string; title: string; subtitle: string }[] = [
    {
      id: "1",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
      title: "Save for the Latest iPhone",
      subtitle: "Flexible plans. Zero pressure. Start from ₦1,000.",
    },
    {
      id: "2",
      image:
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1600&auto=format&fit=crop",
      title: "Game On, Pay Gradually",
      subtitle: "Own PS5 and Xbox with weekly auto-savings.",
    },
    {
      id: "3",
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1600&auto=format&fit=crop",
      title: "Home Appliances Deals",
      subtitle: "Vendor-backed warranties. Swift delivery.",
    },
  ];

  const scrollRef = useRef<ScrollView | null>(null);
  const [activeAd, setActiveAd] = useState<number>(0);
  const CARD_WIDTH = 320;

  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeAd + 1) % ads.length;
      setActiveAd(next);
      const x = next * (CARD_WIDTH + 12);
      if (scrollRef.current?.scrollTo) {
        scrollRef.current.scrollTo({ x, animated: true });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeAd, ads.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Marketplace</Text>
          <TouchableOpacity style={styles.filterButton}>
            <SlidersHorizontal color="#6B7280" size={20} />
          </TouchableOpacity>
        </View>
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast"
            contentContainerStyle={styles.carousel}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset?.x ?? 0;
              const index = Math.round(offsetX / (CARD_WIDTH + 12));
              setActiveAd(index);
            }}
            testID="marketplace-carousel"
          >
            {ads.map((ad, idx) => (
              <TouchableOpacity
                key={ad.id}
                activeOpacity={0.9}
                style={[styles.adCard, { width: CARD_WIDTH, marginRight: idx === ads.length - 1 ? 0 : 12 }]}
                accessibilityRole="button"
                testID={`ad-card-${ad.id}`}
              >
                <ImageBackground source={{ uri: ad.image }} style={styles.adImage} imageStyle={styles.adImageRadius}>
                  <LinearGradient
                    colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.65)"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.adOverlay}
                  >
                    <Text style={styles.adTitle} numberOfLines={2}>{ad.title}</Text>
                    <Text style={styles.adSubtitle} numberOfLines={2}>{ad.subtitle}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.indicators}>
            {ads.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeAd ? styles.dotActive : null]} />
            ))}
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#9CA3AF" size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              activeOpacity={0.85}
              onPress={() => handleOpenProduct(product)}
              accessibilityRole="button"
              testID={`product-card-${product.id}`}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                />
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavoriteLocal(product.id)}
                  accessibilityRole="button"
                  testID={`favorite-${product.id}`}
                >
                  <Heart 
                    color={isFavorite(product.id) ? "#EF4444" : "#9CA3AF"} 
                    size={16} 
                    fill={isFavorite(product.id) ? "#EF4444" : "transparent"}
                  />
                </TouchableOpacity>
                <View style={styles.ratingBadge}>
                  <Star color="#F59E0B" size={12} fill="#F59E0B" />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={styles.productPrice}>
                  {formatCurrency(product.price)}
                </Text>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => handleStartSaving(product)}
                    accessibilityRole="button"
                    testID={`save-to-own-${product.id}`}
                  >
                    <Sparkles color="#fff" size={14} />
                    <Text style={styles.saveButtonText}>Save to Own</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#111827",
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#fff",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 20,
    margin: "1%",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 6,
    borderRadius: 12,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    height: 40,
    lineHeight: 20,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "800",
    color: "#059669",
    marginBottom: 12,
  },
  productActions: {
    gap: 8,
  },
  saveButton: {
    backgroundColor: "#059669",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#059669",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  adImageRadius: {
    borderRadius: 16,
  },
  carouselContainer: {
    marginBottom: 14,
  },
  carousel: {
    paddingVertical: 2,
    paddingLeft: 0,
  },
  adCard: {
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  adImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  adOverlay: {
    padding: 14,
  },
  adTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  adSubtitle: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
  },
  indicators: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    backgroundColor: '#059669',
    width: 16,
  },
});