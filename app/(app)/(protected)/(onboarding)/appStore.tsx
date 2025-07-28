import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  ScreenContainer,
  Container,
  Typography,
  Button,
  LoaderScreen,
} from '@/components/ui';
import { CoinIcon } from '@/components/core';
import { useAppSelector } from '@/store';
import { selectLanguage } from '@/store/lang';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Images } from '@/constants';
import { Image } from 'expo-image';

const appsData = [
  { id: 'bitcoin', label: 'Bitcoin' },
  { id: 'ethereum', label: 'Ethereum' },
  { id: 'litecoin', label: 'Litecoin' },
  { id: 'dogecoin', label: 'Dogecoin' },
  { id: 'dash', label: 'Dash' },
  { id: 'polygon', label: 'Polygon' },
  { id: 'binance', label: 'BNB' },
  { id: 'fantom', label: 'Fantom' },
  { id: 'avalanche', label: 'Avalanche' },
  { id: 'optimism', label: 'Optimism' },
  { id: 'arbitrum', label: 'Arbitrum' },
  { id: 'solana', label: 'Solana' },
  { id: 'xrp', label: 'XRP' },
  { id: 'tron', label: 'Tron' },
  { id: 'starknet', label: 'Starknet' },
  { id: 'icp', label: 'ICP' },
];

export default function AppStoreScreen() {
  const { strings } = useAppSelector(selectLanguage);
  const [search, setSearch] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [installing, setInstalling] = useState(false);
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const insets = useSafeAreaInsets();

  const toggleSelect = (id: string) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(app => app !== id) : [...prev, id],
    );
  };

  const filteredApps = appsData.filter(app =>
    app.label.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: any) => {
    const isSelected = selectedApps.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.id)}
        style={[
          styles.appCard,
          isSelected && styles.appCardSelected,
          { borderColor: isSelected ? '#4CAF50' : '#ccc' },
        ]}
      >
        <View style={styles.appRow}>
          <CoinIcon parentAssetId={item.id} size={24} />
          <Text style={styles.appLabel}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (installing && currentAppIndex < selectedApps.length) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 99) {
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => {
              setProgress(0);
              setCurrentAppIndex(prev => prev + 1);
            }, 400);
          }
          return prev + 1;
        });
      }, 30);
    } else if (installing && currentAppIndex >= selectedApps.length) {
      setCompleted(true);
    }

    return () => clearInterval(interval);
  }, [installing, currentAppIndex]);

  if (completed) {
    return (
      <ScreenContainer>
        <Container
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <Image
            source={Images.onboarding.screen5}
            style={{
              width: 180,
              height: 180,
              marginBottom: 100,
              resizeMode: 'contain',
            }}
          />
          <Typography
            type="display"
            style={{ paddingHorizontal: 70, textAlign: 'center' }}
          >
            {strings.onboarding.allSet.title}
          </Typography>
        </Container>
        <View
          style={{ paddingHorizontal: 24, marginBottom: 45, width: '100%' }}
        >
          <Button title={strings.buttons.continue} onPress={() => {}} />
        </View>
      </ScreenContainer>
    );
  }

  if (installing) {
    return (
      <LoaderScreen
        title={`Installing ${selectedApps[currentAppIndex]}`}
        progress={progress}
        showProgress
      />
    );
  }

  return (
    <ScreenContainer>
      <Container style={styles.container}>
        <Typography type="h2" style={styles.title}>
          {strings.onboarding.appStore.title}
        </Typography>
        <Typography type="h2" color="primary" style={styles.description}>
          {strings.onboarding.appStore.description}
        </Typography>

        <TextInput
          placeholder="Search..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <FlatList
          data={filteredApps}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.appGrid}
          keyboardShouldPersistTaps="handled"
        />
      </Container>

      <View style={{ paddingHorizontal: 24, paddingBottom: 20, width: '100%' }}>
        <Button title="Install Apps" onPress={() => setInstalling(true)} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  title: {
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 60,
  },
  description: {
    textAlign: 'left',
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'rgba(39, 35, 32, 1)',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#ccc',
    backgroundColor: 'rgba(39, 35, 32, 1)',
  },
  appGrid: {
    paddingBottom: 100,
  },
  appCard: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    backgroundColor: 'rgba(39, 35, 32, 1)',
  },
  appCardSelected: {
    borderColor: '#4CAF50',
    borderWidth: 1.5,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appLabel: {
    fontSize: 15,
    color: '#ccc',
  },
});
