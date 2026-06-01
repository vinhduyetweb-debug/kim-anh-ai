import { getProfile } from "./stores/profileStore.js";

export function getCharacterMood(now = new Date()) {
  const hour = now.getHours();

  if (hour >= 5 && hour < 12) {
    return "cheerful";
  }

  if (hour >= 12 && hour < 18) {
    return "playful";
  }

  if (hour >= 18 && hour <= 21) {
    return "gentle";
  }

  return "sleepy";
}

export function getCharacterMessage(now = new Date()) {
  const profile = getProfile();
  const mood = getCharacterMood(now);

  if (mood === "cheerful") {
    return `Chào buổi sáng ${profile.name} ✨`;
  }

  if (mood === "playful") {
    return "Mình cùng chơi nha ✨";
  }

  if (mood === "gentle") {
    return "Mình chuẩn bị đi ngủ nha ✨";
  }

  return "Kim Anh chúc con ngủ ngon nha ✨";
}

export function getCharacterEmoji(now = new Date()) {
  const mood = getCharacterMood(now);

  if (mood === "cheerful") {
    return "🐱☀️";
  }

  if (mood === "playful") {
    return "🐱🎨";
  }

  if (mood === "gentle") {
    return "🐱🌙";
  }

  return "🐱💤";
}

export function getCharacterAnimationClass(now = new Date()) {
  return `kim-mood-${getCharacterMood(now)}`;
}
