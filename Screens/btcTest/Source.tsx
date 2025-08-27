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

const SourceScreen: React.FC = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#1d4ed8", // Blue top bar
      },
      headerTitle: "Source Screen",
      headerTintColor: "#fff",
    });
  }, [navigation]);

  const [selectedSource, setSelectedSource] = useState<string>("Cypherock Red");
  const [selectedAccount, setSelectedAccount] =
    useState<string>("Bitcoin 1 (BTC)");

  const handleSourcePress = () => {
    Alert.alert("Select Source", "Dropdown for sources coming soon...");
  };

  const handleAccountPress = () => {
    Alert.alert("Select Account", "Dropdown for accounts coming soon...");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Source</Text>
        <Text style={styles.subtitle}>Choose a wallet and an account</Text>

        <TouchableOpacity
          style={styles.dropdown} /*onPress={handleSourcePress}*/
        >
          <Text style={styles.dropdownText}>{selectedSource}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdown} /*onPress={handleSourcePress}*/
        >
          <Text style={styles.dropdownText}>{selectedAccount}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RecipientScreen")}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 10 : 0,
  },
  bottomContainer: {
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#000",
    marginBottom: 10,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    fontSize: 20,
    color: "#000",
    marginBottom: 40,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 10,
    // backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  arrow: {
    fontSize: 16,
    color: "#888",
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#d8a01dff",
    paddingVertical: 20,
    paddingHorizontal: 120,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SourceScreen;
