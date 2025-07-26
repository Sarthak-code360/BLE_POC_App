// utils/base64.ts
import { toByteArray } from "base64-js";

export function base64ToByteArray(base64: string): Uint8Array {
  return toByteArray(base64);
}
