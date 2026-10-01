import express from "express";
import cors from "cors";
import "dotenv/config";
import { supabase } from "./supabaseClient.js";

const app = express();
app.disable('etag');
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "https://aayut1111.github.io",
  ],
}));
app.use(express.json());

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: "Unauthorized" });
    req.userId = data.user.id;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.get("/api/workouts", requireAuth, async (req, res) => {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", req.userId)
    .order("date", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post("/api/workouts", requireAuth, async (req, res) => {
  const { date, duration, focus, difficulty, exercise_count, exercise_names } = req.body;
  const { data, error } = await supabase
    .from("workouts")
    .insert({ user_id: req.userId, date, duration, focus, difficulty, exercise_count, exercise_names })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

const PORT = process.env.PORT || 5060;
app.listen(PORT, () => {
  console.log(`Bodyweight Circuit backend running on :${PORT}`);
});