</>  JavaScript

import mongoose from "mongoose";

export default mongoose.model("User", new mongoose.Schema({
  email: String,
  password: String,
  credits: { type: Number, default: 5 }
}));
