import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { getFirmwareMetadata, downloadFirmware } from "../utils/firmwareAPI";
import BleService from "../Bluetooth/BleService";
import { base64ToByteArray } from "../utils/base64";
import { CHUNK_SIZE } from "../utils/constants";

export default function OTA() {
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    getFirmwareMetadata()
      .then(setMetadata)
      .catch((err) => {
        console.error("Failed to fetch metadata:", err);
        Alert.alert("Error", "Unable to fetch firmware info.");
      });
  }, []);

  const handleOTAUpdate = async () => {
    try {
      setIsUpdating(true);
      const firmwareData = await downloadFirmware(metadata.url);
      const totalChunks = Math.ceil(firmwareData.length / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const chunk = firmwareData.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
        const byteChunk = base64ToByteArray(chunk); // Now works without Buffer
        await BleService.sendOtaData(Array.from(byteChunk));
        setProgress(((i + 1) / totalChunks) * 100);
      }

      Alert.alert("Success", "Firmware updated!");
    } catch (err) {
      console.error(err);
      Alert.alert("OTA Error", String(err));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Firmware Update</Text>

        {metadata ? (
          <View style={styles.card}>
            <Text style={styles.label}>Latest Version:</Text>
            <Text style={styles.version}>{metadata.version}</Text>
            <Text style={styles.notes}>{metadata.notes}</Text>
            <Text style={styles.date}>Released: {metadata.date}</Text>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
        </View>

        <Button
          title={isUpdating ? "Updating..." : "Start OTA Update"}
          onPress={handleOTAUpdate}
          disabled={isUpdating}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  content: { padding: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginVertical: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  label: { fontSize: 14, color: "#888" },
  version: { fontSize: 20, fontWeight: "bold", color: "#222" },
  notes: { fontSize: 16, marginTop: 5, color: "#333" },
  date: { fontSize: 14, marginTop: 10, color: "#666" },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  progressText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
});
