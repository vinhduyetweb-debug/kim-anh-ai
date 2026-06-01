import { clearVault, exportVault, importVault } from "./offlineVault.js";

const BACKUP_VERSION = 1;
const APP_NAME = "Kim Anh AI";

const LOCAL_STORAGE_KEYS = [
  "kimAnhProfile",
  "kimAnhChildProfile",
  "kimAnhMemories",
  "kimAnhRewards",
  "kimAnhParentSettings",
  "kimAnhMemoryEvents",
  "kimAnhMemoryRewardEvents"
];

export async function createBackupData() {
  const localStorageData = {};

  LOCAL_STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);

    if (value !== null) {
      localStorageData[key] = value;
    }
  });

  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    appName: APP_NAME,
    localStorage: localStorageData,
    indexedDB: await exportVault()
  };
}

export async function downloadBackup() {
  const backup = await createBackupData();
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = `kim-anh-ai-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);

  return backup;
}

export async function restoreBackupFile(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  validateBackup(data);
  await restoreBackupData(data);
  return data;
}

export async function restoreBackupData(data) {
  validateBackup(data);

  LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

  Object.entries(data.localStorage || {}).forEach(([key, value]) => {
    if (LOCAL_STORAGE_KEYS.includes(key)) {
      localStorage.setItem(key, String(value));
    }
  });

  await clearVault();
  await importVault(data.indexedDB || {});
}

export function getBackupStorageWarning() {
  return "Dữ liệu được lưu offline trong trình duyệt của thiết bị này. Khi đổi máy, xoá trình duyệt, hoặc reset điện thoại, hãy sao lưu trước.";
}

function validateBackup(data) {
  if (!data || data.appName !== APP_NAME || !data.localStorage || typeof data.localStorage !== "object") {
    throw new Error("Invalid Kim Anh AI backup");
  }
}
