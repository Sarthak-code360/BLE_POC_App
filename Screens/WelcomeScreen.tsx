import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const ORANGE = "#FF6B00";
const BLACK = "#1C1C1E";
const WHITE = "#FFFFFF";

const slides = [
  {
    key: "1",
    title: "Welcome to Cypherock",
    text: "Allow all permissions to connect your Cypherock device.",
  },
  {
    key: "2",
    title: "Step 1",
    text: "Plug-in the USB adaptor to the device.",
    image: require("../assets/IOT.jpeg"),
  },
  {
    key: "3",
    title: "Step 2",
    text: "Wait for the LED to turn green.",
    image: require("../assets/IOT.jpeg"),
  },
  {
    key: "4",
    title: "Step 3",
    text: "Allow the application to access location.",
    image: require("../assets/LocationAccess.jpeg"),
  },
  {
    key: "5",
    title: "Step 4",
    text: "Allow the application to access Bluetooth.",
    image: require("../assets/BluetoothAccess.jpeg"),
  },
  {
    key: "6",
    title: "Experience a digital connect with your Cypherock device.",
  },
];

const WelcomeScreen = ({ navigation }) => {
  const [showRealApp, setShowRealApp] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRealApp(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderSlides = ({ item }) => (
    <View style={styles.slide}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        {item.text && <Text style={styles.text}>{item.text}</Text>}
        {item.image && <Image source={item.image} style={styles.image} />}
        {item.key === "6" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!showRealApp) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
        <Text style={styles.splashText}>Cypherock</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <AppIntroSlider
        renderItem={renderSlides}
        data={slides}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        showNextButton={false}
        showDoneButton={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  splashLogo: {
    fontSize: 64,
    marginBottom: 20,
  },
  splashText: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    color: "#FF6B00",
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#1C1C1E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    width: "100%",
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    textAlign: "center",
    color: "#1C1C1E",
    marginBottom: 10,
  },
  text: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF6B00",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 10,
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    fontSize: 16,
  },
  dotStyle: {
    backgroundColor: "#ccc",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDotStyle: {
    backgroundColor: "#FF6B00",
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default WelcomeScreen;
