const REWARD_STORAGE_KEY = "kimAnhRewards";

const DEFAULT_REWARDS = {
  totalStars: 0
};

export function addStar() {
  const rewards = readRewards();
  const nextTotal = rewards.totalStars + 1;
  saveRewards({ totalStars: nextTotal });
  return nextTotal;
}

export function removeStar() {
  const rewards = readRewards();
  const nextTotal = Math.max(0, rewards.totalStars - 1);
  saveRewards({ totalStars: nextTotal });
  return nextTotal;
}

export function getTotalStars() {
  return readRewards().totalStars;
}

function readRewards() {
  const saved = localStorage.getItem(REWARD_STORAGE_KEY);

  if (!saved) {
    return { ...DEFAULT_REWARDS };
  }

  try {
    return normalizeRewards(JSON.parse(saved));
  } catch {
    return { ...DEFAULT_REWARDS };
  }
}

function saveRewards(rewards) {
  localStorage.setItem(REWARD_STORAGE_KEY, JSON.stringify(normalizeRewards(rewards)));
}

function normalizeRewards(rewards) {
  return {
    totalStars: Math.max(0, Number(rewards?.totalStars) || 0)
  };
}
