import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

type PointItem = {
  id: string;
  name: string;
  coordinates: string;
  category?: string;
  description?: string;
  rating?: number;
  favorite?: boolean;
};

type SectionData = {
  title: string;
  data: PointItem[];
};

export default function FavoriteScreen() {
  const firebaseConfig = {
    apiKey: "AIzaSyCLV0r0tzuznU3OlI4M5tzBQ031dSb7TjQ",
    authDomain: "pgpbl-reactnative-aeb49.firebaseapp.com",
    databaseURL: "https://pgpbl-reactnative-aeb49-default-rtdb.firebaseio.com",
    projectId: "pgpbl-reactnative-aeb49",
    storageBucket: "pgpbl-reactnative-aeb49.firebasestorage.app",
    messagingSenderId: "599238243909",
    appId: "1:599238243909:web:1bdb8e1885c795a16b552c",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const router = useRouter();

  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [
    "Kuliner",
    "Pendidikan",
    "Wisata/Taman",
    "Kesehatan",
    "Kantor Publik",
    "Lainnya",
  ];

  const handlePress = (coordinates: string) => {
    const [lat, lng] = coordinates.split(",").map((c) => c.trim());
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Lokasi", "Yakin ingin menghapus?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => remove(ref(db, `points/${id}`)),
      },
    ]);
  };

  const handleEdit = (item: PointItem) => {
    router.push({
      pathname: "/formeditlocation",
      params: {
        id: item.id,
        name: item.name,
        coordinates: item.coordinates,
        category: item.category ?? "",
        description: item.description ?? "",
        rating: item.rating ?? 0,
      },
    });
  };

  useEffect(() => {
    const pointsRef = ref(db, "points/");
    const unsubscribe = onValue(pointsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const favoritePoints = Object.keys(data)
          .filter((k) => data[k].favorite === true)
          .map((k) => ({ id: k, ...data[k] }));

        const filtered = activeCategory
          ? favoritePoints.filter((p) => p.category === activeCategory)
          : favoritePoints;

        setSections([{ title: "Lokasi Favorit", data: filtered }]);
      } else {
        setSections([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeCategory]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const renderRight = (item: PointItem) => (
    <TouchableOpacity style={styles.swipeDelete} onPress={() => handleDelete(item.id)}>
      <MaterialIcons name="delete" size={26} color="#fff" />
    </TouchableOpacity>
  );

  const renderLeft = (item: PointItem) => (
    <TouchableOpacity style={styles.swipeEdit} onPress={() => handleEdit(item)}>
      <MaterialIcons name="edit" size={26} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.header}>Lokasi Favorit</ThemedText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterWrapper}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterChip,
              activeCategory === cat && styles.filterChipActive,
            ]}
            onPress={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
          >
            <MaterialIcons
              name={
                cat === "Kuliner"
                  ? "restaurant"
                  : cat === "Wisata/Taman"
                  ? "map"
                  : cat === "Pendidikan"
                  ? "school"
                  : cat === "Kesehatan"
                  ? "local-hospital"
                  : cat === "Kantor Publik"
                  ? "business"
                  : "category"
              }
              size={18}
              color={activeCategory === cat ? "#fff" : "#009688"}
              style={styles.filterIcon}
            />

            <ThemedText
              style={[
                styles.filterText,
                activeCategory === cat && styles.filterTextActive,
              ]}
            >
              {cat}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {sections[0]?.data.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 0 }}
          renderItem={({ item }) => {
            const fadeAnim = new Animated.Value(0);
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }).start();

            return (
              <Swipeable
                renderRightActions={() => renderRight(item)}
                renderLeftActions={() => renderLeft(item)}
              >
                <Animated.View style={[styles.itemWrapper, { opacity: fadeAnim }]}>
                  <TouchableOpacity
                    style={styles.item}
                    activeOpacity={0.8}
                    onPress={() => handlePress(item.coordinates)}
                  >
                    <View style={styles.headerRow}>
                      <ThemedText style={styles.itemName}>{item.name}</ThemedText>

                      {item.rating ? (
                        <View style={styles.ratingBadge}>
                          <MaterialIcons name="star" size={16} color="#fff" />
                          <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
                        </View>
                      ) : null}
                    </View>

                    {item.category && (
                      <ThemedText style={styles.categoryLabel}>
                        Kategori: {item.category}
                      </ThemedText>
                    )}

                    {item.description && (
                      <ThemedText style={styles.itemText}>
                        Deskripsi: {item.description}
                      </ThemedText>
                    )}

                    <ThemedText style={styles.itemText}>📍 {item.coordinates}</ThemedText>

                    <TouchableOpacity onPress={() => handlePress(item.coordinates)} style={styles.openButton}>
                      <MaterialIcons name="directions" size={18} color="#fff" />
                      <ThemedText style={styles.openButtonText}>Arahkan</ThemedText>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Animated.View>
              </Swipeable>
            );
          }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Tidak ada lokasi favorit.</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E0F7F4" },

  header: {
    fontSize: 22,
    fontWeight: "700",
    backgroundColor: "#A7EDEA",
    padding: 14,
    paddingTop: 50,
    paddingLeft: 20,
    color: "#004D40",
  },

  filterWrapper: {
    marginTop: 4,
    paddingLeft: 16,
    paddingVertical: 4,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#009688",
    backgroundColor: "#fff",
    marginRight: 10,
  },

  filterChipActive: {
    backgroundColor: "#009688",
    borderColor: "#009688",
  },

  filterText: {
    fontSize: 13,
    color: "#009688",
    fontWeight: "600",
  },

  filterTextActive: { color: "#fff" },

  filterIcon: { marginRight: 6 },

  itemWrapper: {
    marginHorizontal: 16,
    marginVertical: 6,
  },

  item: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemName: { fontSize: 18, fontWeight: "700", color: "#000" },
  itemText: { marginTop: 6, fontSize: 14, color: "#333" },

  categoryLabel: {
    marginTop: 4,
    fontSize: 13,
    color: "#00796B",
    fontWeight: "600",
  },

  openButton: {
    marginTop: 12,
    backgroundColor: "#009688",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    
    alignItems: "center",
    gap: 6,
  },

  openButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  ratingBadge: {
    backgroundColor: "#FFA000",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ratingText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  swipeDelete: {
    backgroundColor: "#D32F2F",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginVertical: 9,
    borderRadius: 14,
  },

  swipeEdit: {
    backgroundColor: "#0275d8",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: 9,
    borderRadius: 14,
  },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#000" },
});
