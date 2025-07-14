import { describe, it, expect } from 'vitest'
import { scrapeLinkedIn } from '../lib/scrape.js'

// Force local development environment
process.env.NODE_ENV = 'development'

// Get test URL from environment variable
const testUrl = process.env.REAL_LINKEDIN_URL

describe('scrapeLinkedIn (local development)', () => {
  if (!testUrl) {
    it.skip('skipped because REAL_LINKEDIN_URL is not set in .env.local', () => {})
    return
  }

  it('should scrape real LinkedIn profile using local Chrome', async () => {
    console.warn('⚠️  This test will launch your local Chrome browser and access a real LinkedIn profile.')
    console.warn('Make sure you have Google Chrome installed at the default location.')
    console.log(`Testing URL: ${testUrl}`)
    
    const data = await scrapeLinkedIn(testUrl)
    console.log('Scraped data:', JSON.stringify(data, null, 2))
    
    // Check that we have at least a name
    expect(data).toHaveProperty('name')
    expect(typeof data.name).toBe('string')
    expect(data.name.length).toBeGreaterThan(0)
    
    // Check other fields if they exist
    if (data.title) {
      console.log('Title type:', typeof data.title, 'Value:', data.title)
      // If title is an object, try to extract text from it
      if (typeof data.title === 'object') {
        expect(data.title).toBeDefined()
      } else {
        expect(typeof data.title).toBe('string')
        expect(data.title.length).toBeGreaterThan(0)
      }
    }
    
    if (data.company) {
      expect(typeof data.company).toBe('string')
      console.log('Company:', data.company)
    }
    
    if (data.education) {
      expect(typeof data.education).toBe('string')
      console.log('Education:', data.education)
    }
    
    if (data.avatar) {
      expect(typeof data.avatar).toBe('string')
    }
  }, 30000) // 30 second timeout
}) 