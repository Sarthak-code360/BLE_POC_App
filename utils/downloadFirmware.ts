import * as FileSystem from 'expo-file-system';

const FIRMWARE_API = '<Replace with your API endpoint>';

export const downloadLatestFirmware = async () => {
  const response = await fetch(FIRMWARE_API);
  if (!response.ok) throw new Error('Failed to fetch firmware metadata');

  const metadata = await response.json();
  const firmwareUrl = metadata.url;
  const localPath = FileSystem.documentDirectory + 'firmware.bin';

  const downloadRes = await FileSystem.downloadAsync(firmwareUrl, localPath);

  return {
    path: downloadRes.uri,
    metadata
  };
};
