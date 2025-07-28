import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, BackHandler } from 'react-native';
import { ScreenContainer, Container, Typography, Card } from '@/components/ui';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useTheme } from 'styled-components/native';
import { Image } from 'expo-image';
import { Images } from '@/constants';
import { router } from 'expo-router';

export default function CardAuthScreen() {
  const { strings } = useAppSelector(selectLanguage);
  //   const theme = useTheme();

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

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() => router.replace('/installApp')}
    >
      <ScreenContainer>
        <Container style={{ alignItems: 'center', paddingTop: 64 }}>
          <Card
            style={{
              alignSelf: 'center',
              width: 70,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              padding: 0,
            }}
          >
            <Image
              source={Images.onboarding.card_auth}
              style={{ width: 50, height: 50, resizeMode: 'contain' }}
            />
          </Card>

          <View style={styles.textBlock}>
            <Typography
              type="h3"
              style={{ textAlign: 'center', marginTop: 30 }}
            >
              {strings.onboarding.cardAuthentication.title}
            </Typography>
            <Typography
              type="para"
              color="secondary"
              style={{ textAlign: 'center', marginTop: 8 }}
            >
              {strings.onboarding.cardAuthentication.description}
            </Typography>
          </View>
        </Container>

        <Card style={styles.progressCard}>
          <View style={styles.progressContainer}>
            <View style={styles.verticalLine} />
            {[1, 2, 3, 4].map(index => (
              <View key={index} style={styles.stepRow}>
                <View style={[styles.dot, index <= 2 && styles.filledDot]} />
                <Typography type="body" style={styles.stepText}>
                  {`Tap Card #${index}`}
                </Typography>
              </View>
            ))}
          </View>
        </Card>
      </ScreenContainer>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  textBlock: {
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  progressCard: {
    marginBottom: 180,
    marginHorizontal: 30,
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  progressContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
  },
  verticalLine: {
    position: 'absolute',
    right: 143,
    top: 20,
    bottom: 20,
    width: 1,
    backgroundColor: 'rgba(114, 114, 114, 1)',
    zIndex: 0,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    marginLeft: -100,
    gap: 25,
    zIndex: 1,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#ccc',
    backgroundColor: 'white',
    marginRight: 15,
  },
  filledDot: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  stepText: {
    fontSize: 18,
  },
});
