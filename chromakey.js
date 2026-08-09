(function () {
  const video = document.getElementById('hero-video-source');
  const canvas = document.getElementById('hero-canvas');
  if (!video || !canvas) return;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  function resizeCanvas() {
    canvas.width = video.videoWidth || 496;
    canvas.height = video.videoHeight || 464;
  }
  video.addEventListener('loadedmetadata', resizeCanvas);

  function removeGreen(imageData) {
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const maxRB = r > b ? r : b;
      const diff = g - maxRB;
      if (diff > 55) {
        d[i + 3] = 0;
      } else if (diff > 8) {
        const t = (diff - 8) / 47;
        d[i + 3] = Math.round(255 * (1 - t));
        d[i + 1] = maxRB;
      }
    }
    return imageData;
  }

  function renderFrame() {
    if (video.readyState >= 2 && canvas.width > 0) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      removeGreen(frame);
      ctx.putImageData(frame, 0, 0);
    }
    requestAnimationFrame(renderFrame);
  }

  requestAnimationFrame(renderFrame);
})();
