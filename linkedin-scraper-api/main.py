from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import re
from services.candidate_scraper import scrape_linkedin_profile

app = FastAPI(
    title="LinkedIn Scraper API",
    description="A FastAPI service to scrape LinkedIn profiles",
    version="1.0.0"
)

class ScrapeRequest(BaseModel):
    url: str

class ScrapeResponse(BaseModel):
    linkedin_id: Optional[str] = None
    name: Optional[str] = None
    headline: Optional[str] = None
    education: Optional[Dict[str, Any]] = None
    experience: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

def extract_linkedin_id(url: str) -> str:
    """Extract LinkedIn ID from URL"""
    # Handle different LinkedIn URL formats
    patterns = [
        r'linkedin\.com/in/([^/]+)',
        r'linkedin\.com/pub/([^/]+)',
        r'linkedin\.com/company/([^/]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    raise ValueError("Invalid LinkedIn URL format")

@app.get("/")
async def root():
    return {"message": "LinkedIn Scraper API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/scrape", response_model=ScrapeResponse)
async def scrape_linkedin_profile_endpoint(request: ScrapeRequest):
    """
    Scrape LinkedIn profile information from the provided URL.
    
    Args:
        request: ScrapeRequest containing the LinkedIn profile URL
        
    Returns:
        ScrapeResponse with profile data or error message
    """
    try:
        # Extract LinkedIn ID from URL
        linkedin_id = extract_linkedin_id(request.url)
        
        # Use original project's scraper function
        profile_data = scrape_linkedin_profile(linkedin_id)
        
        # Check if there was an error
        if "error" in profile_data:
            return ScrapeResponse(error=profile_data["error"])
        
        # Type-safe extraction of education and experience data
        education_data = profile_data.get("education")
        experience_data = profile_data.get("experience")
        
        return ScrapeResponse(
            linkedin_id=profile_data.get("linkedin_id"),
            name=profile_data.get("name"),
            headline=profile_data.get("headline"),
            education=education_data if isinstance(education_data, dict) else None,
            experience=experience_data if isinstance(experience_data, dict) else None
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid LinkedIn URL: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to scrape LinkedIn profile: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 