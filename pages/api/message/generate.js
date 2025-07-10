import { generateMessage } from "../../../lib/openai";
import { generatePrompt } from "../../../utils/generatePrompt";

// POST /api/message/generate
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { user_summary, name, title, company, shared, tone } = req.body;
  try {
    const prompt = generatePrompt({ user_summary, name, title, company, shared, tone });
    const message = await generateMessage(prompt);
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate message" });
  }
} 