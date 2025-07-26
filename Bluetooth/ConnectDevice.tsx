// Bluetooth/ConnectDevice.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RippleEffect from "./RippleEffect";
import BleService from "./BleService";
import type { Peripheral } from "react-native-ble-manager";

const ConnectDevice = () => {
  const [isScanning, setScanning] = useState(false);
  const [bleDevices, setDevices] = useState<Peripheral[]>([]);
  const [currentDevice, setCurrentDevice] = useState<Peripheral | null>(null);

  useEffect(() => {
    // 1) Enable Bluetooth + permissions
    BleService.enableAndPerms();

    // 2) Start scanning
    setScanning(true);
    const stop = BleService.scan((device: Peripheral) => {
      // Deduplicate on every update
      setDevices((prev) => {
        if (!device.name) return prev;
        const exists = prev.some((d) => d.id === device.id);
        return exists ? prev : [...prev, device];
      });
    });

    // 3) Auto‑stop after 10s
    const timeout = setTimeout(() => {
      stop();
      setScanning(false);
    }, 10_000);

    return () => {
      stop();
      clearTimeout(timeout);
    };
  }, []);

  const handleConnect = async (dev: Peripheral) => {
    try {
      await BleService.connect(dev.id);
      setCurrentDevice(dev);
    } catch (e) {
      Alert.alert("Connection Error", e.message || String(e));
    }
  };

  const handleDisconnect = async () => {
    if (!currentDevice) return;
    await BleService.disconnect();
    setCurrentDevice(null);
  };

  const renderItem = ({ item }: { item: Peripheral }) => (
    <View style={styles.bleCard}>
      <Text style={styles.bleTxt}>{item.name}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          currentDevice?.id === item.id
            ? handleDisconnect()
            : handleConnect(item)
        }
      >
        <Text style={styles.btnTxt}>
          {currentDevice?.id === item.id ? "Disconnect" : "Connect"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {isScanning ? (
        <View style={styles.rippleView}>
          <RippleEffect />
          <Text style={styles.scanText}>Scanning for devices…</Text>
        </View>
      ) : (
        <FlatList
          data={bleDevices}
          keyExtractor={(item, index) => `${item.id}_${index}`} // use device.id as unique key
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 10 }}
        />
      )}

      {!isScanning && (
        <TouchableOpacity
          style={styles.scanBtn}
          onPress={() => {
            // Reset and scan again
            setDevices([]);
            setScanning(true);
            const stopAgain = BleService.scan((device) => {
              setDevices((prev) => {
                if (!device.name) return prev;
                return prev.some((d) => d.id === device.id)
                  ? prev
                  : [...prev, device];
              });
            });
            setTimeout(() => {
              stopAgain();
              setScanning(false);
            }, 10_000);
          }}
        >
          <Text style={styles.btnTxt}>
            {currentDevice ? "Rescan Devices" : "Start Scan"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ORANGE = "#FF6B00";
const BLACK = "#1C1C1E";
const WHITE = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingTop: hp(6),
    paddingBottom: hp(2),
  },
  rippleView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanText: {
    marginTop: 12,
    fontSize: 16,
    color: BLACK,
  },
  bleCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bleTxt: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: BLACK,
    flexShrink: 1,
  },
  button: {
    backgroundColor: ORANGE,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnTxt: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: WHITE,
  },
  scanBtn: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: hp(2),
    alignItems: "center",
    elevation: 6,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
});

export default ConnectDevice;
