import { DEFAULT_ROUTINE } from "./routine.js";

const STORAGE_KEY = "kimAnhParentSettings";

export const DEFAULT_PARENT_SETTINGS = {
  videoLibrary: ["Vinh-XemVideo"],
  storyLibrary: ["Truyện gia đình"],
  musicLibrary: ["Nhạc thiếu nhi"],
  routine: DEFAULT_ROUTINE
};

export function loadParentSettings() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return DEFAULT_PARENT_SETTINGS;
  }

  try {
    return {
      ...DEFAULT_PARENT_SETTINGS,
      ...JSON.parse(saved)
    };
  } catch {
    return DEFAULT_PARENT_SETTINGS;
  }
}

export function saveParentSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
