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
} from "react-native";

type PointItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  rating?: number;
  coordinates: string;
  accuracy?: string;
  createdAt?: string;
  favorite?: boolean; // fitur love
};

type SectionData = {
  title: string;
  data: PointItem[];
};

export default function ListScreen() {
  const firebaseConfig = {
    apiKey: "AIzaSyCLV0r0tzuznU3OlI4M5tzBQ031dSb7TjQ",
    authDomain: "pgpbl-reactnative-aeb49.firebaseapp.com",
    databaseURL:
      "https://pgpbl-reactnative-aeb49-default-rtdb.firebaseio.com",
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
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});

  const handlePress = (coordinates: string) => {
    const [latitude, longitude] = coordinates.split(",").map((c) => c.trim());
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Hapus Lokasi", "Apakah Anda yakin ingin menghapus lokasi ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => remove(ref(db, `points/${id}`)) },
    ]);
  };

  const handleEdit = (item: PointItem) => {
    router.push({
      pathname: "/formeditlocation",
      params: {
        id: item.id,
        name: item.name,
        category: item.category || "",
        description: item.description || "",
        rating: item.rating ?? 0,
        coordinates: item.coordinates,
        accuracy: item.accuracy || "",
        createdAt: item.createdAt || "",
      },
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const pointsRef = ref(db, "points/");
    const unsubscribe = onValue(
      pointsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const pointsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setSections([{ title: "Lokasi Tersimpan", data: pointsArray }]);
        } else setSections([]);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              {/* Card */}
              <View style={styles.item}>
                <TouchableOpacity onPress={() => handlePress(item.coordinates)}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>

                  {item.category && (
                    <View style={styles.row}>
                      <MaterialIcons name="info" size={16} color="#004D40" />
                      <ThemedText style={styles.itemText}>Kategori: {item.category}</ThemedText>
                    </View>
                  )}

                  {item.description && (
                    <View style={styles.row}>
                      <MaterialIcons name="info" size={16} color="#004D40" />
                      <ThemedText style={styles.itemText}>Deskripsi: {item.description}</ThemedText>
                    </View>
                  )}

                  {item.rating !== undefined && (
                    <View style={styles.row}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <ThemedText style={styles.itemText}>
                        {Array.from({ length: 5 })
                          .map((_, i) => (i < (item.rating ?? 0) ? "★" : "☆"))
                          .join("")}{" "}
                        ({item.rating}/5)
                      </ThemedText>
                    </View>
                  )}

                  <View style={styles.row}>
                    <MaterialIcons name="location-on" size={16} color="#004D40" />
                    <ThemedText style={styles.itemText}>Koordinat: {item.coordinates}</ThemedText>
                  </View>

                  {item.accuracy && (
                    <View style={styles.row}>
                      <MaterialIcons name="gps-fixed" size={16} color="#004D40" />
                      <ThemedText style={styles.itemText}>Akurasi: {item.accuracy}</ThemedText>
                    </View>
                  )}

                  {item.createdAt && (
                    <View style={styles.row}>
                      <MaterialIcons name="calendar-today" size={16} color="#004D40" />
                      <ThemedText style={styles.itemText}>
                        Tanggal: {new Date(item.createdAt).toLocaleString()}
                      </ThemedText>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Buttons Row */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.buttonEdit} onPress={() => handleEdit(item)}>
                    <MaterialIcons name="edit" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonDelete} onPress={() => handleDelete(item.id)}>
                    <MaterialIcons name="delete" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonFavorite} onPress={() => toggleFavorite(item.id)}>
                    <MaterialIcons
                      name={favorites[item.id] ? "favorite" : "favorite-border"}
                      size={22}
                      color={favorites[item.id] ? "#E91E63" : "#fff"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.header}>{title}</ThemedText>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <ThemedView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Tidak ada data lokasi tersimpan.</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1FBF9",
    paddingTop: 12,
  },

  /* EMPTY DATA */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#00695C",
    textAlign: "center",
    opacity: 0.7,
  },

  /* SECTION HEADER */
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#004D40",
    backgroundColor: "#A7EDEA",
    paddingVertical: 18,
    paddingHorizontal: 24,
    paddingTop: 40,
    marginBottom: 8,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },

  /* CARD WRAP */
  itemWrapper: {
    marginHorizontal: 18,
    marginBottom: 12,
  },

  /* CARD */
  item: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  /* ROW ICON + TEXT */
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },

  /* CARD TITLE */
  itemName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#004D40",
    marginBottom: 6,
  },

  /* NORMAL TEXT */
  itemText: {
    fontSize: 14,
    color: "#004D40",
    opacity: 0.8,
  },

  /* BUTTONS WRAPPER */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },

  /* BUTTONS */
  buttonEdit: {
    backgroundColor: "#26A69A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonDelete: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonFavorite: {
    backgroundColor: "#00897B",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
});

