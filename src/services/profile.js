const PROFILE_STORAGE_KEY = "kimAnhChildProfile";

const DEFAULT_PROFILE = {
  name: "Mỹ Anh",
  age: 5,
  favoriteColor: "rainbow",
  wakeUp: "06:00",
  sleep: "20:30"
};

export function getDefaultProfile() {
  return { ...DEFAULT_PROFILE };
}

export function loadProfile() {
  const saved = localStorage.getItem(PROFILE_STORAGE_KEY);

  if (!saved) {
    return getDefaultProfile();
  }

  try {
    return normalizeProfile(JSON.parse(saved));
  } catch {
    return getDefaultProfile();
  }
}

export function saveProfile(profile) {
  const normalized = normalizeProfile(profile);
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

function normalizeProfile(profile) {
  return {
    ...getDefaultProfile(),
    ...profile,
    age: Number(profile?.age) || DEFAULT_PROFILE.age
  };
}
