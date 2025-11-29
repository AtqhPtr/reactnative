import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, remove, update } from "firebase/database";
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
  coordinates: string;
  accuration?: string;
};

type SectionData = {
  title: string;
  data: PointItem[];
};

export default function LokasiScreen() {
  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyCLV0r0tzuznU3OlI4M5tzBQ031dSb7TjQ",
    authDomain: "pgpbl-reactnative-aeb49.firebaseapp.com",
    databaseURL: "https://pgpbl-reactnative-aeb49-default-rtdb.firebaseio.com",
    projectId: "pgpbl-reactnative-aeb49",
    storageBucket: "pgpbl-reactnative-aeb49.firebasestorage.app",
    messagingSenderId: "599238243909",
    appId: "1:599238243909:web:1bdb8e1885c795a16b552c",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const router = useRouter();

  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buka Google Maps
  const handlePress = (coordinates: string) => {
    const [latitude, longitude] = coordinates
      .split(",")
      .map((coord) => coord.trim());
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  // Hapus data
  const handleDelete = (id: string) => {
    Alert.alert("Hapus Lokasi", "Apakah Anda yakin ingin menghapus lokasi ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          const pointRef = ref(db, `points/${id}`);
          remove(pointRef);
        },
      },
    ]);
  };

  // Edit lokasi
  const handleEdit = (item: PointItem) => {
    router.push({
      pathname: "/formeditlocation",
      params: {
        id: item.id,
        name: item.name,
        coordinates: item.coordinates,
        accuration: item.accuration || "",
      },
    });
  };

  // Ambil data Firebase realtime
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

          setSections([
            {
              title: "Lokasi Tersimpan",
              data: pointsArray,
            },
          ]);
        } else {
          setSections([]);
        }
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
    <View style={styles.container}>
      {sections.length > 0 ? (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              {/* Card */}
              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePress(item.coordinates)}
              >
                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                <ThemedText style={styles.itemCoords}>
                  {item.coordinates}
                </ThemedText>
              </TouchableOpacity>

              {/* Edit Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEdit(item)}
              >
                <MaterialIcons name="edit" size={26} color="orange" />
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete(item.id)}
              >
                <MaterialIcons name="delete" size={26} color="red" />
              </TouchableOpacity>
            </View>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedText style={styles.header}>{title}</ThemedText>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <ThemedView style={styles.container}>
          <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
        </ThemedView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#000",
    color: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: "100%",
  },

  itemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 6,
  },

  item: {
    flex: 1,
    backgroundColor: "#a7dcffff",
    padding: 16,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },

  itemCoords: {
    fontSize: 14,
    marginTop: 4,
    color: "#333",
  },

  iconButton: {
    padding: 6,
  },
});
