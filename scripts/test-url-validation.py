#!/usr/bin/env python3
"""
Test script to validate URL handling and LinkedIn ID extraction
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'linkedin-scraper-api'))

from main import extract_linkedin_id, ScrapeRequest
from pydantic import ValidationError

def test_extract_linkedin_id():
    """Test LinkedIn ID extraction with various URL formats"""
    test_urls = [
        "https://www.linkedin.com/in/silasyuan/",
        "https://www.linkedin.com/in/silasyuan",
        "https://www.linkedin.com/in/silasyuan/?originalSubdomain=us",
        "https://linkedin.com/in/silasyuan/",
        "https://www.linkedin.com/company/microsoft/",
        "https://www.linkedin.com/company/microsoft",
    ]
    
    print("Testing LinkedIn ID extraction:")
    for url in test_urls:
        try:
            linkedin_id = extract_linkedin_id(url)
            print(f"✓ {url} -> {linkedin_id}")
        except ValueError as e:
            print(f"✗ {url} -> ERROR: {e}")

def test_scrape_request_validation():
    """Test ScrapeRequest validation with various URLs"""
    test_cases = [
        {
            "url": "https://www.linkedin.com/in/silasyuan/",
            "type": "profile",
            "expected": "valid"
        },
        {
            "url": "https://www.linkedin.com/in/silasyuan",
            "type": "profile", 
            "expected": "valid"
        },
        {
            "url": "https://www.linkedin.com/in/silasyuan/?originalSubdomain=us",
            "type": "profile",
            "expected": "valid"
        },
        {
            "url": "https://www.linkedin.com/company/microsoft/",
            "type": "company",
            "expected": "valid"
        },
        {
            "url": "https://google.com/in/silasyuan/",
            "type": "profile",
            "expected": "invalid"
        },
        {
            "url": "",
            "type": "profile",
            "expected": "invalid"
        }
    ]
    
    print("\nTesting ScrapeRequest validation:")
    for i, case in enumerate(test_cases, 1):
        try:
            request = ScrapeRequest(url=case["url"], type=case["type"])
            if case["expected"] == "valid":
                print(f"✓ Case {i}: {case['url']} -> VALID")
            else:
                print(f"✗ Case {i}: {case['url']} -> UNEXPECTEDLY VALID")
        except ValidationError as e:
            if case["expected"] == "invalid":
                print(f"✓ Case {i}: {case['url']} -> INVALID (expected)")
            else:
                print(f"✗ Case {i}: {case['url']} -> UNEXPECTEDLY INVALID: {e}")

if __name__ == "__main__":
    print("URL Validation Test Suite")
    print("=" * 50)
    
    test_extract_linkedin_id()
    test_scrape_request_validation()
    
    print("\n" + "=" * 50)
    print("Test completed!") 