import { getMemories } from "./stores/memoryStore.js";
import { getProfile } from "./stores/profileStore.js";
import { getTotalStars } from "./stores/rewardStore.js";

export function getGreeting(now = new Date()) {
  const profile = getProfile();
  const timePeriod = getTimePeriod(now);

  if (timePeriod === "morning") {
    return `Chào buổi sáng ${profile.name} ✨`;
  }

  if (timePeriod === "afternoon") {
    return `${profile.name} chơi vui không? ✨`;
  }

  if (timePeriod === "evening") {
    return "Mình chuẩn bị đi ngủ nha ✨";
  }

  return "Kim Anh chúc con ngủ ngon nha ✨";
}

export function getEncouragement() {
  const stars = getTotalStars();
  const latestMemory = getMemories()[0];

  return {
    rewardStatus: `⭐ Con có ${stars} sao rồi đó ✨`,
    memoryStatus: latestMemory
      ? `📦 Kim Anh nhớ ${latestMemory.title.toLowerCase()} của con ✨`
      : "📦 Kim Anh đang chờ kỷ niệm đầu tiên của con ✨"
  };
}

export function getSuggestion(now = new Date()) {
  const timePeriod = getTimePeriod(now);

  if (timePeriod === "morning") {
    return "Mình học ABC một chút nha ✨";
  }

  if (timePeriod === "afternoon") {
    return "Mình vẽ một bức tranh vui nha ✨";
  }

  if (timePeriod === "evening") {
    return "Mình nghe một câu chuyện dịu dàng nha ✨";
  }

  return "Mình nghỉ ngơi để mai chơi tiếp nha ✨";
}

function getTimePeriod(now) {
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 18) {
    return "afternoon";
  }

  if (hour >= 18 && hour <= 21) {
    return "evening";
  }

  return "night";
}
