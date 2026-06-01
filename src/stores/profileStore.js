const PROFILE_STORAGE_KEY = "kimAnhProfile";
const LEGACY_PROFILE_STORAGE_KEY = "kimAnhChildProfile";

const DEFAULT_PROFILE = {
  name: "Mỹ Anh",
  age: 5,
  favoriteColor: "Pink",
  wakeUp: "06:00",
  sleep: "20:30"
};

export function getProfile() {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY) || localStorage.getItem(LEGACY_PROFILE_STORAGE_KEY);

  if (!saved) {
    return { ...DEFAULT_PROFILE };
  }

  try {
    return normalizeProfile(JSON.parse(saved));
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile) {
  const normalized = normalizeProfile(profile);
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function resetProfile() {
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(LEGACY_PROFILE_STORAGE_KEY);
  return { ...DEFAULT_PROFILE };
}

function normalizeProfile(profile) {
  return {
    ...DEFAULT_PROFILE,
    ...profile,
    age: Number(profile?.age) || DEFAULT_PROFILE.age
  };
}
