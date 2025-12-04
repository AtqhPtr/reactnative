import * as Location from "expo-location";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaterialIcons } from "@expo/vector-icons";

export default function FormEditLocation() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    id,
    name: initialName,
    category: initialCategory,
    description: initialDescription,
    rating: initialRating,
    coordinates: initialCoordinates,
    accuracy: initialAccuracy,
  } = params;

  const [name, setName] = useState(String(initialName ?? ""));
  const [category, setCategory] = useState(String(initialCategory ?? ""));
  const [description, setDescription] = useState(String(initialDescription ?? ""));
  const [rating, setRating] = useState(Number(initialRating ?? 0));
  const [coordinates, setCoordinates] = useState(String(initialCoordinates ?? ""));
  const [accuracy, setAccuracy] = useState(String(initialAccuracy ?? ""));
  const [loadingLocation, setLoadingLocation] = useState(false);

  const predefinedCategories = ["Kuliner", "Pendidikan", "Wisata/Taman", "Kesehatan", "Belanja", "Kantor Publik", "Lainnya"];
  const maxRating = 5;

  // FIREBASE CONFIG
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

  const getCoordinates = async () => {
    setLoadingLocation(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoadingLocation(false);
      return Alert.alert("Izin lokasi ditolak");
    }

    const loc = await Location.getCurrentPositionAsync({});
    setCoordinates(loc.coords.latitude + "," + loc.coords.longitude);
    setAccuracy(loc.coords.accuracy + " m");

    setLoadingLocation(false);
  };

  const handleUpdate = () => {
    if (!id) return Alert.alert("Error", "ID tidak ditemukan");

    update(ref(db, "points/" + id), {
      name,
      category,
      description,
      rating,
      coordinates,
      accuracy,
    })
      .then(() => {
        Alert.alert("Sukses", "Data berhasil diperbarui!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      })
      .catch(() => Alert.alert("Error", "Gagal memperbarui data"));
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Edit Lokasi" }} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <ThemedText type="title" style={styles.title}>
          Edit Lokasi 
        </ThemedText>

        {/* Nama Lokasi */} 
        <ThemedText style={styles.label}>Nama Lokasi</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Contoh: Kedai Kopi Asik"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
        />

        {/* Kategori */}
        <ThemedText style={styles.label}>Kategori</ThemedText>
        <View style={styles.chipsContainer}>
          {predefinedCategories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, category === cat && styles.chipSelected]}
              onPress={() => setCategory(cat)}
            >
              <ThemedText
                style={category === cat ? styles.chipTextSelected : styles.chipText}
              >
                {cat}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Kategori lain (opsional)"
          placeholderTextColor="#777"
          value={category}
          onChangeText={setCategory}
        />

        {/* Deskripsi */}
        <ThemedText style={styles.label}>Deskripsi</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Deskripsikan lokasi..."
          placeholderTextColor="#777"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Rating */}
        <ThemedText style={styles.label}>Rating</ThemedText>
        <View style={styles.ratingContainer}>
          {Array.from({ length: maxRating }).map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <MaterialIcons
                name={i < rating ? "star" : "star-border"}
                size={30}
                color="#FFD700"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Lokasi GPS */}
        <TouchableOpacity style={styles.btnSecondary} onPress={getCoordinates}>
          {loadingLocation ? (
            <ActivityIndicator color="#00796B" />
          ) : (
            <View style={styles.btnContent}>
              <MaterialIcons name="my-location" size={20} color="#00796B" />
              <ThemedText style={styles.btnTextSecondary}>Ambil Lokasi GPS</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {coordinates !== "" && (
          <View style={styles.coordsContainer}>
            <ThemedText style={styles.coordsLabel}>Koordinat:</ThemedText>
            <ThemedText style={styles.coordsValue}>{coordinates}</ThemedText>
            <ThemedText style={styles.coordsValue}>Akurasi: {accuracy}</ThemedText>
          </View>
        )}

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.btnPrimary} onPress={handleUpdate}>
          <ThemedText style={styles.btnTextPrimary}>Perbarui Lokasi</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E0F7F4" },
  scroll: { paddingBottom: 80, gap: 16 },

  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
    color: "#000",
  },
  label: { fontSize: 16, fontWeight: "600", color: "#000", marginTop: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  textArea: { height: 90 },

  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#C8E6C9",
  },
  chipSelected: { backgroundColor: "#009688", borderColor: "#009688" },
  chipText: { color: "#000" },
  chipTextSelected: { color: "#fff" },

  ratingContainer: { flexDirection: "row", gap: 6, marginTop: 8 },

  btnPrimary: {
    backgroundColor: "#009688",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    elevation: 4,
  },
  btnTextPrimary: { color: "#fff", fontSize: 16, fontWeight: "700" },

  btnSecondary: {
    backgroundColor: "#E0F2F1",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  btnContent: { flexDirection: "row", alignItems: "center", gap: 6 },
  btnTextSecondary: {
    color: "#00796B",
    fontSize: 15,
    fontWeight: "600",
  },

  coordsContainer: {
    backgroundColor: "#F1F8F7",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    marginTop: 10,
  },
  coordsLabel: { color: "#000" },
  coordsValue: { color: "#000" },
});
