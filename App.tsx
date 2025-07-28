import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "./Screens/WelcomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import ConnectDevice from "./Bluetooth/ConnectDevice";
import HomeScreen from "./Screens/HomeScreen";
import SourceScreen from "./Screens/btcTest/Source";
import { StatusBar } from "expo-status-bar";
import "react-native-get-random-values";
import * as Font from "expo-font";
import {
  useFonts as useInterFonts,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import OTA from "./Screens/OTA";
import RecipientScreen from "./Screens/btcTest/Recipient";

const Stack = createStackNavigator();

global.Buffer = Buffer;

export default function App() {
  const [customFontsLoaded, setCustomFontsLoaded] = useState(false);
  const [interFontsLoaded] = useInterFonts({ Inter_700Bold });

  useEffect(() => {
    async function loadCustomFonts() {
      await Font.loadAsync({
        "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
        "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
        "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
      });
      setCustomFontsLoaded(true);
    }

    loadCustomFonts();
  }, []);

  if (!interFontsLoaded || !customFontsLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen">
        <Stack.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConnectDevice"
          component={ConnectDevice}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
          name="OTA"
          component={OTA}
          options={{ headerShown: false }}
        /> */}
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerTitle: "Home", headerShown: true }}
        />
        <Stack.Screen
          name="SourceScreen"
          component={SourceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecipientScreen"
          component={RecipientScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
