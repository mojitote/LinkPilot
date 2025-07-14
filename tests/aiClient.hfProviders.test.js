import assert from "assert";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { AIClient } from "../lib/utils/aiClient.js";

describe("AIClient (Hugging Face Inference Providers)", function () {
  this.timeout(20000); // API may be slow

  it("should generate a chat completion via provider", async function () {
    const messages = [
      { role: "user", content: "What is the capital of France?" }
    ];
    const result = await AIClient.generateChat(messages);
    assert.ok(result && typeof result === "string" && result.length > 0, "Should return a non-empty string");
    console.log("AI Output:", result);
  });

  it("should support custom provider and model", async function () {
    const messages = [
      { role: "user", content: "Write a short professional greeting." }
    ];
    const result = await AIClient.generateChat(messages, {
      provider: process.env.HF_PROVIDER || "auto",
      model: process.env.HF_MODEL || "meta-llama/Llama-3-8B-Instruct"
    });
    assert.ok(result && typeof result === "string" && result.length > 0, "Should return a non-empty string");
    console.log("AI Output (custom):", result);
  });
}); 