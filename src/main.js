import "./styles.css";
import { memoryBox, rooms } from "./data/rooms.js";
import { getRoutineStatus } from "./services/routine.js";
import { loadParentSettings, saveParentSettings } from "./services/storage.js";

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

  if (route.startsWith("/room/")) {
    const roomId = route.split("/").pop();
    const room = rooms.find((item) => item.id === roomId);
    renderRoomPage(room);
    return;
  }

  renderHome();
}

function renderHome() {
  const settings = loadParentSettings();
  const routineStatus = getRoutineStatus(new Date(), settings.routine);

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
          <h1 id="welcome-title">Xin chào Mỹ Anh ✨</h1>
          <p>Hôm nay mình muốn làm gì nào?</p>
        </div>
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
  app.querySelectorAll("[data-room]").forEach((button) => {
    button.addEventListener("click", () => navigate(button.dataset.room));
  });
}

function roomCard(room, wide = false) {
  return `
    <button class="room-card ${room.color} ${wide ? "wide" : ""}" type="button" data-room="${room.id === "memory" ? "/memory" : `/room/${room.id}`}">
      <span class="room-emoji" aria-hidden="true">${room.emoji}</span>
      <span class="room-text">
        <strong>${room.name}</strong>
        <small>${room.description}</small>
      </span>
    </button>
  `;
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

function launchModule(room) {
  if (!room.launchPath) {
    return;
  }

  window.location.href = room.launchPath;
}

function renderParentMode() {
  const settings = loadParentSettings();

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
        ${libraryField("Video Library", "videoLibrary", settings.videoLibrary)}
        ${libraryField("Story Library", "storyLibrary", settings.storyLibrary)}
        ${libraryField("Music Library", "musicLibrary", settings.musicLibrary)}

        <section class="parent-card">
          <h2>Schedule Settings</h2>
          <label>
            Wake Up
            <input name="wakeUp" type="time" value="${settings.routine.wakeUp}" />
          </label>
          <label>
            Sleep
            <input name="sleep" type="time" value="${settings.routine.sleep}" />
          </label>
        </section>

        <button class="save-button" type="submit">Lưu cài đặt</button>
      </form>
    </main>
  `;

  app.querySelector("[data-back]").addEventListener("click", () => navigate("/"));
  app.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    saveParentSettings({
      videoLibrary: splitLines(form.get("videoLibrary")),
      storyLibrary: splitLines(form.get("storyLibrary")),
      musicLibrary: splitLines(form.get("musicLibrary")),
      routine: {
        wakeUp: form.get("wakeUp"),
        sleep: form.get("sleep")
      }
    });
    navigate("/");
  });
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

window.addEventListener("hashchange", render);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}

render();
