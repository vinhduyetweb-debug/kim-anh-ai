import { addStar } from "./stores/rewardStore.js";

export function rewardDrawing() {
  const totalStars = addStar();
  return {
    totalStars,
    message: "Giỏi quá Mỹ Anh ✨ Bức tranh này đẹp lắm!"
  };
}

export function rewardLearning() {
  const totalStars = addStar();
  return {
    totalStars,
    message: "Mỹ Anh học chăm quá ✨"
  };
}

export function rewardVideo() {
  const totalStars = addStar();
  return {
    totalStars,
    message: "Mỹ Anh xem vui quá ✨"
  };
}

export function rewardStory() {
  const totalStars = addStar();
  return {
    totalStars,
    message: "Mỹ Anh nghe chuyện ngoan quá ✨"
  };
}

export function rewardMusic() {
  const totalStars = addStar();
  return {
    totalStars,
    message: "Giai điệu vui quá Mỹ Anh ơi ✨"
  };
}

export function rewardVoice() {
  const totalStars = addStar();
  return {
    totalStars,
    message: "Mỹ Anh lưu lời nhắn yêu thương rồi ✨"
  };
}
