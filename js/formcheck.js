import { PoseLandmarker, FilesetResolver, DrawingUtils } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs";

const LANDMARK = {
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
  LEFT_WRIST: 15, RIGHT_WRIST: 16,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
};

let poseLandmarker = null;
let video = null;
let canvas = null;
let ctx = null;
let drawingUtils = null;
let running = false;
let currentExerciseId = null;
let lastVideoTime = -1;
let lastFeedbackAt = 0;

function angleAt(a, b, c) {
  if (!a || !b || !c) return null;
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (!mag1 || !mag2) return null;
  const cos = Math.min(1, Math.max(-1, (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

// Picks whichever side (left/right) the model is more confident about —
// useful since you're usually filmed from one side only.
function pickSide(lm, leftIdx, rightIdx) {
  const left = lm[leftIdx];
  const right = lm[rightIdx];
  if (!left) return right;
  if (!right) return left;
  return (left.visibility ?? 1) >= (right.visibility ?? 1) ? left : right;
}

const FORM_RULES = {
  squat(lm) {
    const hip = pickSide(lm, LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP);
    const knee = pickSide(lm, LANDMARK.LEFT_KNEE, LANDMARK.RIGHT_KNEE);
    const ankle = pickSide(lm, LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE);
    const shoulder = pickSide(lm, LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER);
    const kneeAngle = angleAt(hip, knee, ankle);
    const backAngle = angleAt(shoulder, hip, knee);
    if (kneeAngle == null || backAngle == null) return null;
    if (kneeAngle > 160) return { status: "neutral", message: "Lower into your squat." };
    if (backAngle < 100) return { status: "warning", message: "Keep your chest up — you're leaning too far forward." };
    if (kneeAngle < 70) return { status: "warning", message: "That's very deep — keep your heels planted." };
    if (kneeAngle <= 100) return { status: "good", message: "Good depth — drive back up." };
    return { status: "neutral", message: "Go a little lower for full depth." };
  },
  "jump-squat": (lm) => FORM_RULES.squat(lm),

  pushup(lm) {
    const shoulder = pickSide(lm, LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER);
    const elbow = pickSide(lm, LANDMARK.LEFT_ELBOW, LANDMARK.RIGHT_ELBOW);
    const wrist = pickSide(lm, LANDMARK.LEFT_WRIST, LANDMARK.RIGHT_WRIST);
    const hip = pickSide(lm, LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP);
    const ankle = pickSide(lm, LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE);
    const elbowAngle = angleAt(shoulder, elbow, wrist);
    const bodyLine = angleAt(shoulder, hip, ankle);
    if (elbowAngle == null || bodyLine == null) return null;
    if (bodyLine < 160) return { status: "warning", message: "Brace your core — your hips are sagging." };
    if (elbowAngle > 150) return { status: "neutral", message: "Lower down until your elbows bend to about 90°." };
    if (elbowAngle > 100) return { status: "warning", message: "Go a bit lower for full range of motion." };
    return { status: "good", message: "Good depth and a straight body line." };
  },
  "knee-pushup": (lm) => FORM_RULES.pushup(lm),

  plank(lm) {
    const shoulder = pickSide(lm, LANDMARK.LEFT_SHOULDER, LANDMARK.RIGHT_SHOULDER);
    const hip = pickSide(lm, LANDMARK.LEFT_HIP, LANDMARK.RIGHT_HIP);
    const ankle = pickSide(lm, LANDMARK.LEFT_ANKLE, LANDMARK.RIGHT_ANKLE);
    const bodyLine = angleAt(shoulder, hip, ankle);
    if (bodyLine == null) return null;
    if (bodyLine < 160) return { status: "warning", message: "Keep a straight line from shoulders to ankles." };
    return { status: "good", message: "Nice straight line — hold it." };
  },
};

async function init() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 1,
  });
}

async function start() {
  video = document.getElementById("form-check-video");
  canvas = document.getElementById("form-check-canvas");
  ctx = canvas.getContext("2d");
  drawingUtils = new DrawingUtils(ctx);

  if (!poseLandmarker) await init();

  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
  video.srcObject = stream;
  await video.play();
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  running = true;
  requestAnimationFrame(renderLoop);
}

function stop() {
  running = false;
  if (video && video.srcObject) {
    video.srcObject.getTracks().forEach((t) => t.stop());
    video.srcObject = null;
  }
}

function renderLoop() {
  if (!running) return;

  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const result = poseLandmarker.detectForVideo(video, performance.now());

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (result.landmarks && result.landmarks[0]) {
      drawingUtils.drawLandmarks(result.landmarks[0], { radius: 3 });
      drawingUtils.drawConnectors(result.landmarks[0], PoseLandmarker.POSE_CONNECTIONS);

      const now = performance.now();
      if (now - lastFeedbackAt > 400) {
        lastFeedbackAt = now;
        const rule = currentExerciseId && FORM_RULES[currentExerciseId];
        updateFeedbackUI(rule ? rule(result.landmarks[0]) : null);
      }
    }
  }

  requestAnimationFrame(renderLoop);
}

function updateFeedbackUI(feedback) {
  const banner = document.getElementById("form-feedback");
  if (!banner) return;
  if (!feedback) {
    banner.textContent = currentExerciseId && !FORM_RULES[currentExerciseId]
      ? "No form check available for this exercise yet."
      : "Step back so your whole body is in frame.";
    banner.className = "form-feedback neutral";
    return;
  }
  banner.textContent = feedback.message;
  banner.className = `form-feedback ${feedback.status}`;
}

function setCurrentExercise(id) {
  currentExerciseId = id;
}

window.FormCheck = { start, stop, setCurrentExercise };