import BleManager from 'react-native-ble-manager';

export async function sendUnsignedToDevice(
  deviceId: string,
  charUUID: string,
  payloadHex: string
) {
  const data = Buffer.from(payloadHex, 'hex');
  console.log('Sending unsigned payload:', payloadHex);
  await BleManager.write(deviceId, /* your service UUID */, charUUID, data);
}
