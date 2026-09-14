const WORK_SECONDS = 40;
const REST_SECONDS = 20;
function createCircuitTimer(circuit, callbacks) {
  let index = 0;
  let phase = "work"; // "work" | "rest"
  let secondsLeft = WORK_SECONDS;
  let intervalId = null;
  let paused = false;

  function tick() {
    if (paused) return;
    secondsLeft--;
    callbacks.onTick(secondsLeft, phase, index);

    if (secondsLeft <= 0) {
      advance();
    }
  }

  function advance() {
    if (phase === "work") {
      if (index === circuit.length - 1) {
        stop();
        callbacks.onComplete();
        return;
      }
      phase = "rest";
      secondsLeft = REST_SECONDS;
    } else {
      index++;
      phase = "work";
      secondsLeft = WORK_SECONDS;
    }
    callbacks.onPhaseChange(phase, index);
  }

  function start() {
    callbacks.onPhaseChange(phase, index);
    callbacks.onTick(secondsLeft, phase, index);
    intervalId = setInterval(tick, 1000);
  }

  function stop() {
    clearInterval(intervalId);
  }

  function togglePause() {
    paused = !paused;
    return paused;
  }

  function skip() {
    secondsLeft = 1; // let the next tick() naturally trigger advance()
  }

  return { start, stop, togglePause, skip };
}