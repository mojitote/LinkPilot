import { config } from 'dotenv'
import puppeteer from 'puppeteer-core'

// Load environment variables
config({ path: '.env.local' })

async function debugPage() {
  const testUrl = process.env.REAL_LINKEDIN_URL
  
  if (!testUrl) {
    console.error('❌ REAL_LINKEDIN_URL not set in .env.local')
    return
  }
  
  console.log('🔍 Debugging LinkedIn page structure...')
  console.log('📝 URL:', testUrl)
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(testUrl, { timeout: 10000 });
    await page.waitForSelector("main", { timeout: 5000 });
    
    // Wait a bit for page to load
    await page.waitForTimeout(3000);
    
    console.log('\n🔍 Analyzing page structure...')
    
    // Check for various elements and their content
    const debugInfo = await page.evaluate(() => {
      const results = {};
      
      // Check all h1 elements
      const h1s = document.querySelectorAll('h1');
      results.h1Elements = Array.from(h1s).map((el, i) => ({
        index: i,
        text: el.innerText.trim(),
        className: el.className,
        id: el.id
      }));
      
      // Check all elements with "text-body-medium" class
      const textBodyMediums = document.querySelectorAll('.text-body-medium');
      results.textBodyMediums = Array.from(textBodyMediums).map((el, i) => ({
        index: i,
        text: el.innerText.trim(),
        className: el.className,
        parentClass: el.parentElement?.className
      }));
      
      // Check for profile picture
      const images = document.querySelectorAll('img');
      results.profileImages = Array.from(images).filter(img => 
        img.alt && (img.alt.includes('profile') || img.alt.includes('avatar') || img.alt.includes('photo'))
      ).map((img, i) => ({
        index: i,
        src: img.src,
        alt: img.alt,
        className: img.className
      }));
      
      // Check for experience/company info
      const experienceElements = document.querySelectorAll('[data-section="experience"], .experience, .pv-entity');
      results.experienceElements = Array.from(experienceElements).map((el, i) => ({
        index: i,
        text: el.innerText.trim().substring(0, 100),
        className: el.className,
        tagName: el.tagName
      }));
      
      // Check for education info
      const educationElements = document.querySelectorAll('[data-section="education"], .education, .pv-entity__school-name');
      results.educationElements = Array.from(educationElements).map((el, i) => ({
        index: i,
        text: el.innerText.trim().substring(0, 100),
        className: el.className,
        tagName: el.tagName
      }));
      
      return results;
    });
    
    console.log('\n📊 Page Analysis Results:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    console.log('\n👤 H1 Elements (potential names):')
    debugInfo.h1Elements.forEach((h1, i) => {
      console.log(`  ${i + 1}. "${h1.text}" (class: ${h1.className})`)
    });
    
    console.log('\n💼 Text Body Medium Elements (potential titles):')
    debugInfo.textBodyMediums.forEach((el, i) => {
      console.log(`  ${i + 1}. "${el.text}" (class: ${el.className})`)
    });
    
    console.log('\n🖼️  Profile Images:')
    debugInfo.profileImages.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img.alt} (class: ${img.className})`)
    });
    
    console.log('\n🏢 Experience Elements:')
    debugInfo.experienceElements.forEach((el, i) => {
      console.log(`  ${i + 1}. "${el.text}..." (class: ${el.className})`)
    });
    
    console.log('\n🎓 Education Elements:')
    debugInfo.educationElements.forEach((el, i) => {
      console.log(`  ${i + 1}. "${el.text}..." (class: ${el.className})`)
    });
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser will stay open for 30 seconds for manual inspection...')
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await browser.close();
  }
}

debugPage() 