import axios from "axios";

export const getFirmwareMetadata = async () => {
  const res = await axios.get("<Replace API Endpoint URL for firmware meta data>");
  return res.data;
};

export const downloadFirmware = async (url: string): Promise<string> => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const base64Data = Buffer.from(res.data, "binary").toString("base64");
  return base64Data;
};
