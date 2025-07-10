from selenium import webdriver
from time import sleep
from services.scraping_utils import options, service, search_for_candidate_name, search_for_candidate_headline, search_for_section, add_session_cookie


def scrape_linkedin_profile(linkedin_id):
    """Mock scraping LinkedIn profile data for development purposes."""
    # 直接返回 mock 数据
    return {
        "linkedin_id": linkedin_id,
        "name": "Silas Yuan",
        "headline": "Product Manager at Example Corp",
        "education": {
            "positions": ["BSc Computer Science"],
            "institutions": ["Example University"],
            "dates": ["2015-2019"]
        },
        "experience": {
            "positions": ["Product Manager", "Software Engineer"],
            "institutions": ["Example Corp", "Another Co"],
            "dates": ["2020-Now", "2019-2020"]
        }
    }