// Build prompt for OpenAI message generation
export function generatePrompt({ user_summary, name, title, company, shared, tone }) {
  return `You are an expert LinkedIn networking assistant.\n\nUser background:\n${user_summary}\n\nTarget:\n${name}, ${title} at ${company}\nShared context: ${shared}\n\nGenerate a ${tone} LinkedIn connection request (<300 chars).`;
} 