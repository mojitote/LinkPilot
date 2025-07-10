// import puppeteer from "puppeteer-core";

// // Detect if we're in a cloud environment (AWS Lambda, Vercel, etc.)
// const isCloudEnvironment = process.env.AWS_LAMBDA_FUNCTION_NAME || 
//                           process.env.VERCEL || 
//                           process.env.NODE_ENV === 'production';

// let chromium;

// // Dynamically import chrome-aws-lambda only in cloud environments
// if (isCloudEnvironment) {
//   try {
//     chromium = await import("chrome-aws-lambda");
//   } catch (error) {
//     console.warn("chrome-aws-lambda not available, falling back to local Chrome");
//   }
// }

// // Chrome executable path for local development
// const getChromePath = () => {
//   if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  
//   switch (process.platform) {
//     case 'darwin':
//       return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
//     case 'win32':
//       return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
//     default:
//       return '/usr/bin/google-chrome';
//   }
// };

// // Scrape public LinkedIn profile info
// export async function scrapeLinkedIn(url) {
//   let browser;
  
//   try {
//     if (isCloudEnvironment && chromium) {
//       // Use chrome-aws-lambda for cloud deployment
//       browser = await puppeteer.launch({
//         args: chromium.args,
//         defaultViewport: chromium.defaultViewport,
//         executablePath: await chromium.executablePath,
//         headless: chromium.headless,
//       });
//     } else {
//       // Use local Chrome for development
//       const chromePath = getChromePath();
//       browser = await puppeteer.launch({
//         headless: "new",
//         executablePath: chromePath,
//         args: [
//           '--no-sandbox',
//           '--disable-setuid-sandbox',
//           '--disable-dev-shm-usage',
//           '--disable-accelerated-2d-canvas',
//           '--no-first-run',
//           '--no-zygote',
//           '--disable-gpu',
//           '--disable-blink-features=AutomationControlled',
//           '--disable-web-security',
//           '--disable-features=VizDisplayCompositor'
//         ]
//       });
//     }
    
//     const page = await browser.newPage();
    
//     // Enhanced anti-detection measures
//     await page.evaluateOnNewDocument(() => {
//       // Remove webdriver property
//       delete navigator.__proto__.webdriver;
      
//       // Override plugins
//       Object.defineProperty(navigator, 'plugins', {
//         get: () => [1, 2, 3, 4, 5],
//       });
      
//       // Override languages
//       Object.defineProperty(navigator, 'languages', {
//         get: () => ['en-US', 'en'],
//       });
      
//       // Override permissions
//       const originalQuery = window.navigator.permissions.query;
//       window.navigator.permissions.query = (parameters) => (
//         parameters.name === 'notifications' ?
//           Promise.resolve({ state: Notification.permission }) :
//           originalQuery(parameters)
//       );
//     });
    
//     // Set realistic user agent
//     await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
//     // Set viewport
//     await page.setViewport({ width: 1920, height: 1080 });
    
//     await page.goto(url, { timeout: 15000 });
//     await page.waitForSelector("main", { timeout: 5000 });
    
//     // Wait a bit for page to load
//     await page.waitForTimeout(2000);
    
//     const data = await page.evaluate(() => {
//       // Helper function must be defined inside evaluate!
//       function getTextContent(selectors) {
//         for (const selector of selectors) {
//           const element = document.querySelector(selector);
//           if (element && element.innerText.trim()) {
//             return element.innerText.trim();
//           }
//         }
//         return null;
//       }

//       // Check if login is required
//       const loginPrompt = document.querySelector('.sign-in-prompt') || 
//                          document.querySelector('[data-test-id="sign-in-prompt"]') ||
//                          document.querySelector('.auth-wall') ||
//                          document.querySelector('.login-prompt');
      
//       if (loginPrompt) {
//         return {
//           error: 'LOGIN_REQUIRED',
//           message: 'LinkedIn requires login to view this profile',
//           name: null,
//           title: null,
//           company: null,
//           education: null,
//           avatar: null
//         };
//       }

//       // Updated selectors based on current LinkedIn structure
//       const name = getTextContent([
//         // Main profile name selectors
//         "h1",
//         ".text-heading-xlarge",
//         ".text-heading-2xl",
//         ".pv-text-details__left-panel h1",
//         "[data-section='headline'] h1",
//         ".pv-top-card--list-bullet h1",
//         ".pv-top-card__non-self-picture h1",
//         ".pv-top-card__name",
//         ".profile-name",
//         // Public profile selectors
//         ".top-card-layout__title",
//         ".profile-header__name",
//         ".public-profile__name"
//       ]);
      
//       const title = getTextContent([
//         // Current position/title selectors
//         ".text-body-medium",
//         ".text-body-medium.break-words",
//         ".pv-text-details__left-panel .text-body-medium",
//         "[data-section='headline'] .text-body-medium",
//         ".pv-top-card-profile__headline",
//         ".pv-top-card__headline",
//         ".profile-headline",
//         // Public profile selectors
//         ".top-card-layout__headline",
//         ".profile-header__headline",
//         ".public-profile__headline",
//         // Alternative selectors
//         ".pv-top-card__non-self-picture .text-body-medium",
//         ".pv-top-card--list-bullet .text-body-medium",
//         ".pv-top-card__summary-info .text-body-medium"
//       ]);
      
//       const company = getTextContent([
//         // Current company selectors
//         '[data-field="experience_company"] span',
//         '.pv-entity__company-summary-info h3',
//         '.experience__company-name',
//         '[data-section="experience"] .pv-entity__company-summary-info h3',
//         // Public profile selectors
//         '.top-card-layout__company',
//         '.profile-header__company',
//         // Alternative selectors
//         '.pv-top-card__company-name',
//         '.pv-top-card__summary-info .text-body-medium',
//         '.pv-top-card--list-bullet .text-body-medium',
//         // Experience section selectors
//         '.pv-position-entity__company-name',
//         '.pv-entity__company-name',
//         '.experience-item__company-name'
//       ]);
      
//       const education = getTextContent([
//         // Education selectors
//         '[data-field="education_school"] span',
//         '.pv-entity__school-name',
//         '.education__school-name',
//         '[data-section="education"] .pv-entity__school-name',
//         // Public profile selectors
//         '.top-card-layout__education',
//         '.profile-header__education',
//         // Alternative selectors
//         '.pv-entity__school-name',
//         '.education-item__school-name',
//         '.pv-entity__degree-name'
//       ]);
      
//       // Avatar/Profile picture selectors
//       const avatar = document.querySelector('img[alt*="profile"]')?.src || 
//                     document.querySelector('img[alt*="avatar"]')?.src ||
//                     document.querySelector('.pv-top-card-profile-picture__image')?.src ||
//                     document.querySelector('.profile-picture__image')?.src ||
//                     document.querySelector('.top-card-layout__profile-picture img')?.src ||
//                     document.querySelector('.profile-header__picture img')?.src ||
//                     document.querySelector('.public-profile__picture img')?.src ||
//                     document.querySelector('.pv-top-card__non-self-picture img')?.src ||
//                     document.querySelector('.pv-top-card__profile-picture img')?.src;
      
//       return {
//         name,
//         title,
//         company,
//         education,
//         avatar
//       };
//     });
    
//     // Check if login is required
//     if (data.error === 'LOGIN_REQUIRED') {
//       console.warn('⚠️  LinkedIn requires login to view this profile');
//       return data;
//     }
    
//     console.log('Scraped data:', data);
//     return data;
//   } catch (error) {
//     console.error('Scraping error:', error);
//     throw new Error(`Failed to scrape LinkedIn profile: ${error.message}`);
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// } 

export async function scrapeLinkedIn(url) {
  return {
    linkedin_id,
    name: "Silas Yuan",
    headline: "Product Manager at Example Corp",
    education: {
      positions: ["BSc Computer Science"],
      institutions: ["Example University"],
      dates: ["2015-2019"]
    },
    experience: {
      positions: ["Product Manager", "Software Engineer"],
      institutions: ["Example Corp", "Another Co"],
      dates: ["2020-Now", "2019-2020"]
    }
  };
}