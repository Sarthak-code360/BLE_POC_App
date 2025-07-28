import axios from 'axios';
import * as bitcoin from 'bitcoinjs-lib';

const TESTNET_API_URL = 'https://blockstream.info/testnet/api';

// Hardcoded parameters for now:
const SENDER_ADDRESS = 'n1Uwt2Loc87z7CwzD3MkysVDJvM4jdZPh9';
const COIN_TYPE_HEX = '00';       // BTC = 0x00
const TX_FEE_SATOSHIS = 100;  // 0.001 BTC

interface UTXO {
  txid: string;
  vout: number;
  value: number;
  status: { confirmed: boolean };
}

// Little‑endian helpers:
function toLE32(num: number) {
  return num.toString(16).padStart(8, '0');
}
function toLE64(num: number) {
  return num.toString(16).padStart(16, '0');
}

/**
 * Builds the unsigned‑payload hex string:
 * [CoinType][NumInputs][InputValues][TxLen][RawTxHex]
 */
export async function buildUnsignedPayload(
  recipient: string,
  amountSat: number
): Promise<string> {
  // 1. Fetch UTXOs
  const { data: utxos } = await axios.get<UTXO[]>(
    `${TESTNET_API_URL}/address/${SENDER_ADDRESS}/utxo`
  );
  const confirmed = utxos.filter(u => u.status.confirmed);
  if (!confirmed.length) throw new Error('No confirmed UTXOs');

  // 2. Select just enough UTXOs
  let totalIn = 0;
  const selected: UTXO[] = [];
  for (const u of confirmed) {
    selected.push(u);
    totalIn += u.value;
    const estSize = selected.length * 148 + 2*34 + 10;
    const estFee = estSize * 1; // fee rate = 1 sat/byte
    if (totalIn >= amountSat + TX_FEE_SATOSHIS + estFee) break;
  }

  // 3. Build BitcoinJS transaction
  const network = bitcoin.networks.testnet;
  const txb = new bitcoin.TransactionBuilder(network);
  selected.forEach(u => txb.addInput(u.txid, u.vout));
  txb.addOutput(recipient, amountSat);
  const change = totalIn - amountSat - TX_FEE_SATOSHIS;
  if (change > 546) txb.addOutput(SENDER_ADDRESS, change);

  const tx = txb.buildIncomplete();
  const rawHex = tx.toHex();
  
  // 4. Pack payload
  const numInputsHex = selected.length.toString(16).padStart(2, '0');
  const inputValsHex = selected.map(u => toLE64(u.value)).join('');
  const txLenHex = toLE32(rawHex.length/2);

  // final payload:
  return COIN_TYPE_HEX + numInputsHex + inputValsHex + txLenHex + rawHex;
}
