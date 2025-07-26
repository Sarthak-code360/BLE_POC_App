import * as FileSystem from 'expo-file-system';

export const getFirmwarePath = async (): Promise<string> => {
  const firmwarePath = FileSystem.documentDirectory + 'firmware.bin';
  const fileInfo = await FileSystem.getInfoAsync(firmwarePath);
  if (fileInfo.exists) {
    return firmwarePath;
  } else {
    throw new Error('Firmware file not found in internal storage');
  }
};
