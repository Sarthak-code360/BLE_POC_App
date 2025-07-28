import React, { useEffect, useState, useRef } from 'react';
import {
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  View,
  ActivityIndicator,
  Pressable,
  BackHandler,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {
  ScreenContainer,
  Container,
  Typography,
  Success,
  Button,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useTheme } from 'styled-components/native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Images } from '@/constants';
import { BleScanAnimation } from '@/components/ui/molecules/BleScanAnimation';

const BleEmitter = new NativeEventEmitter(NativeModules.BleManager);

export default function BleScan() {
  const { strings } = useAppSelector(selectLanguage);
  const theme = useTheme();
  const router = useRouter();

  const [scanning, setScanning] = useState(true);
  const [isPaired, setIsPaired] = useState(false);
  const fallbackTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const backAction = () => {
      router.replace('/ble-permission');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    const subscription = BleEmitter.addListener('BleManagerStopScan', () =>
      setScanning(false),
    );

    BleManager.scan([], 10, false).catch(err => {
      console.error('ble-scan: scan start error', err);
      setScanning(false);
    });

    fallbackTimer.current = setTimeout(() => {
      console.warn('ble-scan: fallback stop after 10s');
      setScanning(false);
    }, 10000);

    return () => {
      subscription.remove();
      if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
      backHandler.remove();
    };
  }, []);

  if (isPaired) {
    return (
      <ScreenContainer>
        <Container>
          <Success title={strings.onboarding.bleScan.paired} />
          <Button
            title={strings.buttons.continue}
            onPress={() => router.replace('/authentication')}
            style={{
              alignSelf: 'center',
              width: '90%',
              marginBottom: 50,
            }}
          />
        </Container>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <BleScanAnimation
        title={strings.onboarding.bleScan.title}
        subTitle={strings.onboarding.bleScan.description}
      />
      <View style={styles.bottomSection}>
        {scanning ? (
          <View style={styles.centeredScanBox}>
            <ActivityIndicator
              size="large"
              color={theme.palette.text.primary}
            />
            <Typography type="body" style={{ marginTop: 8 }}>
              {strings.onboarding.bleScan.scanning}
            </Typography>
          </View>
        ) : (
          <Pressable
            onPress={() => setIsPaired(true)}
            style={[
              styles.deviceCard,
              {
                borderColor: theme.palette.border.accent,
                backgroundColor: theme.palette.background.secondary,
              },
            ]}
          >
            <Typography
              type="h4"
              color="accent"
              style={{ flex: 1, textAlign: 'left' }}
            >
              Cypherock X2
            </Typography>
            <Image
              source={Images.icon.arrow_open_default}
              style={{
                width: 15,
                height: 15,
                tintColor: theme.palette.text.accent,
              }}
            />
          </Pressable>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  bottomSection: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  centeredScanBox: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 16,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
    marginTop: -18,
  },
});
