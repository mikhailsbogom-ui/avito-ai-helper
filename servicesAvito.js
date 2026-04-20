</>  JavaScript

import puppeteer from "puppeteer";
import fs from "fs";

export async function postToAvito({ title, description, imagePath }) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  if (fs.existsSync("cookies.json")) {
    const cookies = JSON.parse(fs.readFileSync("cookies.json"));
    await page.setCookie(...cookies);
  }

  await page.goto("https://www.avito.ru/new", { waitUntil: "networkidle2" });

  await page.waitForTimeout(20000);

  const cookies = await page.cookies();
  fs.writeFileSync("cookies.json", JSON.stringify(cookies));

  await page.type('input[name="title"]', title);
  await page.type('textarea[name="description"]', description);

  const upload = await page.$('input[type="file"]');
  await upload.uploadFile(imagePath);

  await page.waitForTimeout(3000);

  await page.click('button[type="submit"]');

  await page.waitForTimeout(5000);

  await browser.close();
}