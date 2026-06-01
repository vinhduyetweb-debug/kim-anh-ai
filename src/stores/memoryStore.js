const MEMORY_STORAGE_KEY = "kimAnhMemories";

const SAMPLE_MEMORIES = [
  {
    id: "sample-family-video",
    type: "video",
    title: "Video gia đình",
    createdAt: "2026-01-03T08:00:00.000Z"
  },
  {
    id: "sample-letter-a",
    type: "learning",
    title: "Học chữ A",
    createdAt: "2026-01-02T08:00:00.000Z"
  },
  {
    id: "sample-first-drawing",
    type: "art",
    title: "Bức tranh đầu tiên",
    createdAt: "2026-01-01T08:00:00.000Z"
  }
];

export function addMemory(memory) {
  const memories = readMemories();
  const nextMemory = {
    id: memory?.id || crypto.randomUUID(),
    type: memory?.type || "memory",
    title: String(memory?.title || "").trim() || "Kỷ niệm mới",
    createdAt: memory?.createdAt || new Date().toISOString(),
    rewardStars: Math.max(0, Number(memory?.rewardStars) || 0),
    rewardMessage: String(memory?.rewardMessage || "").trim()
  };

  saveMemories([nextMemory, ...memories]);
  return nextMemory;
}

export function getMemories() {
  const saved = localStorage.getItem(MEMORY_STORAGE_KEY);

  if (!saved) {
    saveMemories(SAMPLE_MEMORIES);
    return sortNewestFirst(SAMPLE_MEMORIES);
  }

  const memories = readMemories();

  return sortNewestFirst(memories);
}

export function removeMemory(id) {
  const memories = readMemories().filter((memory) => memory.id !== id);
  saveMemories(memories);
  return sortNewestFirst(memories);
}

function readMemories() {
  const saved = localStorage.getItem(MEMORY_STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(normalizeMemory) : [];
  } catch {
    return [];
  }
}

function saveMemories(memories) {
  localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(sortNewestFirst(memories)));
}

function normalizeMemory(memory) {
  return {
    id: memory?.id || crypto.randomUUID(),
    type: memory?.type || "memory",
    title: String(memory?.title || "Kỷ niệm").trim(),
    createdAt: memory?.createdAt || new Date().toISOString(),
    rewardStars: Math.max(0, Number(memory?.rewardStars) || 0),
    rewardMessage: String(memory?.rewardMessage || "").trim()
  };
}

function sortNewestFirst(memories) {
  return [...memories].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}
