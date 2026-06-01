(function () {
  const MEMORY_KEY = "kimAnhMemories";
  const REWARD_KEY = "kimAnhRewards";
  const DEDUPE_KEY = "kimAnhMemoryEvents";
  const MEMORY_TOAST_TEXT = "✨ Đã thêm vào Kho Báu Ký Ức";
  const REWARD_TOAST_TEXT = "✨ Đã lưu vào Kho Báu Ký Ức và nhận 1 sao!";

  function recordMemory(type, title, options = {}) {
    const eventKey = options.eventKey || `${type}:${title}`;

    if (isDuplicate(eventKey, options.windowMs || 12 * 60 * 60 * 1000)) {
      return null;
    }

    const reward = options.reward === false ? null : addReward(type);
    const memory = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      type,
      title,
      createdAt: new Date().toISOString(),
      rewardStars: reward ? 1 : 0,
      rewardMessage: reward?.message || ""
    };
    const memories = readJson(MEMORY_KEY, []);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(sortNewestFirst([memory, ...memories])));
    rememberEvent(eventKey);
    showMemoryToast(Boolean(reward));
    window.dispatchEvent(new CustomEvent("kimanh:memory-created", { detail: memory }));
    return memory;
  }

  function recordDrawingMemory(title = "Bức tranh mới của Mỹ Anh", options) {
    return recordMemory("drawing", title, options);
  }

  function recordLearningMemory(title = "Hôm nay Mỹ Anh học chữ A", options) {
    return recordMemory("learning", title, options);
  }

  function recordVideoMemory(title = "Mỹ Anh đã xem video gia đình", options) {
    return recordMemory("video", title, options);
  }

  function recordVoiceMemory(title = "Lời nhắn yêu thương", options) {
    return recordMemory("voice", title, options);
  }

  function readJson(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(value) ? value : fallback;
    } catch {
      return fallback;
    }
  }

  function addReward(type) {
    const rewards = readRewardState();
    const totalStars = rewards.totalStars + 1;
    localStorage.setItem(REWARD_KEY, JSON.stringify({ totalStars }));
    window.dispatchEvent(new CustomEvent("kimanh:reward-added", { detail: { totalStars, type } }));

    return {
      totalStars,
      message: rewardMessage(type)
    };
  }

  function readRewardState() {
    try {
      const value = JSON.parse(localStorage.getItem(REWARD_KEY) || "{}");
      return { totalStars: Math.max(0, Number(value?.totalStars) || 0) };
    } catch {
      return { totalStars: 0 };
    }
  }

  function rewardMessage(type) {
    const messages = {
      drawing: "Giỏi quá Mỹ Anh ✨ Bức tranh này đẹp lắm!",
      learning: "Mỹ Anh học chăm quá ✨",
      video: "Mỹ Anh xem vui quá ✨",
      story: "Mỹ Anh nghe chuyện ngoan quá ✨",
      music: "Giai điệu vui quá Mỹ Anh ơi ✨",
      voice: "Mỹ Anh lưu lời nhắn yêu thương rồi ✨"
    };

    return messages[type] || "Giỏi quá Mỹ Anh ✨";
  }

  function sortNewestFirst(memories) {
    return [...memories].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  function isDuplicate(eventKey, windowMs) {
    const events = readEventMap();
    return Date.now() - Number(events[eventKey] || 0) < windowMs;
  }

  function rememberEvent(eventKey) {
    const events = readEventMap();
    events[eventKey] = Date.now();
    localStorage.setItem(DEDUPE_KEY, JSON.stringify(events));
  }

  function readEventMap() {
    try {
      const value = JSON.parse(localStorage.getItem(DEDUPE_KEY) || "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function showMemoryToast(hasReward = false) {
    const toast = document.createElement("div");
    toast.className = "kimanh-memory-toast";
    toast.textContent = hasReward ? REWARD_TOAST_TEXT : MEMORY_TOAST_TEXT;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2200);
  }

  window.KimAnhMemory = {
    recordMemory,
    recordDrawingMemory,
    recordLearningMemory,
    recordVideoMemory,
    recordVoiceMemory,
    showMemoryToast
  };
})();
