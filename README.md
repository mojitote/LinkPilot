# LinkPilot – AI-Powered LinkedIn Assistant

## Project Goal
A minimal, usable web app to:
- Paste a LinkedIn profile URL
- Scrape public info in one go
- Use AI to generate a Connect Message
- Save and manage message/contact history

## Tech Stack
| Layer         | Dependency                | Purpose                                  |
|--------------|---------------------------|------------------------------------------|
| Frontend/API | Next.js 14 (JavaScript)   | Routing, API, deployable on Vercel       |
| Database     | MongoDB Atlas (Free Tier) | Store contacts and message history       |
| AI           | OpenAI GPT-4o API         | Generate Connect/Follow-up messages      |
| Scraping     | Puppeteer Core            | Headless Chrome for scraping             |

## Directory Structure
```
linkpilot/
├─ app/
│   ├─ layout.jsx          // Common layout
│   ├─ page.jsx            // Dashboard page
│   └─ add-contact/
│        └─ page.jsx       // Add Contact form page
├─ components/
│   ├─ AddContactForm.jsx
│   ├─ ContactCard.jsx
│   └─ MessageModal.jsx
├─ lib/
│   ├─ db.js               // MongoDB connection singleton
│   ├─ openai.js           // OpenAI API wrapper
│   └─ scrape.js           // Puppeteer scraping logic
├─ pages/api/
│   ├─ contact/
│   │     ├─ fetch.js      // POST: Scrape profile
│   │     └─ add.js        // POST: Save contact
│   └─ message/
│         └─ generate.js   // POST: Generate message
├─ utils/generatePrompt.js // Prompt builder
├─ public/                 // Static assets
├─ .env.local              // Secrets: MONGODB_URI, OPENAI_API_KEY
└─ README.md
```

## Quick Start
1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd LinkPilot
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` and fill in your secrets.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Plan
- Day 0: Init project, set up .env.local
- Day 1: Build page skeletons (Dashboard, Add Contact, Navbar)
- Day 2: Implement API & AI integration, show results in modal
- Day 3: Deploy to Vercel, write README, record demo GIF

---
See `docs/dev_plan.md` for full details. 