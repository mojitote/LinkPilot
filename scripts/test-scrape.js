import { config } from 'dotenv'
import { scrapeLinkedIn } from '../lib/scrape.js'

// Load environment variables
config({ path: '.env.local' })

async function testScrape() {
  const testUrl = process.env.REAL_LINKEDIN_URL
  
  if (!testUrl) {
    console.error('❌ REAL_LINKEDIN_URL not set in .env.local')
    return
  }
  
  console.log('🔍 Testing LinkedIn scraping...')
  console.log('📝 URL:', testUrl)
  console.log('⏳ Starting scrape...')
  
  try {
    const data = await scrapeLinkedIn(testUrl)
    
    // Check if login is required
    if (data.error === 'LOGIN_REQUIRED') {
      console.log('\n❌ LinkedIn requires login')
      console.log('📋 Error:', data.message)
      console.log('💡 Solution: LinkedIn has detected automated access and requires login to view full profile information.')
      return
    }
    
    console.log('\n✅ Scraping completed!')
    console.log('📊 Results:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('👤 Name:', data.name || '❌ Not found')
    console.log('💼 Title:', data.title || '❌ Not found')
    console.log('🏢 Company:', data.company || '❌ Not found')
    console.log('🎓 Education:', data.education || '❌ Not found')
    console.log('🖼️  Avatar:', data.avatar || '❌ Not found')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Analyze the results
    const foundFields = Object.values(data).filter(value => value && typeof value === 'string').length
    const totalFields = 5 // name, title, company, education, avatar
    
    console.log(`\n📈 Success Rate: ${foundFields}/${totalFields} fields found`)
    
    if (foundFields === 1 && data.name) {
      console.log('⚠️  Only name found - LinkedIn may be limiting access to other information')
      console.log('💡 This is common for public profiles that require login for full details')
    } else if (foundFields === 0) {
      console.log('❌ No information found - profile may be private or require login')
    } else if (foundFields >= 3) {
      console.log('✅ Good success rate - most information retrieved')
    }
    
    // Show raw data
    console.log('\n📋 Raw data:')
    console.log(JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('❌ Scraping failed:', error.message)
  }
}

testScrape() 