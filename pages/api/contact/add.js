import clientPromise from "../../../lib/db";

// POST /api/contact/add
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const contact = req.body;
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("contacts").insertOne({
      ...contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(200).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact" });
  }
} 