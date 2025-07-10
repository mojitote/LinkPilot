import puppeteer from "puppeteer-core";

// Scrape public LinkedIn profile info
export async function scrapeLinkedIn(url) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(url, { timeout: 10000 });
  await page.waitForSelector("main");
  const data = await page.evaluate(() => ({
    name: document.querySelector("h1")?.innerText.trim(),
    title: document.querySelector(".text-body-medium")?.innerText.trim(),
    company: document.querySelector('[data-field="experience_company"] span')?.innerText.trim(),
    education: document.querySelector('[data-field="education_school"] span')?.innerText.trim(),
    avatar: document.querySelector('img[alt="Avatar"]')?.src,
  }));
  await browser.close();
  return data;
} 