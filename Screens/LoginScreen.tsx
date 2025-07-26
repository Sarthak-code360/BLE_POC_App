import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const LoginScreen = ({ navigation }) => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (userID && password) {
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }, { name: "ConnectDevice" }],
      });
    } else {
      Alert.alert(
        "Required",
        "Please enter both UserID and Password to proceed."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Welcome back!</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="User ID"
            placeholderTextColor="#999"
            value={userID}
            onChangeText={setUserID}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.helpText}>
            Need help? Email us at{" "}
            <Text style={styles.linkText}>info@mazoutelectric.com</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ORANGE = "#FF6B00";
const BLACK = "#1C1C1E";
const WHITE = "#FFFFFF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    textAlign: "center",
    color: BLACK,
    marginBottom: 20,
  },
  card: {
    backgroundColor: WHITE,
    padding: 24,
    borderRadius: 16,
    shadowColor: BLACK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  input: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    color: BLACK,
  },
  button: {
    backgroundColor: ORANGE,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    color: WHITE,
    fontSize: 16,
  },
  helpText: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#888",
    fontSize: 12,
    marginTop: 20,
  },
  linkText: {
    fontFamily: "Poppins-SemiBold",
    color: ORANGE,
  },
});

export default LoginScreen;
