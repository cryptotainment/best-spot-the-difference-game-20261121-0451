// Twin Frames: the game state machine — levels, clicks, timer, score, hints.
// Pure logic: it knows nothing about the DOM except the callbacks it is given.

import { SCENES } from './scenes.js';
import { playPop, playBuzz, playWin } from './sound.js';

export const STATUS_TITLE = 'title';
export const STATUS_PLAYING = 'playing';
export const STATUS_LEVEL_DONE = 'level-done';
export const STATUS_TIME_UP = 'time-up';
export const STATUS_WON = 'won';

const FIND_POINTS = 100;
const WRONG_POINTS = 25;
const HINT_POINTS = 50;
const HINTS_PER_LEVEL = 3;

export function createGame(onChange) {
  const state = {
    levelIndex: 0,
    found: new Set(),
    score: 0,
    hintsLeft: HINTS_PER_LEVEL,
    timeLeft: SCENES[0].timeLimit,
    status: STATUS_TITLE,
    hintMark: null,
    missMark: null,
    pops: [],
  };

  function scene() {
    return SCENES[state.levelIndex];
  }

  function emit() {
    onChange(state);
  }

  function startLevel(index) {
    state.levelIndex = index;
    state.found = new Set();
    state.hintsLeft = HINTS_PER_LEVEL;
    state.timeLeft = SCENES[index].timeLimit;
    state.status = STATUS_PLAYING;
    state.hintMark = null;
    state.missMark = null;
    state.pops = [];
    emit();
  }

  function startGame() {
    state.score = 0;
    startLevel(0);
  }

  function restartLevel() {
    startLevel(state.levelIndex);
  }

  function nextLevel() {
    if (state.levelIndex + 1 < SCENES.length) startLevel(state.levelIndex + 1);
    else {
      state.status = STATUS_WON;
      emit();
    }
  }

  /** A click at scene coordinates (x, y) on either panel. */
  function clickAt(x, y) {
    if (state.status !== STATUS_PLAYING) return;
    const diffs = scene().differences;
    for (let i = 0; i < diffs.length; i += 1) {
      const d = diffs[i];
      if (state.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= (d.r + 12) * (d.r + 12)) {
        state.found.add(d.id);
        state.score += FIND_POINTS;
        state.pops.push({ x: d.x, y: d.y, r: d.r, born: Date.now() });
        state.missMark = null;
        playPop();
        if (state.found.size === diffs.length) {
          state.score += Math.round(state.timeLeft) * 5;
          state.status = STATUS_LEVEL_DONE;
          playWin();
        }
        emit();
        return;
      }
    }
    state.score = Math.max(0, state.score - WRONG_POINTS);
    state.missMark = { x, y, born: Date.now() };
    playBuzz();
    emit();
  }

  /** Reveal one unfound difference for a couple of seconds. */
  function useHint() {
    if (state.status !== STATUS_PLAYING || state.hintsLeft <= 0) return;
    const remaining = scene().differences.filter((d) => !state.found.has(d.id));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    state.hintsLeft -= 1;
    state.score = Math.max(0, state.score - HINT_POINTS);
    state.hintMark = { x: pick.x, y: pick.y, r: pick.r, born: Date.now() };
    emit();
  }

  /** Advance the clock by dt seconds; returns true when time ran out. */
  function tick(dt) {
    if (state.status !== STATUS_PLAYING) return false;
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.status = STATUS_TIME_UP;
      emit();
      return true;
    }
    // Expire the hint ring and the miss cross after two seconds.
    const now = Date.now();
    if (state.hintMark && now - state.hintMark.born > 2000) state.hintMark = null;
    if (state.missMark && now - state.missMark.born > 900) state.missMark = null;
    state.pops = state.pops.filter((p) => now - p.born < 700);
    emit();
    return false;
  }

  return {
    state,
    scene,
    startGame,
    startLevel,
    restartLevel,
    nextLevel,
    clickAt,
    useHint,
    tick,
  };
}
