// Bluetooth/BleService.ts
import { NativeModules, NativeEventEmitter, PermissionsAndroid, Alert } from 'react-native';
import BleManager from 'react-native-ble-manager';

const BleModule = NativeModules.BleManager;
const bleEmitter = new NativeEventEmitter(BleModule);

/*
  Packet Structures:

  === Vehicle Command Packet ===
  [START_BYTE, COMMAND_ID, PAYLOAD, CHECKSUM]
    START_BYTE   = 0xAA
    COMMAND_ID   = 0x01 for Ignition control
    PAYLOAD      = 0x00 (OFF) or 0x01 (ON)
    CHECKSUM     = (START_BYTE + COMMAND_ID + PAYLOAD) & 0xFF

  === OTA Control Packet ===
  [START_BYTE, OTA_CMD_ID, DATA_LEN, ...DATA_BYTES, CHECKSUM]
    START_BYTE   = 0xAA
    OTA_CMD_ID   = defined by FW (e.g. 0x10 = begin, 0x11 = chunk, 0x12 = end)
    DATA_LEN     = # bytes following in DATA_BYTES
    DATA_BYTES   = OTA parameters
    CHECKSUM     = sum of all bytes & 0xFF

  === OTA Data Packet ===
  [...DATA_BYTES]
    Sent directly to OTA receive characteristic
*/

// === GATT UUIDs (provided by HW team) ===
const CMD_SERVICE_UUID = '751e2651-42eb-46a1-be00-069dddaf953e';
const CMD_CHAR_UUID    = '752e2651-42eb-46a1-be00-069dddaf953e';

const OTA_SERVICE_UUID    = '00008018-0000-1000-8000-00805f9b34fb';
const OTA_DATA_UUID       = '00008020-0000-1000-8000-00805f9b34fb'; // RECV_FW_CHAR
const OTA_CONTROL_UUID    = '00008022-0000-1000-8000-00805f9b34fb'; // COMMAND_CHAR

class BleService {
  public deviceId: string | null = null;
  public isConnected = false;

  constructor() {
    BleManager.start({ showAlert: false });
    this._registerListeners();
  }

  private _registerListeners() {
    bleEmitter.addListener('BleManagerDisconnectPeripheral', this._onDisconnect);
    bleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this._onNotification);
  }

  private _onDisconnect = ({ peripheral }: { peripheral: string }) => {
    if (peripheral === this.deviceId) {
      this.isConnected = false;
      Alert.alert('Device Disconnected', `Lost connection to ${peripheral}`);
    }
  };

  private _onNotification = ({ value, characteristic }: { value: number[]; characteristic: string }) => {
    if (characteristic === CMD_CHAR_UUID) {
      if (value.length === 4 && value[0] === 0xAA) {
        const [_, cmd, payload, chk] = value;
        if (((0xAA + cmd + payload) & 0xFF) !== chk) return;
        if (cmd === 0x01) {
          console.log(`Ignition status: ${payload ? 'ON' : 'OFF'}`);
        }
      }
    } else if (characteristic === OTA_DATA_UUID) {
      console.log('OTA FW chunk received:', value);
    } else if (characteristic === OTA_CONTROL_UUID) {
      console.log('OTA command ACK:', value);
    }
  };

  async enableAndPerms() {
    try { await BleManager.enableBluetooth(); }
    catch { Alert.alert('Bluetooth Required', 'Please enable Bluetooth'); }
    const perms = [
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];
    for (const p of perms) await PermissionsAndroid.request(p);
  }

  scan(onDeviceFound: (dev: any) => void) {
    BleManager.scan([], 5, false).catch(console.error);
    const sub = bleEmitter.addListener('BleManagerDiscoverPeripheral', onDeviceFound);
    return () => sub.remove();
  }

  async connect(id: string) {
    const per = await BleManager.connect(id);
    console.log('Device Connected:', per);
    this.deviceId = id;
    this.isConnected = true;

    const svc = await BleManager.retrieveServices(id);
    console.log('Services:', svc);

    // Subscribe to command notifications
    try {
      await BleManager.startNotification(id, CMD_SERVICE_UUID, CMD_CHAR_UUID);
      console.log('Subscribed to CMD notifications');
    } catch (e) {
      console.warn('CMD notification unsupported', e);
    }
    // Subscribe to OTA notifications
    try {
      await BleManager.startNotification(id, OTA_SERVICE_UUID, OTA_DATA_UUID);
      console.log('Subscribed to OTA data notifications');
    } catch (e) {
      console.warn('OTA data notification unsupported', e);
    }
    try {
      await BleManager.startNotification(id, OTA_SERVICE_UUID, OTA_CONTROL_UUID);
      console.log('Subscribed to OTA control notifications');
    } catch (e) {
      console.warn('OTA control notification unsupported', e);
    }
  }

  async disconnect() {
    if (this.deviceId) await BleManager.disconnect(this.deviceId);
  }

  private _write(service: string, char: string, bytes: number[]) {
    if (!this.deviceId || !this.isConnected) throw new Error('Not connected');
    return BleManager.write(this.deviceId, service, char, bytes);
  }

  // === Vehicle Commands ===
  private buildIgnitionPacket(on: boolean) {
    const START = 0xAA, CMD = 0x01, payload = on ? 1 : 0;
    const chk = (START + CMD + payload) & 0xFF;
    return [START, CMD, payload, chk];
  }

  async toggleIgnition(on: boolean) {
    const pkt = this.buildIgnitionPacket(on);
    await this._write(CMD_SERVICE_UUID, CMD_CHAR_UUID, pkt);
    console.log('Sent ignition command:', pkt);
  }

  // === OTA Commands ===
  async sendOtaControl(cmdId: number, data: number[] = []) {
    const START = 0xAA;
    const packet = [START, cmdId, data.length, ...data];
    const chk = packet.reduce((sum, b) => (sum + b) & 0xFF, 0);
    packet.push(chk);
    await this._write(OTA_SERVICE_UUID, OTA_CONTROL_UUID, packet);
    console.log('Sent OTA control packet:', packet);
  }

  async sendOtaData(chunk: number[]) {
    await this._write(OTA_SERVICE_UUID, OTA_DATA_UUID, chunk);
    console.log('Sent OTA data chunk of size', chunk.length);
  }
}

export default new BleService();