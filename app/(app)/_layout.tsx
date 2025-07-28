import { useTheme } from '@/components/ui';
import { useLockscreen } from '@/contexts/useLockscreenContext';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import BleManager from 'react-native-ble-manager';

export default function Layout() {
  const { isLocked, isPasswordSet } = useLockscreen();
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        navigationBarColor: theme.palette.black,
        headerShown: false,
        contentStyle: { backgroundColor: theme.palette.background.primary },
      }}
    >
      <Stack.Screen name="(lockscreen)" redirect={!isPasswordSet} />
      <Stack.Screen name="(protected)" redirect={isLocked} />
    </Stack>
  );
}
