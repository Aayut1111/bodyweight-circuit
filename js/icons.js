// Simple line-art icons, one per exercise id, keyed to EXERCISES in exercises.js.
// Each is a self-contained SVG string (viewBox 0 0 100 100) using currentColor,
// so it inherits whatever CSS color is applied to its container.
const ICON_WRAP_OPEN = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">`;
const ICON_WRAP_CLOSE = `</g></svg>`;
const floor = (y, x1 = 6, x2 = 96) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke-width="3" opacity="0.25" stroke-dasharray="3 7"/>`;

const EXERCISE_ICONS = {
  pushup: `${ICON_WRAP_OPEN}
    <circle cx="15" cy="55" r="7"/>
    <line x1="22" y1="58" x2="62" y2="64"/>
    <polyline points="22,58 24,70 22,84"/>
    <polyline points="62,64 78,68 92,74"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  "knee-pushup": `${ICON_WRAP_OPEN}
    <circle cx="15" cy="52" r="7"/>
    <line x1="22" y1="55" x2="48" y2="60"/>
    <polyline points="22,55 24,68 22,84"/>
    <polyline points="48,60 60,84 72,78"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  "pike-pushup": `${ICON_WRAP_OPEN}
    <circle cx="32" cy="58" r="7"/>
    <line x1="25" y1="85" x2="50" y2="22"/>
    <line x1="50" y1="22" x2="80" y2="85"/>
    ${floor(90, 12, 90)}
  ${ICON_WRAP_CLOSE}`,

  "tricep-dip": `${ICON_WRAP_OPEN}
    <line x1="15" y1="55" x2="42" y2="55"/>
    <line x1="42" y1="55" x2="42" y2="78"/>
    <circle cx="65" cy="26" r="7"/>
    <line x1="65" y1="33" x2="56" y2="58"/>
    <polyline points="65,35 50,48 35,55"/>
    <polyline points="56,58 78,68 92,74"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  "arm-circle": `${ICON_WRAP_OPEN}
    <circle cx="50" cy="20" r="7"/>
    <line x1="50" y1="27" x2="50" y2="55"/>
    <line x1="50" y1="30" x2="15" y2="35"/>
    <line x1="50" y1="30" x2="85" y2="35"/>
    <circle cx="15" cy="35" r="6" stroke-width="2.5"/>
    <circle cx="85" cy="35" r="6" stroke-width="2.5"/>
    <polyline points="50,55 42,73 40,92"/>
    <polyline points="50,55 58,73 60,92"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`,

  "plank-shoulder-tap": `${ICON_WRAP_OPEN}
    <circle cx="15" cy="50" r="7"/>
    <line x1="22" y1="53" x2="62" y2="60"/>
    <polyline points="22,53 24,60 22,84"/>
    <polyline points="22,53 30,45 45,38"/>
    <line x1="62" y1="60" x2="92" y2="70"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  squat: `${ICON_WRAP_OPEN}
    <circle cx="50" cy="21" r="7"/>
    <line x1="50" y1="30" x2="50" y2="65"/>
    <polyline points="50,42 30,42 15,48"/>
    <polyline points="50,42 70,42 85,48"/>
    <polyline points="50,65 30,72 28,90"/>
    <polyline points="50,65 70,72 72,90"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`,

  "jump-squat": `${ICON_WRAP_OPEN}
    <circle cx="50" cy="19" r="7"/>
    <line x1="50" y1="28" x2="50" y2="52"/>
    <polyline points="50,30 35,25 25,10"/>
    <polyline points="50,30 65,25 75,10"/>
    <polyline points="50,52 38,60 35,75"/>
    <polyline points="50,52 62,60 65,75"/>
    ${floor(90)}
  ${ICON_WRAP_CLOSE}`,

  lunge: `${ICON_WRAP_OPEN}
    <circle cx="50" cy="19" r="7"/>
    <line x1="50" y1="28" x2="50" y2="55"/>
    <polyline points="50,32 38,40 33,55"/>
    <polyline points="50,34 62,42 67,58"/>
    <polyline points="50,55 32,70 28,90"/>
    <polyline points="50,55 68,74 74,88"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`,

  "glute-bridge": `${ICON_WRAP_OPEN}
    <circle cx="15" cy="55" r="7"/>
    <line x1="23" y1="58" x2="50" y2="42"/>
    <polyline points="50,42 62,60 76,58"/>
    <line x1="18" y1="60" x2="12" y2="62"/>
    ${floor(63)}
  ${ICON_WRAP_CLOSE}`,

  "calf-raise": `${ICON_WRAP_OPEN}
    <circle cx="50" cy="20" r="7"/>
    <line x1="50" y1="28" x2="50" y2="55"/>
    <polyline points="50,42 38,42 35,56"/>
    <polyline points="50,42 62,42 65,56"/>
    <polyline points="50,55 44,73 42,90"/>
    <polyline points="50,55 56,73 58,90"/>
    <line x1="44" y1="14" x2="44" y2="4" stroke-width="3" opacity="0.4"/>
    <line x1="56" y1="14" x2="56" y2="4" stroke-width="3" opacity="0.4"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`,

  "wall-sit": `${ICON_WRAP_OPEN}
    <line x1="15" y1="8" x2="15" y2="95" stroke-width="4"/>
    <circle cx="38" cy="30" r="7"/>
    <line x1="38" y1="37" x2="38" y2="58"/>
    <polyline points="38,50 32,50 28,65"/>
    <line x1="38" y1="58" x2="63" y2="58"/>
    <line x1="63" y1="58" x2="63" y2="90"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`,

  plank: `${ICON_WRAP_OPEN}
    <circle cx="15" cy="50" r="7"/>
    <line x1="22" y1="53" x2="62" y2="58"/>
    <polyline points="24,58 20,82"/>
    <line x1="62" y1="58" x2="92" y2="66"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  situp: `${ICON_WRAP_OPEN}
    <circle cx="35" cy="45" r="7"/>
    <line x1="42" y1="49" x2="70" y2="78"/>
    <polyline points="70,78 85,63 96,78"/>
    <polyline points="45,52 52,58 66,66"/>
    ${floor(85)}
  ${ICON_WRAP_CLOSE}`,

  "bicycle-crunch": `${ICON_WRAP_OPEN}
    <circle cx="75" cy="45" r="7"/>
    <line x1="66" y1="50" x2="42" y2="58"/>
    <polyline points="42,58 20,52 4,46"/>
    <polyline points="42,58 48,38 58,26"/>
    <polyline points="66,50 58,44 50,40"/>
    ${floor(68)}
  ${ICON_WRAP_CLOSE}`,

  "leg-raise": `${ICON_WRAP_OPEN}
    <circle cx="18" cy="60" r="7"/>
    <line x1="26" y1="62" x2="45" y2="62"/>
    <polyline points="45,62 45,36 45,10"/>
    <line x1="24" y1="63" x2="18" y2="66"/>
    ${floor(65)}
  ${ICON_WRAP_CLOSE}`,

  superman: `${ICON_WRAP_OPEN}
    <circle cx="19" cy="38" r="7"/>
    <line x1="26" y1="41" x2="50" y2="55"/>
    <polyline points="26,41 14,33 4,26"/>
    <polyline points="50,55 70,48 88,40"/>
    ${floor(60, 6, 96)}
  ${ICON_WRAP_CLOSE}`,

  "side-plank": `${ICON_WRAP_OPEN}
    <circle cx="74" cy="29" r="7"/>
    <line x1="68" y1="34" x2="40" y2="58"/>
    <line x1="40" y1="58" x2="15" y2="80"/>
    <polyline points="68,34 62,50 58,62"/>
    <line x1="64" y1="36" x2="76" y2="10"/>
    ${floor(82)}
  ${ICON_WRAP_CLOSE}`,

  "jumping-jack": `${ICON_WRAP_OPEN}
    <circle cx="50" cy="16" r="7"/>
    <line x1="50" y1="25" x2="50" y2="50"/>
    <polyline points="50,25 35,15 20,5"/>
    <polyline points="50,25 65,15 80,5"/>
    <polyline points="50,50 35,70 25,88"/>
    <polyline points="50,50 65,70 75,88"/>
    ${floor(92)}
  ${ICON_WRAP_CLOSE}`,

  burpee: `${ICON_WRAP_OPEN}
    <circle cx="50" cy="16" r="7"/>
    <line x1="50" y1="25" x2="50" y2="48"/>
    <polyline points="50,25 35,15 25,3"/>
    <polyline points="50,25 65,15 75,3"/>
    <polyline points="50,48 38,60 32,80"/>
    <polyline points="50,48 62,60 68,80"/>
    ${floor(92)}
  ${ICON_WRAP_CLOSE}`,

  "mountain-climber": `${ICON_WRAP_OPEN}
    <circle cx="15" cy="48" r="7"/>
    <line x1="22" y1="51" x2="60" y2="56"/>
    <polyline points="24,58 20,84"/>
    <polyline points="60,56 78,60 94,66"/>
    <polyline points="60,56 42,46 48,60"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  "high-knees": `${ICON_WRAP_OPEN}
    <circle cx="50" cy="16" r="7"/>
    <line x1="50" y1="25" x2="50" y2="52"/>
    <polyline points="50,30 35,32 26,22"/>
    <polyline points="50,32 63,45 72,56"/>
    <polyline points="50,52 46,44 50,58"/>
    <polyline points="50,52 58,72 60,90"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`,

  "bear-crawl": `${ICON_WRAP_OPEN}
    <circle cx="15" cy="42" r="7"/>
    <line x1="22" y1="45" x2="55" y2="50"/>
    <polyline points="24,55 20,78"/>
    <polyline points="55,50 68,60 80,68"/>
    ${floor(88)}
  ${ICON_WRAP_CLOSE}`,

  "star-jump": `${ICON_WRAP_OPEN}
    <circle cx="50" cy="13" r="7"/>
    <line x1="50" y1="22" x2="50" y2="48"/>
    <polyline points="50,22 28,12 10,2"/>
    <polyline points="50,22 72,12 90,2"/>
    <polyline points="50,48 25,66 12,86"/>
    <polyline points="50,48 75,66 88,86"/>
    ${floor(92)}
  ${ICON_WRAP_CLOSE}`,

  default: `${ICON_WRAP_OPEN}
    <circle cx="50" cy="20" r="7"/>
    <line x1="50" y1="28" x2="50" y2="55"/>
    <polyline points="50,32 38,42 35,58"/>
    <polyline points="50,32 62,42 65,58"/>
    <polyline points="50,55 42,73 40,92"/>
    <polyline points="50,55 58,73 60,92"/>
    ${floor(94)}
  ${ICON_WRAP_CLOSE}`
};
