</>  JavaScript

import fetch from "node-fetch";
import fs from "fs";

export async function generateFromImage(path) {
  const base64 = fs.readFileSync(path, "base64");

  const pred = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: process.env.LLAVA_VERSION,
      input: {
        image: `data:image/jpeg;base64,${base64}`,
        prompt: "Опиши товар"
      }
    })
  });

  const data = await pred.json();

  let result;
  while (true) {
    const check = await fetch(data.urls.get, {
      headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` }
    });
    const json = await check.json();

    if (json.status === "succeeded") {
      result = json.output.join(" ");
      break;
    }

    await new Promise(r => setTimeout(r, 1500));
  }

  const gpt = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Верни JSON: {"title":"","description":"","hashtags":""}`
        },
        {
          role: "user",
          content: result
        }
      ]
    })
  });

  const gptData = await gpt.json();
  return JSON.parse(gptData.choices[0].message.content);
}