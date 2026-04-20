</>  JavaScript

import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { postToAvito } from "./avito.js";

const connection = new IORedis(process.env.REDIS_URL);

export const postQueue = new Queue("postQueue", { connection });

export const worker = new Worker("postQueue", async job => {
  const { title, description, imagePath } = job.data;

  await new Promise(r => setTimeout(r, 60000)); // анти-бан задержка

  await postToAvito({ title, description, imagePath });
}, { connection });