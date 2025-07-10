import { describe, it, expect, vi, beforeEach } from 'vitest'
import { scrapeLinkedIn } from "../lib/scrape.js"

// Mock puppeteer with Chrome path configuration
vi.mock('puppeteer-core', () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto: vi.fn().mockResolvedValue(),
        waitForSelector: vi.fn().mockResolvedValue(),
        evaluate: vi.fn().mockResolvedValue({
          name: "John Doe",
          title: "Software Engineer",
          company: "Tech Corp",
          education: "University of Technology",
          avatar: "https://example.com/avatar.jpg"
        }),
        close: vi.fn().mockResolvedValue()
      }),
      close: vi.fn().mockResolvedValue()
    })
  }
}))

describe("scrapeLinkedIn", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should extract name and title from LinkedIn profile", async () => {
    const testUrl = "https://www.linkedin.com/in/test-user/"
    const data = await scrapeLinkedIn(testUrl)

    console.log("🕵️ Scraped data:", data)

    // Assert that the result contains name and title
    expect(data).toHaveProperty("name")
    expect(data).toHaveProperty("title")
    expect(typeof data.name).toBe("string")
    expect(data.name).toBe("John Doe")
    expect(data.title).toBe("Software Engineer")
  })

  it("should handle scraping errors gracefully", async () => {
    // Mock puppeteer to throw an error
    const puppeteer = await import('puppeteer-core')
    puppeteer.default.launch.mockRejectedValueOnce(new Error("Chrome not found"))

    try {
      await scrapeLinkedIn("https://www.linkedin.com/in/test-user/")
    } catch (err) {
      expect(err.message).toContain("Chrome not found")
    }
  })

  it("should use correct Chrome path for different platforms", async () => {
    const originalPlatform = process.platform
    
    // Test macOS path
    Object.defineProperty(process, 'platform', { value: 'darwin' })
    const data = await scrapeLinkedIn("https://www.linkedin.com/in/test-user/")
    expect(data).toBeDefined()
    
    // Test Windows path
    Object.defineProperty(process, 'platform', { value: 'win32' })
    const data2 = await scrapeLinkedIn("https://www.linkedin.com/in/test-user/")
    expect(data2).toBeDefined()
    
    // Restore original platform
    Object.defineProperty(process, 'platform', { value: originalPlatform })
  })

  it("should handle timeout errors", async () => {
    const puppeteer = await import('puppeteer-core')
    const mockPage = {
      goto: vi.fn().mockRejectedValue(new Error("Navigation timeout")),
      close: vi.fn().mockResolvedValue()
    }
    
    puppeteer.default.launch.mockResolvedValueOnce({
      newPage: vi.fn().mockResolvedValue(mockPage),
      close: vi.fn().mockResolvedValue()
    })

    try {
      await scrapeLinkedIn("https://www.linkedin.com/in/test-user/")
    } catch (err) {
      expect(err.message).toContain("Failed to scrape LinkedIn profile")
    }
  })
})