const DB_NAME = "kimAnhOfflineVault";
const DB_VERSION = 1;
const MEMORY_PAYLOADS_STORE = "memoryPayloads";

export async function saveMemoryPayload(memoryId, payload) {
  const db = await openVault();
  const record = {
    memoryId,
    payload,
    savedAt: new Date().toISOString()
  };

  await requestToPromise(transaction(db, "readwrite").put(record));
  db.close();
  return record;
}

export async function getMemoryPayload(memoryId) {
  const db = await openVault();
  const record = await requestToPromise(transaction(db).get(memoryId));
  db.close();
  return record?.payload || null;
}

export async function deleteMemoryPayload(memoryId) {
  const db = await openVault();
  await requestToPromise(transaction(db, "readwrite").delete(memoryId));
  db.close();
}

export async function exportVault() {
  const db = await openVault();
  const payloads = await requestToPromise(transaction(db).getAll());
  db.close();

  return {
    database: DB_NAME,
    stores: {
      [MEMORY_PAYLOADS_STORE]: payloads
    }
  };
}

export async function importVault(data) {
  const payloads = data?.stores?.[MEMORY_PAYLOADS_STORE] || data?.memoryPayloads || [];

  await clearVault();

  for (const payload of payloads) {
    if (payload?.memoryId) {
      const db = await openVault();
      await requestToPromise(transaction(db, "readwrite").put(payload));
      db.close();
    }
  }
}

export async function clearVault() {
  const db = await openVault();
  await requestToPromise(transaction(db, "readwrite").clear());
  db.close();
}

function openVault() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(MEMORY_PAYLOADS_STORE)) {
        db.createObjectStore(MEMORY_PAYLOADS_STORE, { keyPath: "memoryId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transaction(db, mode = "readonly") {
  return db.transaction(MEMORY_PAYLOADS_STORE, mode).objectStore(MEMORY_PAYLOADS_STORE);
}

function requestToPromise(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
