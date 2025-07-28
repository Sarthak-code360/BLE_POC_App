import React from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import {
  Button,
  Card,
  Container,
  ScreenContainer,
  Typography,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Images } from '@/constants';
import BleManager from 'react-native-ble-manager';

export default function BlePermission() {
  const { strings } = useAppSelector(selectLanguage);

  async function requestBLEPermission() {
    if (Platform.OS !== 'android') {
      router.replace('/ble-scan');
      return;
    }

    try {
      const fineResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: strings.onboarding.blePermission.title,
          message: strings.onboarding.blePermission.description,
          buttonPositive: strings.buttons.ok,
        },
      );

      let scanResult = PermissionsAndroid.RESULTS.GRANTED;
      let connectResult = PermissionsAndroid.RESULTS.GRANTED;

      if (Platform.Version >= 31) {
        scanResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: strings.onboarding.blePermission.title,
            message: strings.onboarding.blePermission.description,
            buttonPositive: strings.buttons.ok,
          },
        );
        connectResult = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: strings.onboarding.blePermission.title,
            message: strings.onboarding.blePermission.description,
            buttonPositive: strings.buttons.ok,
          },
        );
      }

      const allGranted =
        fineResult === PermissionsAndroid.RESULTS.GRANTED &&
        scanResult === PermissionsAndroid.RESULTS.GRANTED &&
        connectResult === PermissionsAndroid.RESULTS.GRANTED;

      if (!allGranted) {
        return Alert.alert(
          strings.onboarding.blePermission.alert.title,
          strings.onboarding.blePermission.alert.description,
          [{ text: strings.buttons.ok }],
        );
      }

      try {
        await BleManager.enableBluetooth();
        await new Promise(res => setTimeout(res, 500));
      } catch (enableError) {
        console.warn('⚠️ User refused to enable Bluetooth', enableError);
        return;
      }

      router.replace('/ble-scan');
    } catch (err) {
      console.warn('⚠️ Permission request error:', err);
    }
  }

  return (
    <ScreenContainer>
      <Container style={styles.container}>
        <Card style={styles.card}>
          <Image
            source={Images.icon.ble}
            style={styles.image}
            contentFit="contain"
          />
        </Card>

        <View style={styles.textBlock}>
          <Typography type="h2">
            {strings.onboarding.blePermission.title}
          </Typography>
          <Typography type="para">
            {strings.onboarding.blePermission.description}
          </Typography>
        </View>
      </Container>

      <View style={styles.footer}>
        <Button
          title={strings.buttons.grantPermission}
          onPress={requestBLEPermission}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  card: {
    width: 72,
    height: 72,
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  footer: {
    paddingHorizontal: 24,
    marginBottom: 50,
    width: '100%',
  },
});
