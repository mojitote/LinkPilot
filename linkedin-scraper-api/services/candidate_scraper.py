from selenium import webdriver
from time import sleep
from services.scraping_utils import options, get_chrome_service, search_for_candidate_name, search_for_candidate_headline, search_for_candidate_avatar, search_for_section, add_session_cookie
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def scroll_to_bottom(driver, pause_time=1.5, max_attempts=12):
    """多次缓慢滚动到底部，直到页面高度不再变化"""
    last_height = driver.execute_script("return document.body.scrollHeight")
    for _ in range(max_attempts):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        sleep(pause_time)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height


def click_all_show_more(driver):
    """点击所有可见的Show more按钮"""
    try:
        buttons = driver.find_elements(By.XPATH, "//button[contains(., 'Show more') or contains(., '...see more')]")
        for btn in buttons:
            try:
                if btn.is_displayed() and btn.is_enabled():
                    driver.execute_script("arguments[0].scrollIntoView(true);", btn)
                    sleep(0.5)
                    btn.click()
                    sleep(1)
            except Exception:
                continue
    except Exception:
        pass


def scrape_linkedin_profile(linkedin_id):
    """Scraping linkedIn profile data"""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            print(f"[INFO] Attempt {attempt + 1} to create WebDriver for LinkedIn ID: {linkedin_id}")
            driver = webdriver.Chrome(service=get_chrome_service(), options=options)
            print(f"[INFO] WebDriver created successfully for LinkedIn ID: {linkedin_id}")
            break
        except Exception as e:
            print(f"[ERROR] Attempt {attempt + 1} failed to create WebDriver: {e}")
            if attempt == max_retries - 1:
                print(f"[ERROR] Failed to create WebDriver after {max_retries} attempts: {str(e)}")
                return {"error": f"Failed to create WebDriver after {max_retries} attempts: {str(e)}"}
            import time
            time.sleep(2)  # Wait before retry
    
    try:
        # Load cookies from the file
        print(f"[INFO] Loading session cookies for LinkedIn ID: {linkedin_id}")
        add_session_cookie(driver)

        print(f"[INFO] Scraping data for LinkedIn profile: {linkedin_id}")

        # LinkedIn URL for the profile
        profile_url = f"https://www.linkedin.com/in/{linkedin_id}/"

        # Navigate to the LinkedIn profile
        driver.get(profile_url)
        print(f"[INFO] Navigated to profile URL: {profile_url}")

        if "/404" in driver.current_url or "Page not found" in driver.page_source:
            print(f"[ERROR] Profile for {linkedin_id} not found (404)")
            return {"error": f"Profile for {linkedin_id} not found."}

        sleep(2)

        # --- Optimize scrolling and Show more clicking ---
        print(f"[INFO] Scrolling to bottom and clicking all 'Show more' buttons for {linkedin_id}")
        scroll_to_bottom(driver, pause_time=1.5, max_attempts=8)
        click_all_show_more(driver)
        sleep(1)
        # ---

        # # Save page source for debugging
        # import os
        # current_dir = os.path.dirname(os.path.abspath(__file__))
        # test_htmls_dir = os.path.join(current_dir, "..", "test", "htmls")
        # test_htmls_dir = os.path.abspath(test_htmls_dir)
        # os.makedirs(test_htmls_dir, exist_ok=True)
        # html_file_path = os.path.join(test_htmls_dir, f"{linkedin_id}.html")
        # with open(html_file_path, "w", encoding="utf-8") as f:
        #     f.write(driver.page_source)
        # print(f"[INFO] Saved page source to {html_file_path}")

        # Scrape name, experiences, education from the LinkedIn profile
        try:
            print(f"[INFO] Extracting profile details for {linkedin_id}")
            name = search_for_candidate_name(driver)
            if not name:
                print(f"[ERROR] Could not find name for {linkedin_id}, possibly due to XPath failure or page structure change")
                return {"error": "Could not find name, possibly due to XPath failure or page structure change"}
            avatar = search_for_candidate_avatar(driver)
            headline = search_for_candidate_headline(driver)
            education = search_for_section(driver, "Education")
            experience = search_for_section(driver, "Experience")
            about = search_for_section(driver, "About")
        except Exception as e:
            print(f"[ERROR] Exception while scraping details for {linkedin_id}: {e}")
            return {"error": f"Error searching for details for {linkedin_id}"}

        print(f"[INFO] Successfully fetched details for profile {linkedin_id}")
        return {
            "linkedin_id": linkedin_id,
            "name": name,
            "avatar": avatar,
            "headline": headline,
            "about": about,
            "education": education,
            "experience": experience,
        }
    except Exception as e:
        print(f"[ERROR] Exception while fetching details for {linkedin_id}: {e}")
        return {"error": f"Error fetching profile details for {linkedin_id}"}
    finally:
        print(f"[INFO] Quitting WebDriver for LinkedIn ID: {linkedin_id}")
        driver.quit()