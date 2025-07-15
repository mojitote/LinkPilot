from selenium import webdriver
from time import sleep
from services.scraping_utils import options, get_chrome_service, search_for_company_name, search_for_company_industry, search_for_company_about, add_session_cookie


def scrape_linkedin_company(linkedin_id):
    """Scraping linkedIn company data"""
    try:
        print(f"[INFO] Creating WebDriver for company ID: {linkedin_id}")
        # Setup Selenium WebDriver
        driver = webdriver.Chrome(service=get_chrome_service(), options=options)
        print(f"[INFO] WebDriver created successfully for company ID: {linkedin_id}")

        # Load cookies from the file
        print(f"[INFO] Loading session cookies for company ID: {linkedin_id}")
        add_session_cookie(driver)

        print(f"[INFO] Scraping data for company ID: {linkedin_id}")

        # LinkedIn URL for the company
        company_url = f"https://www.linkedin.com/company/{linkedin_id}/"

        # Navigate to the LinkedIn company
        driver.get(company_url)
        print(f"[INFO] Navigated to company URL: {company_url}")

        if "/unavailable" in driver.current_url or "Page not found" in driver.page_source:
            driver.quit()
            print(f"[ERROR] Company profile for {linkedin_id} not found (404)")
            return {"error": f"Company profile for {linkedin_id} not found."}
        
        sleep(1)

        # Scrape name, about from the LinkedIn company
        try:
            print(f"[INFO] Extracting company details for {linkedin_id}")
            name = search_for_company_name(driver)
            if not name:
                driver.quit()
                print(f"[ERROR] Scraping failed due to session token not setup or expired for {linkedin_id}")
                return {"error": "Your Linkedin session token is not set up correctly or has expired"}
            industry = search_for_company_industry(driver)
            about = search_for_company_about(driver)
        except Exception as e:
            print(f"[ERROR] Exception while scraping details for company {linkedin_id}: {e}")
            return {"error": f"Error searching for details for company {linkedin_id}"}

        driver.quit()
        print(f"[INFO] Successfully fetched details for company {linkedin_id}")
        return {
            "linkedin_id": linkedin_id,
            "name": name,
            "industry": industry,
            "about": about,
        }
    except Exception as e:
        print(f"[ERROR] Exception while fetching details for company {linkedin_id}: {e}")
        return {"error": f"Error fetching company details for {linkedin_id}"}