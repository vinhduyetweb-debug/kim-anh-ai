(function () {
  function captureDrawing() {
    const paintCanvas = document.getElementById("paintCanvas");
    const lineCanvas = document.getElementById("lineCanvas");

    if (!paintCanvas || !lineCanvas) {
      return null;
    }

    const out = document.createElement("canvas");
    out.width = paintCanvas.width;
    out.height = paintCanvas.height;
    const ctx = out.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.drawImage(paintCanvas, 0, 0);
    ctx.drawImage(lineCanvas, 0, 0);

    return {
      image: out.toDataURL("image/png"),
      thumbnail: makeThumbnail(out)
    };
  }

  function makeThumbnail(sourceCanvas) {
    const thumb = document.createElement("canvas");
    const max = 320;
    const scale = Math.min(max / sourceCanvas.width, max / sourceCanvas.height, 1);
    thumb.width = Math.max(1, Math.round(sourceCanvas.width * scale));
    thumb.height = Math.max(1, Math.round(sourceCanvas.height * scale));
    const ctx = thumb.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, thumb.width, thumb.height);
    ctx.drawImage(sourceCanvas, 0, 0, thumb.width, thumb.height);
    return thumb.toDataURL("image/jpeg", 0.76);
  }

  function recordDrawing() {
    const drawing = captureDrawing();

    if (drawing && window.KimAnhMemory?.recordDrawingImageMemory) {
      window.KimAnhMemory.recordDrawingImageMemory("Bức tranh mới của Mỹ Anh", drawing.image, drawing.thumbnail);
      return;
    }

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
