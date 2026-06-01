import { addMemory } from "./stores/memoryStore.js";
import { rewardDrawing, rewardLearning, rewardMusic, rewardStory, rewardVideo, rewardVoice } from "./rewardActions.js";

const ACTION_DEDUPE_KEY = "kimAnhMemoryRewardEvents";

export function recordDrawingMemory(title = "Bức tranh mới của Mỹ Anh") {
  return recordRewardedMemory("drawing", title, rewardDrawing);
}

export function recordLearningMemory(title = "Hôm nay Mỹ Anh học chữ A") {
  return recordRewardedMemory("learning", title, rewardLearning);
}

export function recordVideoMemory(title = "Mỹ Anh đã xem video gia đình") {
  return recordRewardedMemory("video", title, rewardVideo);
}

export function recordVoiceMemory(title = "Lời nhắn yêu thương") {
  return recordRewardedMemory("voice", title, rewardVoice);
}

export function recordStoryMemory(title = "Mỹ Anh nghe một câu chuyện") {
  return recordRewardedMemory("story", title, rewardStory);
}

export function recordMusicMemory(title = "Mỹ Anh nghe một bài nhạc") {
  return recordRewardedMemory("music", title, rewardMusic);
}

function recordRewardedMemory(type, title, rewardAction, options = {}) {
  const eventKey = options.eventKey || `${type}:${title}:${new Date().toDateString()}`;

  if (isDuplicate(eventKey)) {
    return null;
  }

  const reward = rewardAction();
  const memory = addMemory({
    type,
    title,
    rewardStars: 1,
    rewardMessage: reward.message
  });

  rememberEvent(eventKey);

  return {
    memory,
    rewardMessage: reward.message,
    rewardStars: 1,
    totalStars: reward.totalStars
  };
}

function isDuplicate(eventKey) {
  const events = readEventMap();
  return Boolean(events[eventKey]);
}

function rememberEvent(eventKey) {
  const events = readEventMap();
  events[eventKey] = Date.now();
  localStorage.setItem(ACTION_DEDUPE_KEY, JSON.stringify(events));
}

function readEventMap() {
  try {
    const value = JSON.parse(localStorage.getItem(ACTION_DEDUPE_KEY) || "{}");
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
}
