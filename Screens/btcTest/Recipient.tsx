import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const RecipientScreen: React.FC = () => {
  const navigation = useNavigation();
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const networkFeeBTC = "0.0002 BTC";
  const networkFeeUSD = "$5.51";

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#1d4ed8", // Blue top bar
      },
      headerTitle: "Recipient",
      headerTintColor: "#fff",
    });
  }, [navigation]);

  const handleContinue = () => {
    if (!recipientAddress) {
      Alert.alert("Error", "Please enter a recipient address.");
      return;
    }
    if (!amount || isNaN(Number(amount))) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }
    // Navigate or handle submission
    navigation.navigate("HomeScreen");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>Recipient</Text>
        <Text style={styles.subtitle}>Enter recipient details below</Text>

        <TextInput
          style={styles.input}
          placeholder="Recipient Address"
          value={recipientAddress}
          onChangeText={setRecipientAddress}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Amount to Send"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <Text style={styles.feeText}>
          Network Fees: {networkFeeBTC} ({networkFeeUSD})
        </Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
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
    marginBottom: 20,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  input: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  feeText: {
    fontSize: 16,
    color: "#000",
    marginTop: 20,
    fontFamily: "Poppins-Regular",
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

export default RecipientScreen;
