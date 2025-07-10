import time
import logging
from typing import Dict, Optional
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LinkedInScraper:
    def __init__(self, headless: bool = True):
        """
        Initialize LinkedIn Scraper with Selenium WebDriver.
        
        Args:
            headless (bool): Whether to run Chrome in headless mode
        """
        self.headless = headless
        self.driver = None
        
    def _setup_driver(self):
        """Setup Chrome WebDriver with appropriate options."""
        chrome_options = Options()
        
        if self.headless:
            chrome_options.add_argument("--headless")
        
        # Anti-detection options
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--disable-web-security")
        chrome_options.add_argument("--disable-features=VizDisplayCompositor")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Set user agent
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        
        # Exclude automation
        chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
        chrome_options.add_experimental_option('useAutomationExtension', False)
        
        try:
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Execute script to remove webdriver property
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            logger.info("Chrome WebDriver initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize WebDriver: {e}")
            raise
    
    def _check_login_required(self) -> bool:
        """Check if LinkedIn requires login."""
        try:
            # Look for login prompts
            login_selectors = [
                '.sign-in-prompt',
                '[data-test-id="sign-in-prompt"]',
                '.auth-wall',
                '.login-prompt',
                '.sign-in-prompt__container'
            ]
            
            for selector in login_selectors:
                if self.driver.find_elements(By.CSS_SELECTOR, selector):
                    return True
            
            # Check for "Join LinkedIn" text
            page_text = self.driver.page_source.lower()
            if "join linkedin" in page_text or "sign in" in page_text:
                return True
                
            return False
            
        except Exception as e:
            logger.warning(f"Error checking login requirement: {e}")
            return False
    
    def _extract_text_with_selectors(self, selectors: list) -> Optional[str]:
        """Extract text using multiple selectors."""
        for selector in selectors:
            try:
                element = self.driver.find_element(By.CSS_SELECTOR, selector)
                if element and element.text.strip():
                    return element.text.strip()
            except NoSuchElementException:
                continue
        return None
    
    def scrape_profile(self, url: str) -> Dict[str, Optional[str]]:
        """
        Scrape LinkedIn profile information.
        
        Args:
            url (str): LinkedIn profile URL
            
        Returns:
            Dict containing profile information
        """
        try:
            if not self.driver:
                self._setup_driver()
            
            logger.info(f"Scraping profile: {url}")
            self.driver.get(url)
            
            # Wait for page to load
            time.sleep(3)
            
            # Check if login is required
            if self._check_login_required():
                logger.warning("LinkedIn requires login to view this profile")
                return {
                    "name": None,
                    "title": None,
                    "company": None,
                    "education": None,
                    "avatar": None,
                    "error": "LOGIN_REQUIRED"
                }
            
            # Extract profile information
            profile_data = {}
            
            # Name selectors
            name_selectors = [
                "h1",
                ".text-heading-xlarge",
                ".text-heading-2xl",
                ".pv-text-details__left-panel h1",
                "[data-section='headline'] h1",
                ".pv-top-card--list-bullet h1",
                ".pv-top-card__non-self-picture h1",
                ".pv-top-card__name",
                ".profile-name",
                ".top-card-layout__title",
                ".profile-header__name",
                ".public-profile__name"
            ]
            profile_data["name"] = self._extract_text_with_selectors(name_selectors)
            
            # Title selectors
            title_selectors = [
                ".text-body-medium",
                ".text-body-medium.break-words",
                ".pv-text-details__left-panel .text-body-medium",
                "[data-section='headline'] .text-body-medium",
                ".pv-top-card-profile__headline",
                ".pv-top-card__headline",
                ".profile-headline",
                ".top-card-layout__headline",
                ".profile-header__headline",
                ".public-profile__headline",
                ".pv-top-card__non-self-picture .text-body-medium",
                ".pv-top-card--list-bullet .text-body-medium",
                ".pv-top-card__summary-info .text-body-medium"
            ]
            profile_data["title"] = self._extract_text_with_selectors(title_selectors)
            
            # Company selectors
            company_selectors = [
                '[data-field="experience_company"] span',
                '.pv-entity__company-summary-info h3',
                '.experience__company-name',
                '[data-section="experience"] .pv-entity__company-summary-info h3',
                '.top-card-layout__company',
                '.profile-header__company',
                '.pv-top-card__company-name',
                '.pv-top-card__summary-info .text-body-medium',
                '.pv-top-card--list-bullet .text-body-medium',
                '.pv-position-entity__company-name',
                '.pv-entity__company-name',
                '.experience-item__company-name'
            ]
            profile_data["company"] = self._extract_text_with_selectors(company_selectors)
            
            # Education selectors
            education_selectors = [
                '[data-field="education_school"] span',
                '.pv-entity__school-name',
                '.education__school-name',
                '[data-section="education"] .pv-entity__school-name',
                '.top-card-layout__education',
                '.profile-header__education',
                '.education-item__school-name',
                '.pv-entity__degree-name'
            ]
            profile_data["education"] = self._extract_text_with_selectors(education_selectors)
            
            # Avatar selectors
            avatar_selectors = [
                'img[alt*="profile"]',
                'img[alt*="avatar"]',
                'img[alt*="photo"]',
                '.pv-top-card-profile-picture__image',
                '.profile-picture__image',
                '.top-card-layout__profile-picture img',
                '.profile-header__picture img',
                '.public-profile__picture img',
                '.pv-top-card__non-self-picture img',
                '.pv-top-card__profile-picture img'
            ]
            
            for selector in avatar_selectors:
                try:
                    element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    if element and element.get_attribute("src"):
                        profile_data["avatar"] = element.get_attribute("src")
                        break
                except NoSuchElementException:
                    continue
            
            if not profile_data["avatar"]:
                profile_data["avatar"] = None
            
            logger.info(f"Scraped data: {profile_data}")
            return profile_data
            
        except Exception as e:
            logger.error(f"Error scraping profile: {e}")
            raise
        finally:
            if self.driver:
                self.driver.quit()
                self.driver = None
    
    def __del__(self):
        """Cleanup WebDriver on object destruction."""
        if self.driver:
            self.driver.quit() 