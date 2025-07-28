import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { ScreenContainer, Button, Container, Card } from '@/components/ui';
import { Image } from 'expo-image';
import { Images } from '@/constants';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { router } from 'expo-router';

export default function InstallAppScreen() {
  const { strings } = useAppSelector(selectLanguage);
  useEffect(() => {
    const backAction = () => {
      router.replace('/cardAuth');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <ScreenContainer>
      <Container style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image source={Images.onboarding.install_app} style={styles.image} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="Install App in Cypherock X2"
            onPress={() => router.push('/appStore')}
          />
        </View>
      </Container>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 64,
  },
  imageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '95%',
    height: '100%',
    resizeMode: 'contain',
    bottom: 30,
  },
  buttonWrapper: {
    paddingHorizontal: 24,
  },
});
