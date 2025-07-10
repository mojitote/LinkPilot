import { describe, it, expect } from 'vitest'
import { scrapeLinkedIn } from '../lib/scrape.js'

// To run this test, set REAL_LINKEDIN_URL in your environment
const realUrl = "https://www.linkedin.com/in/linda--nguyen/"

describe('scrapeLinkedIn (real integration)', () => {
  if (!realUrl) {
    it.skip('skipped because REAL_LINKEDIN_URL is not set', () => {})
    return
  }

  it('should scrape real LinkedIn profile and extract name and title', async () => {
    console.warn('⚠️  This test will launch a real browser and access a real LinkedIn profile. It may be slow and may fail if LinkedIn blocks the request.')
    const data = await scrapeLinkedIn(realUrl)
    console.log('Scraped data:', data)
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('title')
    expect(typeof data.name).toBe('string')
    expect(typeof data.title).toBe('string')
    expect(data.name.length).toBeGreaterThan(0)
    expect(data.title.length).toBeGreaterThan(0)
  }, 30000) // Increase timeout for slow scraping
}) 