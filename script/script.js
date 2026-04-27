  const spiderman = document.getElementById('spiderman-img');
  const canvas = document.getElementById('web-canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas width fixed, height will be dynamic
  canvas.width = 6;

  const IMG_HEIGHT = 180; // approximate rendered height of image
  const ATTACHMENT_OFFSET = -10; // px from top of image (feet of upside-down spidey)

  function updateSpiderman() {
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / maxScroll, 1);

    // Spiderman top position: starts so feet are at top (negative offset),
    // descends based on scroll. Max descent = 70% of viewport
    const maxDescent = window.innerHeight * 0.75;
    const topPos = 0 + ATTACHMENT_OFFSET + (progress/2 * maxDescent);

    spiderman.style.top = topPos + 'px';

    // Web: draw from 0 (page top) to the attachment point of image (top of img = topPos, feet at top = topPos)
    // The web attaches where the legs are = topPos + ATTACHMENT_OFFSET from top of img
    //const webBottom = Math.max(0, topPos + ATTACHMENT_OFFSET);
    const webBottom = Math.max(0, topPos + ATTACHMENT_OFFSET +80);
    canvas.height = Math.max(1, webBottom);
    canvas.style.height = canvas.height + 'px';

    // Draw the web line
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (webBottom > 0) {
      // Draw a slightly wavy white web line
      ctx.beginPath();
      ctx.moveTo(3, 0);

      // Add slight waviness
      const segments = Math.floor(webBottom / 20);
      for (let i = 1; i <= segments; i++) {
        const y = (i / segments) * webBottom;
        const wave = (i % 2 === 0) ? 1.5 : -1.5;
        ctx.lineTo(3 + wave, y);
      }
      ctx.lineTo(3, webBottom);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 4;
      ctx.stroke();

      // Add a subtle secondary web strand
      ctx.beginPath();
      ctx.moveTo(3, 0);
      ctx.lineTo(3, webBottom);
      ctx.strokeStyle = 'rgba(220, 220, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.beginPath();
      
    }
  }

  // Initial render
  updateSpiderman();

  // Update on scroll
  window.addEventListener('scroll', updateSpiderman, { passive: true });

  // Handle resize
  window.addEventListener('resize', updateSpiderman, { passive: true });