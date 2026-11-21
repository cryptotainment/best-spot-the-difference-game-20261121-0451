// Twin Frames: the screenshot scenes behind ?shot=cover|play|win.
// Each one stages a real, deterministic game state — the same seed always
// gives the same frame — so the screenshots are honest renders of the game.

import { SCENES } from './scenes.js';
import { STATUS_PLAYING, STATUS_LEVEL_DONE } from './game.js';

/**
 * Stage the game for a screenshot and return the state to render.
 * cover: level 1 mid-hunt, 3 of 7 found, markers on them, counter 3 / 7.
 * play:  level 2 fresh, nothing found yet, full clock.
 * win:   level 3 complete, all 10 found, the level-complete banner up.
 * Any other name stages the cover.
 */
export function stageShot(game, name) {
  const state = game.state;
  if (name === 'play') {
    game.startLevel(1);
    state.timeLeft = SCENES[1].timeLimit;
    state.score = 0;
    state.status = STATUS_PLAYING;
    return state;
  }
  if (name === 'win') {
    game.startLevel(2);
    const diffs = SCENES[2].differences;
    diffs.forEach((d) => state.found.add(d.id));
    state.timeLeft = 42;
    state.score = diffs.length * 100 + 42 * 5;
    state.status = STATUS_LEVEL_DONE;
    return state;
  }
  game.startLevel(0);
  const diffs = SCENES[0].differences;
  diffs.slice(0, 3).forEach((d) => state.found.add(d.id));
  state.timeLeft = 75;
  state.score = 3 * 100;
  state.status = STATUS_PLAYING;
  return state;
}
