import { Buffer } from "node:buffer";

/**
 * encode provided value to base64 string.
 * @param value value to be converted to base64 string
 * @returns base64 encoded string
 */
export default function toBase64Encode(value: string) {
  return Buffer.from(value).toString("base64");
}