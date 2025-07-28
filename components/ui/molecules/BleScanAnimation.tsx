import { View, StyleSheet } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Container, Typography } from '@/components/ui/atoms';

interface BleScanAnimationProps {
  title: string;
  subTitle?: string;
}

export function BleScanAnimation({ title, subTitle }: BleScanAnimationProps) {
  return (
    <Container
      style={{
        gap: 16,
        alignItems: 'center',
        paddingTop: 30,
        paddingBottom: -10,
        paddingHorizontal: 16,
      }}
    >
      <LottieView
        source={require('@/assets/lottie/bleScan.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <View style={{ gap: 10 }}>
        <Typography type="h3" style={{ textAlign: 'center' }}>
          {title}
        </Typography>
        {subTitle && (
          <Typography
            type="para"
            color="secondary"
            style={{ textAlign: 'center' }}
          >
            {subTitle}
          </Typography>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 200,
    height: 180,
  },
});
