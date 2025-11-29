import * as Location from "expo-location";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

const App = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    id,
    name: initialName,
    coordinates: initialCoordinates,
    accuration: initialAccuration,
  } = params;

  // STATE
  const [name, setName] = useState(String(initialName ?? ""));
  const [location, setLocation] = useState(String(initialCoordinates ?? ""));
  const [accuration, setAccuration] = useState(String(initialAccuration ?? ""));

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

  // Ambil lokasi terkini
  const getCoordinates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Ditolak", "Izin lokasi diperlukan.");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    const coords = `${loc.coords.latitude},${loc.coords.longitude}`;
    setLocation(coords);
    setAccuration(loc.coords.accuracy + " m");
  };

  // Alert sukses
  const createOneButtonAlert = (callback: () => void) =>
    Alert.alert("Success", "Berhasil memperbarui data", [
      { text: "OK", onPress: callback },
    ]);

  // UPDATE DATA
  const handleUpdate = () => {
    if (!id) {
      Alert.alert("Error", "ID lokasi tidak ditemukan.");
      return;
    }

    const pointRef = ref(db, `points/${id}`);

    update(pointRef, {
      name: name,
      coordinates: location,
      accuration: accuration,
    })
      .then(() => {
        createOneButtonAlert(() => {
          router.back(); // kembali ke list lokasi
        });
      })
      .catch((e) => {
        console.error("Error updating data: ", e);
        Alert.alert("Error", "Gagal memperbarui data");
      });
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "white" }}>
      <SafeAreaView>
        <Stack.Screen options={{ title: "Form Edit Location" }} />

        <Text style={styles.inputTitle}>Nama</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan nama objek"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.inputTitle}>Koordinat</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan koordinat"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.inputTitle}>Akurasi</Text>
        <TextInput
          style={styles.input}
          placeholder="Isikan akurasi lokasi"
          value={accuration}
          onChangeText={setAccuration}
        />

        <View style={styles.button}>
          <Button title="Get Current Location" onPress={getCoordinates} />
        </View>

        <View style={styles.button}>
          <Button title="Save" color="#e40f0fff" onPress={handleUpdate} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  inputTitle: {
    marginLeft: 12,
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    margin: 12,
  },
});

export default App;
