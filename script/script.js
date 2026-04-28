const spiderman = document.getElementById('spiderman-img');
const canvas = document.getElementById('web-canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 6;
const WEB_X = 3;
const OVERLAP = 60;
const MIN_TOP = 0;
const HANDS_X_FRACTION = 0.55;
const HANDS_Y_FRACTION = 0.35;
const LOAD_ANIM_DURATION = 2000;

let animating = true;
let animStart = null;

canvas.width = CANVAS_WIDTH;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.zIndex = '999';
canvas.style.pointerEvents = 'none';
canvas.style.width = CANVAS_WIDTH + 'px';

spiderman.style.position = 'fixed';
spiderman.style.right = '20px';
spiderman.style.width = '110px';
spiderman.style.zIndex = '1000';
spiderman.style.pointerEvents = 'none';

function easeOutBounce(t) {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  else if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
  else if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
  else { t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375; }
}

function getScrollDescent() {
  const scrollY = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = Math.min(scrollY / maxScroll, 1);
  const maxDescent = window.innerHeight * 0.75;
  const initialDescent = MIN_TOP + OVERLAP;
  return initialDescent + (progress / 2) * maxDescent;
}

function drawWeb(descent) {
  // Allow negative — image goes above viewport (hidden by browser overflow)
  spiderman.style.top = (descent - OVERLAP) + 'px';

  const rect = spiderman.getBoundingClientRect();
  const handsX = rect.left + rect.width * HANDS_X_FRACTION;
  const handsY = rect.top + rect.height * HANDS_Y_FRACTION;

  canvas.style.left = (handsX - WEB_X) + 'px';

  // Only draw web if hands are visible (handsY > 0)
  const webHeight = handsY;
  canvas.height = Math.max(1, webHeight);
  canvas.style.height = Math.max(1, webHeight) + 'px';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (webHeight > 1) {
    ctx.beginPath();
    ctx.moveTo(WEB_X, 0);
    ctx.lineTo(WEB_X, webHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
    ctx.shadowBlur = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(WEB_X, 0);
    ctx.lineTo(WEB_X, webHeight);
    ctx.strokeStyle = 'rgba(220, 220, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.stroke();
  }
}

function animateLoad(timestamp) {
  if (!animStart) animStart = timestamp;
  const elapsed = timestamp - animStart;
  const t = Math.min(elapsed / LOAD_ANIM_DURATION, 1);

  const targetDescent = getScrollDescent();

  // Start fully hidden above viewport
  const startDescent = -300;
  const currentDescent = startDescent + easeOutBounce(t) * (targetDescent - startDescent);

  drawWeb(currentDescent);

  if (t < 1) {
    requestAnimationFrame(animateLoad);
  } else {
    animating = false;
    drawWeb(targetDescent);
  }
}

function updateSpiderman() {
  if (animating) return;
  drawWeb(getScrollDescent());
}

requestAnimationFrame(animateLoad);

window.addEventListener('scroll', updateSpiderman, { passive: true });
window.addEventListener('resize', updateSpiderman, { passive: true });