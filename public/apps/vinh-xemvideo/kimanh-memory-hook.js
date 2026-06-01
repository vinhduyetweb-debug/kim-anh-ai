(function () {
  const completed = new Set();
  const THRESHOLD = 0.82;

  function videoTitle(video) {
    return video.closest(".videoPage")?.querySelector(".overlay h2")?.textContent.trim() || "video gia đình";
  }

  function recordVideo(video) {
    const title = videoTitle(video);
    const key = `video:${title}:${new Date().toDateString()}`;

    if (completed.has(key)) {
      return;
    }

    completed.add(key);
    window.KimAnhMemory?.recordVideoMemory("Mỹ Anh đã xem video gia đình", {
      eventKey: key
    });
  }

  document.addEventListener(
    "timeupdate",
    (event) => {
      const video = event.target;

      if (!(video instanceof HTMLVideoElement) || !video.duration) {
        return;
      }

      if (video.currentTime / video.duration >= THRESHOLD) {
        recordVideo(video);
      }
    },
    true
  );

  document.addEventListener(
    "ended",
    (event) => {
      if (event.target instanceof HTMLVideoElement) {
        recordVideo(event.target);
      }
    },
    true
  );
})();
