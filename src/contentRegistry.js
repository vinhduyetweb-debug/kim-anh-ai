const videos = [
  {
    id: "sample-video-family",
    title: "Video gia đình",
    description: "Một video vui do gia đình lựa chọn.",
    src: null,
    type: "video"
  },
  {
    id: "sample-video-play",
    title: "Khoảnh khắc vui chơi",
    description: "Một kỷ niệm nhỏ để xem lại cùng bố mẹ.",
    src: null,
    type: "video"
  }
];

const stories = [
  {
    id: "sample-story-rainbow",
    title: "Ngôi Nhà Cầu Vồng",
    description: "Một câu chuyện dịu dàng trước giờ ngủ.",
    text: "Hôm nay, Mỹ Anh mở cửa Ngôi Nhà Cầu Vồng và tìm thấy một điều thật vui.",
    type: "story"
  },
  {
    id: "sample-story-kim-anh",
    title: "Kim Anh cùng thử nha",
    description: "Một câu chuyện nhỏ về sự kiên nhẫn.",
    text: "Kim Anh mỉm cười và nói: Mình cùng thử nha.",
    type: "story"
  }
];

const music = [
  {
    id: "sample-music-happy",
    title: "Giai điệu vui vẻ",
    description: "Nhạc nhẹ cho lúc chơi và vẽ.",
    src: null,
    type: "music"
  },
  {
    id: "sample-music-sleep",
    title: "Nhạc ngủ ngoan",
    description: "Một giai điệu êm để chuẩn bị đi ngủ.",
    src: null,
    type: "music"
  }
];

const voices = [
  {
    id: "voice-bo",
    title: "Bố",
    description: "Tin nhắn yêu thương từ bố.",
    src: null,
    type: "voice"
  },
  {
    id: "voice-me",
    title: "Mẹ",
    description: "Tin nhắn yêu thương từ mẹ.",
    src: null,
    type: "voice"
  }
];

export function getVideos() {
  return [...videos];
}

export function getStories() {
  return [...stories];
}

export function getMusic() {
  return [...music];
}

export function getVoices() {
  return [...voices];
}
