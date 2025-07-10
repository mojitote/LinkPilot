import { scrapeLinkedIn } from "../../../lib/scrape";

// POST /api/contact/fetch
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "Missing LinkedIn URL" });
  }
  try {
    const data = await scrapeLinkedIn(url);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to scrape profile" });
  }
} 