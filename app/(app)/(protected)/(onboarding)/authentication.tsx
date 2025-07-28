import React, { useEffect, useState } from 'react';
import { View, BackHandler, StyleSheet } from 'react-native';
import {
  ScreenContainer,
  Button,
  Container,
  Typography,
  Card,
  LoaderScreen,
} from '@/components/ui';
import { useTheme } from 'styled-components/native';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Images } from '@/constants';

export default function AuthenticationScreen() {
  const { strings } = useAppSelector(selectLanguage);
  const theme = useTheme();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const backAction = () => {
      router.replace('/ble-scan');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    if (checking) {
      const timer = setTimeout(() => {
        router.replace('/checkUpdate');
      }, 3000);

      return () => {
        clearTimeout(timer);
        backHandler.remove();
      };
    }

    return () => {
      backHandler.remove();
    };
  }, [checking]);

  return (
    <ScreenContainer>
      {checking ? (
        <LoaderScreen
          title={strings.onboarding.authentication.permission_description}
        />
      ) : (
        <>
          <Container style={{ alignItems: 'center', paddingTop: 64 }}>
            <Card
              style={{
                alignSelf: 'center',
                width: 80,
                height: 80,
                justifyContent: 'center',
              }}
            >
              <Image
                source={Images.onboarding.foreground}
                style={{ width: 180, height: 180 }}
              />
            </Card>
            <View style={styles.textBlock}>
              <Typography
                type="h3"
                style={{ textAlign: 'center', marginTop: 120 }}
              >
                {strings.onboarding.authentication.title}
              </Typography>
              <Typography
                type="para"
                color="secondary"
                style={{ textAlign: 'center', marginTop: 8 }}
              >
                {strings.onboarding.authentication.description}
              </Typography>
            </View>
          </Container>

          <View style={styles.buttonContainer}>
            <Button
              title="Check Cypherock X2"
              onPress={() => setChecking(true)}
            />
          </View>
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  textBlock: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    width: '100%',
  },
});
