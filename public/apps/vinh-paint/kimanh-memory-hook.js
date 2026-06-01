(function () {
  function recordDrawing() {
    window.KimAnhMemory?.recordDrawingMemory("Bức tranh mới của Mỹ Anh", {
      eventKey: `paint:drawing:${new Date().toDateString()}`
    });
  }

  document.addEventListener("click", (event) => {
    if (event.target.closest("#saveBtn, #partySaveBtn, #completeBtn, #completeBtn2")) {
      recordDrawing();
    }
  });
})();
