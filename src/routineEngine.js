import { getProfile } from "./stores/profileStore.js";

const WINDOW_MINUTES = 30;
const DAY_MINUTES = 24 * 60;

export function getCurrentRoutine(now = new Date()) {
  const profile = getProfile();

  return {
    childName: profile.name,
    wakeUp: profile.wakeUp,
    sleep: profile.sleep,
    isWakeUpTime: isWakeUpTime(now),
    isSleepTime: isSleepTime(now)
  };
}

export function getRoutineMessage(now = new Date()) {
  const routine = getCurrentRoutine(now);

  if (routine.isWakeUpTime) {
    return `Chào buổi sáng ${routine.childName} ✨`;
  }

  if (routine.isSleepTime) {
    return "Mình chuẩn bị đi ngủ nha ✨";
  }

  return "Một ngày vui đang chờ ✨";
}

export function isWakeUpTime(now = new Date()) {
  const profile = getProfile();
  return isWithinWindow(getCurrentMinutes(now), toMinutes(profile.wakeUp), WINDOW_MINUTES);
}

export function isSleepTime(now = new Date()) {
  const profile = getProfile();
  return isWithinWindow(getCurrentMinutes(now), toMinutes(profile.sleep), WINDOW_MINUTES);
}

function getCurrentMinutes(date) {
  return date.getHours() * 60 + date.getMinutes();
}

function toMinutes(time) {
  const [hours, minutes] = String(time).split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

function isWithinWindow(current, target, windowMinutes) {
  const forwardDistance = Math.abs(current - target);
  const circularDistance = DAY_MINUTES - forwardDistance;
  return Math.min(forwardDistance, circularDistance) <= windowMinutes;
}
