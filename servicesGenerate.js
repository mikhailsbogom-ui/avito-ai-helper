</>  JavaScript

import express from "express";
import multer from "multer";
import fs from "fs";

import auth from "../middleware/auth.js";
import User from "../models/User.js";
import { generateFromImage } from "../services/ai.js";
import { postQueue } from "../services/queue.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post("/", auth, upload.single("image"), async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.credits <= 0) {
    return res.status(403).json({ error: "No credits" });
  }

  const result = await generateFromImage(req.file.path);

  user.credits -= 1;
  await user.save();

  res.json(result);
});

router.post("/autopost", auth, upload.single("image"), async (req, res) => {
  const result = await generateFromImage(req.file.path);

  await postQueue.add("post", {
    title: result.title,
    description: result.description,
    imagePath: req.file.path
  });

  res.json({ status: "queued" });
});

export default router;