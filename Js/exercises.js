const EXERCISES = [
  { id: "pushup", name: "Push-Ups", muscleGroup: "upper", difficulty: "medium", instructions: "Hands under shoulders, body straight, lower chest to floor, push back up." },
  { id: "knee-pushup", name: "Knee Push-Ups", muscleGroup: "upper", difficulty: "easy", instructions: "Same as a push-up, knees on the floor for support." },
  { id: "pike-pushup", name: "Pike Push-Ups", muscleGroup: "upper", difficulty: "hard", instructions: "Hips high, hands on floor, lower head toward floor between hands." },
  { id: "tricep-dip", name: "Chair Tricep Dips", muscleGroup: "upper", difficulty: "medium", instructions: "Hands on a sturdy chair edge, lower hips straight down, push back up." },
  { id: "arm-circle", name: "Arm Circles", muscleGroup: "upper", difficulty: "easy", instructions: "Arms out to sides, make small controlled circles forward, then backward." },
  { id: "plank-shoulder-tap", name: "Plank Shoulder Taps", muscleGroup: "upper", difficulty: "medium", instructions: "In a plank, tap opposite shoulder with each hand without rocking hips." },

  { id: "squat", name: "Bodyweight Squats", muscleGroup: "lower", difficulty: "easy", instructions: "Feet shoulder-width, sit hips back and down, chest up, stand back up." },
  { id: "jump-squat", name: "Jump Squats", muscleGroup: "lower", difficulty: "hard", instructions: "Squat down, then explode upward into a jump, land soft and reset." },
  { id: "lunge", name: "Alternating Lunges", muscleGroup: "lower", difficulty: "medium", instructions: "Step forward, lower back knee toward floor, push back to start, alternate legs." },
  { id: "glute-bridge", name: "Glute Bridges", muscleGroup: "lower", difficulty: "easy", instructions: "Lie on back, knees bent, drive hips up squeezing glutes, lower slowly." },
  { id: "calf-raise", name: "Calf Raises", muscleGroup: "lower", difficulty: "easy", instructions: "Stand tall, rise onto toes, hold briefly, lower with control." },
  { id: "wall-sit", name: "Wall Sit", muscleGroup: "lower", difficulty: "hard", instructions: "Back flat against a wall, knees at 90 degrees, hold the position." },

  { id: "plank", name: "Forearm Plank", muscleGroup: "core", difficulty: "medium", instructions: "Forearms and toes on floor, body in a straight line, brace your core." },
  { id: "situp", name: "Sit-Ups", muscleGroup: "core", difficulty: "medium", instructions: "Knees bent, feet flat, curl chest toward knees, lower with control." },
  { id: "bicycle-crunch", name: "Bicycle Crunches", muscleGroup: "core", difficulty: "hard", instructions: "Bring opposite elbow to opposite knee in a pedaling motion." },
  { id: "leg-raise", name: "Lying Leg Raises", muscleGroup: "core", difficulty: "medium", instructions: "Lie flat, legs straight, raise them to vertical, lower without touching down." },
  { id: "superman", name: "Superman Hold", muscleGroup: "core", difficulty: "easy", instructions: "Lie face down, lift arms and legs off the floor together, hold briefly." },
  { id: "side-plank", name: "Side Plank", muscleGroup: "core", difficulty: "hard", instructions: "Balance on one forearm and the side of one foot, hips lifted, body straight." },

  { id: "jumping-jack", name: "Jumping Jacks", muscleGroup: "full", difficulty: "easy", instructions: "Jump feet apart while raising arms overhead, jump back to start." },
  { id: "burpee", name: "Burpees", muscleGroup: "full", difficulty: "hard", instructions: "Squat, kick feet back to a plank, return, then jump up with arms overhead." },
  { id: "mountain-climber", name: "Mountain Climbers", muscleGroup: "full", difficulty: "medium", instructions: "In a plank, drive knees toward chest quickly, alternating legs." },
  { id: "high-knees", name: "High Knees", muscleGroup: "full", difficulty: "medium", instructions: "Jog in place, driving knees up toward waist height as fast as you can." },
  { id: "bear-crawl", name: "Bear Crawl Hold", muscleGroup: "full", difficulty: "medium", instructions: "Hands and toes on floor, knees hovering just above it, hold and brace." },
  { id: "star-jump", name: "Star Jumps", muscleGroup: "full", difficulty: "easy", instructions: "Jump up spreading arms and legs into a star shape, land soft." }
];