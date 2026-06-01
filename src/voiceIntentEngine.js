let recognition;

const intentRoutes = {
  OPEN_VIDEO: "/content/video",
  OPEN_PAINT: "/apps/vinh-paint/index.html",
  OPEN_ABC: "/apps/abcmyanh/index.html",
  OPEN_STORY: "/content/story",
  OPEN_MUSIC: "/content/music",
  OPEN_SLEEP: "/room/sleep"
};

export function startListening(handlers = {}) {
  const SpeechRecognition = getSpeechRecognitionClass();

  if (!SpeechRecognition) {
    handlers.onUnsupported?.();
    return false;
  }

  stopListening();

  recognition = new SpeechRecognition();
  recognition.lang = "vi-VN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => handlers.onStart?.();
  recognition.onerror = () => handlers.onUnknown?.();
  recognition.onend = () => handlers.onEnd?.();
  recognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || "";
    const intent = parseVoiceCommand(transcript);

    if (intent === "UNKNOWN") {
      handlers.onUnknown?.(transcript);
      return;
    }

    handlers.onRecognized?.(intent, transcript);
    executeVoiceIntent(intent);
  };

  recognition.start();
  return true;
}

function getSpeechRecognitionClass() {
  return globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
}

export function stopListening() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

export function parseVoiceCommand(text) {
  const command = normalizeVietnamese(text);

  if (!command.includes("kim anh")) {
    return "UNKNOWN";
  }

  if (hasAny(command, ["mo video", "xem video", "rap chieu phim"])) {
    return "OPEN_VIDEO";
  }

  if (hasAny(command, ["ve tranh", "to mau", "xuong my thuat"])) {
    return "OPEN_PAINT";
  }

  if (hasAny(command, ["hoc chu", "hoc abc", "chu cai", "thu vien chu cai"])) {
    return "OPEN_ABC";
  }

  if (hasAny(command, ["ke chuyen", "doc truyen", "nghe chuyen", "co tich"])) {
    return "OPEN_STORY";
  }

  if (hasAny(command, ["nghe nhac", "mo nhac", "khu vuon am nhac"])) {
    return "OPEN_MUSIC";
  }

  if (hasAny(command, ["di ngu", "ngu ngoan", "dam may ngu"])) {
    return "OPEN_SLEEP";
  }

  return "UNKNOWN";
}

export function executeVoiceIntent(intent) {
  const route = intentRoutes[intent];

  if (!route) {
    return false;
  }

  if (route.endsWith(".html")) {
    window.location.href = route;
    return true;
  }

  window.location.hash = route;
  return true;
}

function hasAny(command, phrases) {
  return phrases.some((phrase) => command.includes(phrase));
}

function normalizeVietnamese(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
