import React, { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import {
  ScreenContainer,
  Container,
  Typography,
  Card,
  LoaderScreen,
  Success,
  Button,
} from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { Images } from '@/constants';
import { Image } from 'expo-image';
import { useTheme } from 'styled-components/native';
import { router } from 'expo-router';

export default function CheckUpdateScreen() {
  const { strings } = useAppSelector(selectLanguage);
  const theme = useTheme();

  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Back button fallback to /authentication
  useEffect(() => {
    const backAction = () => {
      router.replace('/checkUpdate');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  // Handle progress loader
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (checkingUpdate && progress < 100) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) {
            clearInterval(interval);
            setTimeout(() => setCompleted(true), 300);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
    }

    return () => clearInterval(interval);
  }, [checkingUpdate]);

  // Show success screen
  if (completed) {
    return (
      <ScreenContainer>
        <Container>
          <Success title={strings.onboarding.checkUpdate.success} />
          <Button
            title={strings.buttons.continue}
            onPress={() => router.replace('/cardAuth')}
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

  // Show loading screen
  if (checkingUpdate) {
    return (
      <LoaderScreen
        progress={progress}
        showProgress
        title={strings.onboarding.checkUpdate.updateCheck}
      />
    );
  }

  return (
    <ScreenContainer>
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
            source={Images.icon.update}
            style={{
              width: 40,
              height: 40,
              alignSelf: 'center',
            }}
          />
        </Card>

        <View style={styles.textBlock}>
          <Typography type="h3" style={{ textAlign: 'center', marginTop: 120 }}>
            {strings.onboarding.checkUpdate.title}
          </Typography>
          <Typography
            type="para"
            color="secondary"
            style={{ textAlign: 'center', marginTop: 8 }}
          >
            {strings.onboarding.checkUpdate.description}
          </Typography>
        </View>
      </Container>

      <View style={styles.buttonContainer}>
        <Button
          title={strings.buttons.continue}
          onPress={() => setCheckingUpdate(true)}
        />
      </View>
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
    paddingBottom: 50,
    width: '100%',
  },
});
