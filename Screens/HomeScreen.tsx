import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import BleService from "../Bluetooth/BleService";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [ignitionOn, setIgnitionOn] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#1d4ed8", // Blue top bar
      },
      headerTitle: "",
      headerRight: () => (
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("OTA")}
          >
            <MaterialIcons name="system-update" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("ConnectDevice")}
          >
            <MaterialIcons name="bluetooth" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const toggleIgnition = async () => {
    const newState = !ignitionOn;
    setIgnitionOn(newState);
    try {
      await BleService.toggleIgnition(newState);
    } catch (e) {
      Alert.alert("BLE Error", e.message || String(e));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Mazout Electric</Text>
        <Text style={styles.deviceId}>Device ID: MAZ01-184</Text>
      </View>

      <View style={styles.centerContent}>
        {/* Glowing Outer Layer */}
        <View
          style={[
            styles.ignitionGlow,
            ignitionOn ? styles.glowGreen : styles.glowRed,
          ]}
        >
          <TouchableOpacity
            style={[
              styles.ignitionButton,
              ignitionOn ? styles.ignitionOn : styles.ignitionOff,
            ]}
            onPress={toggleIgnition}
          >
            <MaterialIcons
              name="power-settings-new"
              size={50}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.ignitionLabel}>Ignition</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  brand: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#f97316", // Orange
    fontFamily: Platform.OS === "ios" ? "Inter" : "sans-serif",
  },
  deviceId: {
    fontSize: 16,
    color: "#000000",
    marginTop: 6,
    fontFamily: Platform.OS === "ios" ? "Inter" : "sans-serif",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
    marginRight: 10,
  },
  iconButton: {
    backgroundColor: "#1d4ed8",
    padding: 8,
    borderRadius: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ignitionGlow: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    padding: 20,
    marginBottom: 10,
  },
  glowGreen: {
    backgroundColor: "rgba(34, 197, 94, 0.2)", // Green glow
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  glowRed: {
    backgroundColor: "rgba(239, 68, 68, 0.2)", // Red glow
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  ignitionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#1e293b", // Slate color
    fontFamily: Platform.OS === "ios" ? "Poppins-Medium" : "sans-serif",
  },
  ignitionButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a", // Inner dark circle
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  ignitionOn: {
    borderWidth: 6,
    borderColor: "#22c55e", // Green border
    shadowColor: "#22c55e",
  },
  ignitionOff: {
    borderWidth: 6,
    borderColor: "#ef4444", // Red border
    shadowColor: "#ef4444",
  },
});

export default HomeScreen;
