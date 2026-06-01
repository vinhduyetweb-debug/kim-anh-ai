export const DEFAULT_ROUTINE = {
  wakeUp: "06:00",
  sleep: "20:30"
};

export function getRoutineStatus(now = new Date(), routine = DEFAULT_ROUTINE) {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const wakeMinutes = toMinutes(routine.wakeUp);
  const sleepMinutes = toMinutes(routine.sleep);

  return {
    isSleepTime: currentMinutes >= sleepMinutes || currentMinutes < wakeMinutes,
    wakeUp: routine.wakeUp,
    sleep: routine.sleep
  };
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}
