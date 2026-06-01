(function () {
  function currentLessonTitle() {
    const letter = document.getElementById("letter")?.textContent.trim();
    const mode = document.getElementById("modeLabel")?.textContent.trim();

    if (!letter) {
      return "";
    }

    if (mode === "Numbers") {
      return `Hôm nay Mỹ Anh học số ${letter}`;
    }

    return `Hôm nay Mỹ Anh học chữ ${letter}`;
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest("#nextBtn")) {
      return;
    }

    const title = currentLessonTitle();

    if (!title || !window.KimAnhMemory) {
      return;
    }

    window.KimAnhMemory.recordLearningMemory(title, {
      eventKey: `abc:${title}:${new Date().toDateString()}`
    });
  });
})();
