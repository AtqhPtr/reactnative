import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Plan = {
  id: string;
  title: string;
  date: string;
  description: string;
  done: boolean;
};

export default function Planner() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlan, setNewPlan] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Format tanggal DD/MM/YYYY
  const formatDate = (date: string) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/\d{4}$/;
    return regex.test(date);
  };

  // Auto-format tanggal saat mengetik
  const handleDateInput = (text: string) => {
    // Hanya angka
    const digits = text.replace(/\D/g, "");
    let formatted = digits;

    if (digits.length >= 3 && digits.length <= 4) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2);
    } else if (digits.length >= 5 && digits.length <= 8) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 8);
    } else if (digits.length > 8) {
      formatted = digits.slice(0, 2) + "/" + digits.slice(2, 4) + "/" + digits.slice(4, 8);
    }

    setNewDate(formatted);
  };

  const addPlan = () => {
    if (!newPlan.trim()) {
      Alert.alert("Error", "Judul rencana tidak boleh kosong");
      return;
    }
    if (!formatDate(newDate)) {
      Alert.alert("Error", "Tanggal harus format DD/MM/YYYY");
      return;
    }
    const plan: Plan = {
      id: Date.now().toString(),
      title: newPlan,
      date: newDate,
      description: newDescription || "-",
      done: false,
    };
    setPlans([plan, ...plans]);
    setNewPlan("");
    setNewDate("");
    setNewDescription("");
    setModalVisible(false);
  };

  const toggleDone = (id: string) => {
    setPlans(plans.map(p => (p.id === id ? { ...p, done: !p.done } : p)));
  };

  const deletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planner</Text>
      <Text style={styles.subtitle}>Daftar Rencana</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={{ color: "#fff", marginLeft: 8 }}>Tambah Rencana</Text>
      </TouchableOpacity>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.planItem}>
            <TouchableOpacity onPress={() => toggleDone(item.id)}>
              <Ionicons
                name={item.done ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={item.done ? "#26A69A" : "#777"}
              />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={[styles.planText, item.done && { textDecorationLine: "line-through" }]}>{item.title}</Text>
              <Text style={styles.planDate}>Tanggal: {item.date}</Text>
              <Text style={styles.planDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => deletePlan(item.id)}>
              <Ionicons name="trash" size={22} color="#D32F2F" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Modal tambah rencana */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tambah Rencana Baru</Text>

            <TextInput
              placeholder="Judul Rencana"
              placeholderTextColor="#000"
              style={styles.input}
              value={newPlan}
              onChangeText={setNewPlan}
            />

            <TextInput
              placeholder="Tanggal (DD/MM/YYYY)"
              placeholderTextColor="#000"
              style={styles.input}
              value={newDate}
              onChangeText={handleDateInput}
              keyboardType="numeric"
              maxLength={10} 
            />

            <TextInput
              placeholder="Deskripsi"
              placeholderTextColor="#000"
              style={styles.input}
              value={newDescription}
              onChangeText={setNewDescription}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#26A69A" }]} onPress={addPlan}>
                <Text style={{ color: "#fff" }}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: "#D32F2F" }]} onPress={() => setModalVisible(false)}>
                <Text style={{ color: "#fff" }}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#E0F2F1", paddingTop: 45 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10, color: "#004D40" },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 15, color: "#00796B" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#004D40",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: "center",
  },
  planItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  planText: { fontSize: 16, color: "#333" },
  planDate: { fontSize: 12, color: "#555", marginTop: 2 },
  planDescription: { fontSize: 12, color: "#777", marginTop: 2 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 12, width: "85%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  modalButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center", marginHorizontal: 5 },
});
