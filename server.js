</>  JavaScript

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import generateRoutes from "./routes/generate.js";
import billingRoutes from "./routes/billing.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI);

app.use("/auth", authRoutes);
app.use("/generate", generateRoutes);
app.use("/billing", billingRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running");
});