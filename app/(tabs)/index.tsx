import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const categories = [
    { name: "Kuliner", count: 3 },
    { name: "Pendidikan", count: 2 },
    { name: "Wisata/Taman", count: 4 },
    { name: "Kesehatan", count: 1 },
    { name: "Kantor Publik", count: 2 },
    { name: "Lainnya", count: 0 },
  ];

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const goToFavorite = () => {
  router.push("/favorite");
  };
  const goToPlanner = () => {
    router.push("/planner");
  };

  const favorites = [
    {
      id: 1,
      name: "Warung Soto Pak Budi",
      icon: "restaurant",
      coords: { latitude: -6.2, longitude: 106.816 },
      category: "Kuliner",
    },
    {
      id: 2,
      name: "Taman Kota",
      icon: "leaf",
      coords: { latitude: -6.201, longitude: 106.817 },
      category: "Wisata/Taman",
    },
    {
      id: 3,
      name: "RSUD Jakarta",
      icon: "medkit",
      coords: { latitude: -6.202, longitude: 106.818 },
      category: "Kesehatan",
    },
  ];

  // Pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // simulasi refresh
  }, []);

  // Filter favorit berdasarkan kategori aktif
  const filteredFavorites = activeCategory
    ? favorites.filter((fav) => fav.category === activeCategory)
    : favorites;

   const goToAddLocation = () => {
    router.push("/forminputlocation");
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* NOTIFICATION BANNER */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>
          Tips: Cek restoran baru dekat kamu hari ini!
        </Text>
      </View>

      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logopin.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={22}
          color="#666"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Cari lokasi favoritmu, contoh: restoran, taman..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* QUICK FEATURES */}
      <Text style={styles.sectionTitle}>Fitur Cepat</Text>

      <View style={styles.quickRow}>
        {/* Planner */}
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: "#FF8A65" }]}
          onPress={goToPlanner} // ← navigasi ke halaman Planner
        >
          <Text style={styles.quickTitle}>Planner</Text>
          <Text style={styles.quickDesc}>Atur Rencana</Text>
          <View style={styles.quickIconCircle}>
            <Ionicons name="calendar" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Favorite */}
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: "#26A69A" }]}
          onPress={goToFavorite} // ← navigasi ke halaman Favorite
        >
          <Text style={styles.quickTitle}>Favorite</Text>
          <Text style={styles.quickDesc}>Lihat Lokasi</Text>
          <View style={styles.quickIconCircle}>
            <Ionicons name="heart" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* New Note */}
        <TouchableOpacity
          style={[styles.quickCard, { backgroundColor: "#FF8A65" }]}
          onPress={goToAddLocation}
        >
          <Text style={styles.quickTitle}>New Note</Text>
          <Text style={styles.quickDesc}>Buat Baru</Text>
          <View style={styles.quickIconCircle}>
            <Ionicons name="add" size={18} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

      {/* INFO BOX */}
      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle"
          size={26}
          color="#26564dff"
          style={{ marginRight: 8 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>Apa itu PinMeUp?</Text>
          <Text style={styles.infoDesc}>
            PinMeUp adalah aplikasi untuk menyimpan dan menandai lokasi favoritmu
            langsung pada peta. Cocok untuk kuliner, wisata, sekolah, dan tempat
            tujuan lain!
          </Text>
        </View>
      </View>

      {/* FEATURE INFO */}
      <View style={styles.featureRow}>
        <FeatureItem icon="bookmark" title="Simpan Lokasi" desc="Tambah titik favoritmu." />
        <FeatureItem icon="map" title="Peta Interaktif" desc="Tandai langsung di peta." />
        <FeatureItem icon="pin" title="Kelola Titik" desc="Edit & hapus kapan saja." />
      </View>

      {/* MAP PREVIEW */}
      <Text style={styles.sectionTitle}>Pratinjau Peta</Text>

      <View style={styles.mapPreview}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: -6.2,
            longitude: 106.816,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {filteredFavorites.map((fav) => (
            <Marker
              key={fav.id}
              coordinate={fav.coords}
              title={fav.name}
              description="Lokasi favorit"
            />
          ))}
        </MapView>
      </View>

      {/* CATEGORIES */}
      <Text style={styles.sectionTitle}>Kategori Populer</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 15 }}
      >
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tag,
              activeCategory === item.name && { backgroundColor: "#004D40" },
            ]}
            onPress={() =>
              setActiveCategory(
                activeCategory === item.name ? null : item.name
              )
            }
          >
            <Text style={styles.tagText}>
              {item.name} {item.count > 0 && `(${item.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MAIN BUTTON */}
      <TouchableOpacity style={styles.mainButton}>
        <Ionicons name="arrow-forward" size={18} color="white" />
        <Text style={styles.mainButtonText}>Mulai Tandai Lokasi</Text>
      </TouchableOpacity>

      {/* FOOTER */}
      <View style={styles.footerCard}>
        <Text style={styles.footerText}>PinMeUp v1.0 © 2025</Text>
      </View>
    </ScrollView>
  );
}

type FeatureProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
};

const FeatureItem: React.FC<FeatureProps> = ({ icon, title, desc }) => (
  <View style={styles.featureBox}>
    <Ionicons name={icon} size={28} color="#fff" style={{ marginBottom: 6 }} />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#E0F2F1",
  },

  banner: {
    backgroundColor: "#004D40",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  bannerText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 2,
  },

  logoImage: {
    width: 180,
    height: 180,
    marginBottom: 6,
    resizeMode: "contain",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  featureBox: {
    flex: 1,
    backgroundColor: "#009688",
    marginHorizontal: 5,
    padding: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  featureTitle: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 3,
    fontSize: 13,
  },
  featureDesc: {
    color: "#E0F2F1",
    fontSize: 11,
    textAlign: "center",
  },

  mapPreview: {
    height: 200,
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E0F2F1",
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
    alignItems: "flex-start",
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#090909ff",
    marginBottom: 4,
  },
  infoDesc: {
    fontSize: 12,
    color: "#0b0b0bff",
    lineHeight: 16,
  },

  tag: {
    backgroundColor: "#009688",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  tagText: {
    color: "white",
    fontSize: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#004D40",
    marginBottom: 8,
    marginTop: 10,
  },

  quickRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  quickCard: {
    width: "31%",
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  quickTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  quickDesc: {
    color: "#fefefe",
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 12,
  },
  quickIconCircle: {
    backgroundColor: "rgba(255,255,255,0.38)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  favoriteCard: {
    backgroundColor: "#009688",
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: "center",
    width: 140,
  },
  favoriteText: {
    color: "#fff",
    marginTop: 6,
    textAlign: "center",
    fontSize: 12,
  },

  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#004D40",
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 20,
  },
  mainButtonText: {
    color: "white",
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "700",
  },

  footerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0F2F1",
    padding: 10,
    borderRadius: 12,
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: "#555",
  },
});
