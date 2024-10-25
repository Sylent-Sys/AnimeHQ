/* eslint-disable @typescript-eslint/no-explicit-any */
import CryptoJS from "crypto-js";
export default class StorageHelper {
  storage: Storage;
  constructor(storage: Storage = sessionStorage) {
    this.storage = storage;
  }
  getItem(name: string) {
    const encryptedData = this.storage.getItem(name);
    if (encryptedData) {
      const bytes = CryptoJS.AES.decrypt(
        encryptedData,
        import.meta.env.VITE_AES_SECRET_KEY,
      );
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    }
    return null;
  }
  setItem(name: string, value: any) {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      import.meta.env.VITE_AES_SECRET_KEY,
    ).toString();
    this.storage.setItem(name, encryptedData);
  }
  removeItem(name: string) {
    this.storage.removeItem(name);
  }
}
