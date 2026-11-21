// Twin Frames: entry point — wires the DOM, draws both panels, runs the clock.
// Reads ?shot=cover|play|win for a frozen, deterministic screenshot frame.

import { SCENES, PANEL_WIDTH, PANEL_HEIGHT } from './scenes.js';
import {
  createGame,
  STATUS_TITLE,
  STATUS_PLAYING,
  STATUS_LEVEL_DONE,
  STATUS_TIME_UP,
  STATUS_WON,
} from './game.js';
import { stageShot } from './shots.js';

const canvasA = document.getElementById('canvas-a');
const canvasB = document.getElementById('canvas-b');
const ctxA = canvasA.getContext('2d');
const ctxB = canvasB.getContext('2d');
const levelName = document.getElementById('level-name');
const foundCount = document.getElementById('found-count');
const scoreEl = document.getElementById('score');
const hintsEl = document.getElementById('hints-left');
const timeText = document.getElementById('time-text');
const timeFill = document.getElementById('time-fill');
const btnHint = document.getElementById('btn-hint');
const btnRestart = document.getElementById('btn-restart');
const btnNext = document.getElementById('btn-next');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const overlayScore = document.getElementById('overlay-score');
const overlayButton = document.getElementById('overlay-button');
const statusEl = document.getElementById('status');

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const SHOT_MODE = shotName !== null;

const game = createGame(updateHud);

function updateHud(state) {
  const scene = SCENES[state.levelIndex];
  levelName.textContent = scene.name;
  foundCount.textContent = `${state.found.size} / ${scene.differences.length}`;
  scoreEl.textContent = String(state.score);
  hintsEl.textContent = String(state.hintsLeft);
  timeText.textContent = String(Math.ceil(state.timeLeft));
  const pct = Math.max(0, (state.timeLeft / scene.timeLimit) * 100);
  timeFill.style.width = `${pct}%`;
  timeFill.classList.toggle('low', state.timeLeft <= 20);
  btnHint.disabled = state.status !== STATUS_PLAYING || state.hintsLeft <= 0;
  btnRestart.disabled = state.status === STATUS_TITLE;
  btnNext.hidden = state.status !== STATUS_LEVEL_DONE;
  statusEl.textContent = `Level ${scene.name}: ${state.found.size} of ${scene.differences.length} differences found. Score ${state.score}. ${Math.ceil(state.timeLeft)} seconds left.`;
  showOverlay(state);
}

function showOverlay(state) {
  if (state.status === STATUS_PLAYING) {
    overlay.hidden = true;
    return;
  }
  overlay.hidden = false;
  overlayScore.hidden = false;
  if (state.status === STATUS_TITLE) {
    overlayTitle.textContent = 'Twin Frames';
    overlayText.textContent = 'Two pictures, a few sneaky differences. Find them all before the clock runs out. Click a difference on either picture — or press H for a hint.';
    overlayScore.hidden = true;
    overlayButton.textContent = 'Start';
  } else if (state.status === STATUS_LEVEL_DONE) {
    const scene = SCENES[state.levelIndex];
    const last = state.levelIndex === SCENES.length - 1;
    overlayTitle.textContent = last ? 'You found them all!' : 'Level complete!';
    overlayText.textContent = last
      ? `Every difference in ${scene.name} is found. That is the whole hunt — nicely done.`
      : `Every difference in ${scene.name} is found. Ready for the next scene?`;
    overlayScore.textContent = `Score: ${state.score}`;
    overlayButton.textContent = last ? 'Play again' : 'Next level';
  } else if (state.status === STATUS_TIME_UP) {
    overlayTitle.textContent = "Out of time!";
    overlayText.textContent = 'The clock ran out before you found them all. The differences are still there — try the level again.';
    overlayScore.textContent = `Score: ${state.score}`;
    overlayButton.textContent = 'Try again';
  } else if (state.status === STATUS_WON) {
    overlayTitle.textContent = 'You found them all!';
    overlayText.textContent = 'Every scene is solved. That is the whole hunt — nicely done.';
    overlayScore.textContent = `Final score: ${state.score}`;
    overlayButton.textContent = 'Play again';
  }
}

function drawMarkers(ctx, state, t) {
  const scene = SCENES[state.levelIndex];
  // Found differences: a satisfying green ring on both panels.
  scene.differences.forEach((d) => {
    if (!state.found.has(d.id)) return;
    ctx.strokeStyle = '#7dd8a6';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(125, 216, 166, 0.35)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 5, 0, Math.PI * 2);
    ctx.stroke();
  });
  // Hint ring: a pulsing amber circle on an unfound difference.
  if (state.hintMark) {
    const age = (Date.now() - state.hintMark.born) / 1000;
    const pulse = 1 + 0.12 * Math.sin(age * 10);
    ctx.strokeStyle = '#ffc857';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(state.hintMark.x, state.hintMark.y, state.hintMark.r * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Miss cross: a red X where a click found nothing.
  if (state.missMark) {
    const m = state.missMark;
    ctx.strokeStyle = '#e85d5d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(m.x - 10, m.y - 10);
    ctx.lineTo(m.x + 10, m.y + 10);
    ctx.moveTo(m.x + 10, m.y - 10);
    ctx.lineTo(m.x - 10, m.y + 10);
    ctx.stroke();
  }
  // Pop rings: an expanding ring where a difference was just found.
  state.pops.forEach((p) => {
    const age = (Date.now() - p.born) / 700;
    if (age >= 1) return;
    ctx.strokeStyle = `rgba(125, 216, 166, ${1 - age})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r + age * 22, 0, Math.PI * 2);
    ctx.stroke();
  });
}

function render(state, t) {
  const scene = SCENES[state.levelIndex];
  scene.draw(ctxA, 'left', t);
  scene.draw(ctxB, 'right', t);
  drawMarkers(ctxA, state, t);
  drawMarkers(ctxB, state, t);
}

function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = PANEL_WIDTH / rect.width;
  const scaleY = PANEL_HEIGHT / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function onCanvasClick(event) {
  const before = game.state.score;
  const point = canvasPoint(event.currentTarget, event);
  game.clickAt(point.x, point.y);
  if (game.state.score < before) {
    event.currentTarget.classList.remove('shake');
    void event.currentTarget.offsetWidth;
    event.currentTarget.classList.add('shake');
  }
}

canvasA.addEventListener('click', onCanvasClick);
canvasB.addEventListener('click', onCanvasClick);
btnHint.addEventListener('click', () => game.useHint());
btnRestart.addEventListener('click', () => game.restartLevel());
btnNext.addEventListener('click', () => game.nextLevel());

overlayButton.addEventListener('click', () => {
  const state = game.state;
  if (state.status === STATUS_TITLE) game.startGame();
  else if (state.status === STATUS_LEVEL_DONE) game.nextLevel();
  else if (state.status === STATUS_TIME_UP) game.restartLevel();
  else if (state.status === STATUS_WON) game.startGame();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') game.useHint();
  else if (event.key === 'r' || event.key === 'R') game.restartLevel();
  else if (event.key === 'n' || event.key === 'N') {
    if (game.state.status === STATUS_LEVEL_DONE) game.nextLevel();
  } else if (event.key === 'Enter') {
    if (!overlay.hidden) overlayButton.click();
  }
});

if (SHOT_MODE) {
  // A frozen frame for a screenshot: no clock, no animation loop.
  const state = stageShot(game, shotName);
  updateHud(state);
  render(state, 1.2);
} else {
  updateHud(game.state);
  render(game.state, 0);
  function loop(now) {
    render(game.state, now / 1000);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  window.setInterval(() => {
    game.tick(0.25);
    updateHud(game.state);
  }, 250);
}
