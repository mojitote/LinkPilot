#!/usr/bin/env python3
"""
Test script to validate XPath selectors against saved HTML files
"""

import os
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import NoSuchElementException

# Add the parent directory to the path so we can import services
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.scraping_utils import search_for_candidate_name, search_for_candidate_avatar, search_for_candidate_headline

def test_xpath_selectors():
    """Test XPath selectors against saved HTML files"""
    
    # Setup Chrome options
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument('--ignore-ssl-errors=yes')
    options.add_argument('--ignore-certificate-errors=yes')
    options.add_argument("--log-level=3")
    options.binary_location = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    
    # Get the test HTML directory
    test_htmls_dir = os.path.join(os.path.dirname(__file__), "htmls")
    
    # Test each HTML file
    for filename in os.listdir(test_htmls_dir):
        if filename.endswith('.html'):
            file_path = os.path.join(test_htmls_dir, filename)
            linkedin_id = filename.replace('.html', '')
            
            print(f"\n{'='*50}")
            print(f"Testing: {filename}")
            print(f"{'='*50}")
            
            # Create a new driver for each file
            driver = webdriver.Chrome(options=options)
            
            try:
                # Load the HTML file
                driver.get(f"file://{file_path}")
                
                # Test name extraction
                print(f"Testing name extraction for {linkedin_id}...")
                name = search_for_candidate_name(driver)
                if name:
                    print(f"✅ Found name: {name}")
                else:
                    print(f"❌ No name found")
                
                # Test avatar extraction
                print(f"Testing avatar extraction for {linkedin_id}...")
                avatar = search_for_candidate_avatar(driver)
                if avatar:
                    print(f"✅ Found avatar: {avatar[:50]}...")
                else:
                    print(f"❌ No avatar found")
                
                # Test headline extraction
                print(f"Testing headline extraction for {linkedin_id}...")
                headline = search_for_candidate_headline(driver)
                if headline:
                    print(f"✅ Found headline: {headline}")
                else:
                    print(f"❌ No headline found")
                    
            except Exception as e:
                print(f"❌ Error testing {filename}: {e}")
            finally:
                driver.quit()

if __name__ == "__main__":
    test_xpath_selectors() 