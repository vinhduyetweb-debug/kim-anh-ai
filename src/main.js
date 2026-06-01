import "./styles.css";
import { getEncouragement, getGreeting, getSuggestion } from "./companionEngine.js";
import { getMusic, getStories, getVideos, getVoices } from "./contentRegistry.js";
import { memoryBox, rooms } from "./data/rooms.js";
import { getRoutineStatus } from "./services/routine.js";
import { loadParentSettings, saveParentSettings } from "./services/storage.js";
import { addMemory, getMemories, removeMemory } from "./stores/memoryStore.js";
import { getProfile, saveProfile } from "./stores/profileStore.js";
import { addStar, getTotalStars, removeStar } from "./stores/rewardStore.js";
import { startListening } from "./voiceIntentEngine.js";

const app = document.querySelector("#app");
let parentTapCount = 0;
let parentTapTimer;

function navigate(route) {
  window.location.hash = route;
}

function currentRoute() {
  return window.location.hash.replace("#", "") || "/";
}

function render() {
  const route = currentRoute();

  if (route === "/parent") {
    renderParentMode();
    return;
  }

  if (route === "/memory") {
    renderRoomPage(memoryBox);
    return;
  }

  if (route.startsWith("/content/")) {
    renderContentPage(route.split("/").pop());
    return;
  }

  if (route.startsWith("/room/")) {
    const roomId = route.split("/").pop();
    const room = rooms.find((item) => item.id === roomId);
    renderRoomPage(room);
    return;
  }

  renderHome();
}

function renderHome() {
  const profile = getProfile();
  const memories = getMemories();
  const totalStars = getTotalStars();
  const companion = {
    greeting: getGreeting(),
    encouragement: getEncouragement(),
    suggestion: getSuggestion()
  };
  const routineStatus = getRoutineStatus(new Date(), {
    wakeUp: profile.wakeUp,
    sleep: profile.sleep
  });

  app.innerHTML = `
    <main class="app-shell child-mode">
      <section class="hero" aria-labelledby="welcome-title">
        <div class="rainbow" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <button class="kim-anh" type="button" aria-label="Kim Anh">
          <span class="cat-face" aria-hidden="true">🐱</span>
          <span class="character-name">Kim Anh</span>
        </button>
        <div class="hero-copy">
          <p class="routine-pill">${routineStatus.isSleepTime ? "Đến giờ nghỉ ngơi dịu dàng" : "Một ngày vui đang chờ"}</p>
          <h1 id="welcome-title">Xin chào ${escapeHtml(profile.name)} ✨</h1>
          <p>Hôm nay mình muốn làm gì nào?</p>
        </div>
      </section>

      <section class="home-core" aria-label="Hôm nay và thành tích">
        <article class="companion-card">
          <p class="card-kicker">🐱 Kim Anh</p>
          <h2>${escapeHtml(companion.greeting)}</h2>
          <p>${escapeHtml(companion.encouragement.rewardStatus)}</p>
          <p>${escapeHtml(companion.encouragement.memoryStatus)}</p>
          <strong>${escapeHtml(companion.suggestion)}</strong>
          <div class="voice-control">
            <button class="voice-button" type="button" data-voice-button>🎙️ Gọi Kim Anh</button>
            <p class="voice-status" data-voice-status aria-live="polite"></p>
          </div>
        </article>

        <article class="today-card">
          <p class="card-kicker">☀️ Hôm Nay</p>
          <h2>Xin chào ${escapeHtml(profile.name)} ✨</h2>
          <p>Hôm nay là ${getVietnameseDayName(new Date())}.</p>
          <div class="day-times" aria-label="Giờ sinh hoạt hôm nay">
            <span>Dậy lúc ${profile.wakeUp}</span>
            <span>Đi ngủ lúc ${profile.sleep}</span>
          </div>
        </article>

        <article class="star-card">
          <p class="card-kicker">⭐ Thành Tích</p>
          <h2>${totalStars} sao</h2>
          <p>Những cố gắng nhỏ mỗi ngày.</p>
        </article>

        <article class="memory-preview-card">
          <p class="card-kicker">📦 Kho Báu Ký Ức</p>
          <h2>Kỷ niệm mới nhất</h2>
          <ul>
            ${memories.slice(0, 3).map(memoryListItem).join("")}
          </ul>
        </article>
      </section>

      <section class="rooms-grid" aria-label="Các căn phòng trong Ngôi Nhà Cầu Vồng">
        ${rooms.map(roomCard).join("")}
      </section>

      <section class="memory-band" aria-label="Kho Báu Ký Ức">
        ${roomCard(memoryBox, true)}
      </section>
    </main>
  `;

  app.querySelector(".kim-anh").addEventListener("click", handleHiddenParentEntry);
  const voiceStatus = app.querySelector("[data-voice-status]");
  app.querySelector("[data-voice-button]").addEventListener("click", () => {
    startListening({
      onUnsupported: () => {
        voiceStatus.textContent = "Máy này chưa hỗ trợ nghe giọng nói ✨";
      },
      onStart: () => {
        voiceStatus.textContent = "Kim Anh đang nghe nè ✨";
      },
      onRecognized: () => {
        voiceStatus.textContent = "Được nè, mình mở cho Mỹ Anh nha ✨";
      },
      onUnknown: () => {
        voiceStatus.textContent = "Kim Anh chưa hiểu. Mỹ Anh thử nói lại nha ✨";
      }
    });
  });
  app.querySelectorAll("[data-room]").forEach((button) => {
    button.addEventListener("click", () => openRoom(button.dataset.room));
  });
}

function roomCard(room, wide = false) {
  const target = room.contentType ? `/content/${room.contentType}` : room.launchPath || (room.id === "memory" ? "/memory" : `/room/${room.id}`);

  return `
    <button class="room-card ${room.color} ${wide ? "wide" : ""}" type="button" data-room="${target}">
      <span class="room-emoji" aria-hidden="true">${room.emoji}</span>
      <span class="room-text">
        <strong>${room.name}</strong>
        <small>${room.description}</small>
      </span>
    </button>
  `;
}

function openRoom(target) {
  if (target.endsWith(".html")) {
    window.location.href = target;
    return;
  }

  navigate(target);
}

function handleHiddenParentEntry() {
  parentTapCount += 1;
  clearTimeout(parentTapTimer);

  if (parentTapCount >= 5) {
    parentTapCount = 0;
    navigate("/parent");
    return;
  }

  parentTapTimer = window.setTimeout(() => {
    parentTapCount = 0;
  }, 1400);
}

function renderRoomPage(room) {
  if (!room) {
    navigate("/");
    return;
  }

  const isLaunch = room.kind === "launch";

  app.innerHTML = `
    <main class="app-shell room-page ${room.color}">
      <button class="back-button" type="button" data-back>← Về nhà</button>
      <section class="room-stage">
        <div class="room-symbol" aria-hidden="true">${room.emoji}</div>
        <h1>${room.name}</h1>
        <p>${room.description}</p>
        <div class="module-panel">
          <span>${isLaunch ? "Mở module" : "Sắp có"}</span>
          <strong>${room.module}</strong>
        </div>
        ${
          isLaunch
            ? `<button class="primary-action" type="button" data-launch="${room.id}">Mình cùng thử nha ✨</button>`
            : `<p class="gentle-note">Kim Anh đang chuẩn bị căn phòng này.</p>`
        }
      </section>
    </main>
  `;

  app.querySelector("[data-back]").addEventListener("click", () => navigate("/"));
  const launchButton = app.querySelector("[data-launch]");

  if (launchButton) {
    launchButton.addEventListener("click", () => launchModule(room));
  }
}

function renderContentPage(type) {
  const config = getContentConfig(type);

  if (!config) {
    navigate("/");
    return;
  }

  const items = config.items();

  app.innerHTML = `
    <main class="app-shell content-page ${config.color}">
      <button class="back-button" type="button" data-back>← Về nhà</button>
      <section class="content-hero">
        <div class="room-symbol" aria-hidden="true">${config.emoji}</div>
        <div>
          <p class="card-kicker">${config.kicker}</p>
          <h1>${config.title}</h1>
          <p>${config.description}</p>
          ${config.presenceMessage ? `<p class="presence-message">${config.presenceMessage}</p>` : ""}
        </div>
      </section>

      <section class="content-list" aria-label="${config.title}">
        ${items.map((item) => contentItemCard(item, config)).join("")}
      </section>

      ${
        config.launchPath
          ? `<button class="primary-action content-launch" type="button" data-launch-module="${config.launchPath}">Mở Vinh-XemVideo</button>`
          : ""
      }
    </main>
  `;

  app.querySelector("[data-back]").addEventListener("click", () => navigate("/"));
  const launchButton = app.querySelector("[data-launch-module]");

  if (launchButton) {
    launchButton.addEventListener("click", () => {
      window.location.href = launchButton.dataset.launchModule;
    });
  }
}

function contentItemCard(item, config) {
  return `
    <article class="content-item">
      <span class="content-item-icon" aria-hidden="true">${config.itemEmoji}</span>
      <div>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.description || config.placeholder)}</p>
        <small>${item.src ? "Sẵn sàng phát" : config.placeholder}</small>
      </div>
    </article>
  `;
}

function getContentConfig(type) {
  const configs = {
    video: {
      emoji: "🎬",
      itemEmoji: "▶️",
      kicker: "Video Vui",
      title: "Rạp Chiếu Phim",
      description: "Video vui do gia đình lựa chọn.",
      placeholder: "Mẫu hiển thị, chưa có file video.",
      presenceMessage: "🐱 Xem vui nha ✨",
      color: "rose",
      items: getVideos,
      launchPath: "/apps/vinh-xemvideo/index.html"
    },
    story: {
      emoji: "📖",
      itemEmoji: "📘",
      kicker: "Story Library",
      title: "Góc Cổ Tích",
      description: "Truyện và câu chuyện trước khi ngủ.",
      placeholder: "Playback truyện sẽ được thêm sau.",
      presenceMessage: "🐱 Mình cùng nghe chuyện nha ✨",
      color: "sky",
      items: getStories
    },
    music: {
      emoji: "🎵",
      itemEmoji: "🎶",
      kicker: "Music Library",
      title: "Khu Vườn Âm Nhạc",
      description: "Âm nhạc và giai điệu vui vẻ.",
      placeholder: "Playback nhạc sẽ được thêm sau.",
      color: "mint",
      items: getMusic
    },
    voice: {
      emoji: "👨",
      itemEmoji: "🔊",
      kicker: "Voice Library",
      title: "Voice Messages",
      description: "Giọng bố mẹ và lời nhắn yêu thương.",
      placeholder: "Audio placeholder.",
      color: "peach",
      items: getVoices
    }
  };

  return configs[type];
}

function launchModule(room) {
  if (!room.launchPath) {
    return;
  }

  window.location.href = room.launchPath;
}

function renderParentMode() {
  const settings = loadParentSettings();
  const profile = getProfile();
  const memories = getMemories();
  const totalStars = getTotalStars();
  const contentCounts = {
    videos: getVideos().length,
    stories: getStories().length,
    music: getMusic().length,
    voices: getVoices().length
  };

  app.innerHTML = `
    <main class="parent-shell">
      <header class="parent-header">
        <div>
          <p>Parent Mode</p>
          <h1>KIM ANH AI</h1>
        </div>
        <button class="back-button" type="button" data-back>Về Child Mode</button>
      </header>

      <form class="parent-grid">
        <section class="parent-card profile-card">
          <h2>Child Profile</h2>
          <label>
            Name
            <input name="name" type="text" value="${escapeHtml(profile.name)}" autocomplete="off" />
          </label>
          <label>
            Age
            <input name="age" type="number" min="1" max="12" value="${profile.age}" />
          </label>
          <label>
            Wake Up
            <input name="wakeUp" type="time" value="${profile.wakeUp}" />
          </label>
          <label>
            Sleep
            <input name="sleep" type="time" value="${profile.sleep}" />
          </label>
        </section>

        <section class="parent-card reward-card">
          <h2>Reward System</h2>
          <p class="reward-total">⭐ ${totalStars} sao</p>
          <div class="inline-actions">
            <button class="small-action" type="button" data-add-star>+ Thêm sao</button>
            <button class="small-action" type="button" data-remove-star>- Bớt sao</button>
          </div>
        </section>

        <section class="parent-card memory-manager-card">
          <h2>Memory Engine</h2>
          <label>
            Type
            <select name="memoryType">
              <option value="art">Art</option>
              <option value="learning">Learning</option>
              <option value="video">Video</option>
              <option value="family">Family</option>
            </select>
          </label>
          <label>
            Title
            <input name="memoryTitle" type="text" placeholder="Tên kỷ niệm" />
          </label>
          <button class="small-action" type="button" data-add-memory>Thêm kỷ niệm</button>
          <div class="memory-admin-list">
            ${memories.map(memoryAdminItem).join("")}
          </div>
        </section>

        <section class="parent-card content-count-card">
          <h2>Content Registry</h2>
          <div class="content-counts">
            <span>🎬 Videos <strong>${contentCounts.videos}</strong></span>
            <span>📖 Stories <strong>${contentCounts.stories}</strong></span>
            <span>🎵 Music <strong>${contentCounts.music}</strong></span>
            <span>👨 Voices <strong>${contentCounts.voices}</strong></span>
          </div>
        </section>

        ${libraryField("Video Library", "videoLibrary", settings.videoLibrary)}
        ${libraryField("Story Library", "storyLibrary", settings.storyLibrary)}
        ${libraryField("Music Library", "musicLibrary", settings.musicLibrary)}

        <section class="parent-card">
          <h2>Schedule Settings</h2>
          <p class="parent-note">Giờ thức dậy và giờ ngủ được lấy từ Child Profile.</p>
        </section>

        <button class="save-button" type="submit">Lưu cài đặt</button>
      </form>
    </main>
  `;

  app.querySelector("[data-back]").addEventListener("click", () => navigate("/"));
  app.querySelector("[data-add-star]").addEventListener("click", () => {
    addStar();
    renderParentMode();
  });
  app.querySelector("[data-remove-star]").addEventListener("click", () => {
    removeStar();
    renderParentMode();
  });
  app.querySelector("[data-add-memory]").addEventListener("click", () => {
    const form = app.querySelector("form");
    const data = new FormData(form);

    addMemory({
      type: data.get("memoryType"),
      title: data.get("memoryTitle")
    });
    renderParentMode();
  });
  app.querySelectorAll("[data-remove-memory]").forEach((button) => {
    button.addEventListener("click", () => {
      removeMemory(button.dataset.removeMemory);
      renderParentMode();
    });
  });
  app.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextProfile = saveProfile({
      ...profile,
      name: String(form.get("name")).trim() || profile.name,
      age: form.get("age"),
      wakeUp: form.get("wakeUp"),
      sleep: form.get("sleep")
    });

    saveParentSettings({
      videoLibrary: splitLines(form.get("videoLibrary")),
      storyLibrary: splitLines(form.get("storyLibrary")),
      musicLibrary: splitLines(form.get("musicLibrary")),
      routine: {
        wakeUp: nextProfile.wakeUp,
        sleep: nextProfile.sleep
      }
    });
    navigate("/");
  });
}

function memoryListItem(memory) {
  return `
    <li>
      <span>${memoryIcon(memory.type)}</span>
      <strong>${escapeHtml(memory.title)}</strong>
    </li>
  `;
}

function memoryAdminItem(memory) {
  return `
    <div class="memory-admin-item">
      <span>${memoryIcon(memory.type)}</span>
      <strong>${escapeHtml(memory.title)}</strong>
      <button type="button" data-remove-memory="${escapeHtml(memory.id)}">Xóa</button>
    </div>
  `;
}

function memoryIcon(type) {
  const icons = {
    art: "🎨",
    family: "👨‍👩‍👧",
    learning: "🔤",
    video: "🎬"
  };

  return icons[type] || "📦";
}

function getVietnameseDayName(date) {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return days[date.getDay()];
}

function libraryField(title, name, value) {
  return `
    <section class="parent-card">
      <h2>${title}</h2>
      <textarea name="${name}" rows="5">${value.join("\n")}</textarea>
    </section>
  `;
}

function splitLines(value) {
  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("hashchange", render);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

render();
