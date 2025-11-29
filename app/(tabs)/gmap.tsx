import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";

// =============================
// 1. TYPE DEFINITIONS
// =============================
type MarkerItem = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

// =============================
// 2. FIREBASE CONFIG
// =============================
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

// =============================
// 3. MAP SCREEN COMPONENT
// =============================
export default function MapScreen() {
  const [markers, setMarkers] = useState<MarkerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pointsRef = ref(db, "points/");

    const unsubscribe = onValue(
      pointsRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const parsedMarkers: MarkerItem[] = Object.keys(data)
            .map((key) => {
              const point = data[key];

              // Validate coordinates
              if (
                typeof point.coordinates !== "string" ||
                point.coordinates.trim() === ""
              ) {
                return null;
              }

              const [latitude, longitude] = point.coordinates
                .split(",")
                .map(Number);

              if (isNaN(latitude) || isNaN(longitude)) {
                console.warn(
                  `Invalid coordinates for point ${key}:`,
                  point.coordinates
                );
                return null;
              }

              return {
                id: key,
                name: point.name ?? "Unknown",
                latitude,
                longitude,
              };
            })
            .filter((item): item is MarkerItem => item !== null); // Type Guard

          setMarkers(parsedMarkers);
        } else {
          setMarkers([]);
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

  // =============================
  // LOADING INDICATOR
  // =============================
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Loading map data...</Text>
      </View>
    );
  }

  // =============================
  // RENDER MAP & MARKERS
  // =============================
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -7.7956,
          longitude: 110.3695,
          latitudeDelta: 0.02,
          longitudeDelta: 0.01,
        }}
        zoomControlEnabled={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.name}
            description={`Coords: ${marker.latitude}, ${marker.longitude}`}
          />
        ))}
      </MapView>

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/forminputlocation")}
      >
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// =============================
// 4. STYLES
// =============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    left: 20,
    bottom: 20,
    borderRadius: 30,
    backgroundColor: "#0275d8",
    alignItems: "center",
    justifyContent: "center",

    // Android
    elevation: 8,

    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
