from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional, Dict, Any, List, Union
import uvicorn
import re
from datetime import datetime
from services.candidate_scraper import scrape_linkedin_profile
from services.company_scraper import scrape_linkedin_company
from config import settings

app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class ScrapeRequest(BaseModel):
    url: str
    type: str = "profile"  # "profile" or "company"
    
    @field_validator('url')
    @classmethod
    def validate_linkedin_url(cls, v):
        if not v or 'linkedin.com' not in str(v):
            raise ValueError('URL must be a LinkedIn URL')
        return v
    
    @field_validator('type')
    @classmethod
    def validate_type(cls, v):
        if v not in ["profile", "company"]:
            raise ValueError('Type must be either "profile" or "company"')
        return v

# Response Models
class ProfileResponse(BaseModel):
    linkedin_id: str
    name: str
    avatar_url: Optional[str] = None
    headline: Optional[str] = None
    about: Optional[str] = None
    experience: Optional[Dict[str, Any]] = None
    education: Optional[Dict[str, Any]] = None
    scraped_at: datetime

class CompanyResponse(BaseModel):
    linkedin_id: str
    name: str
    description: Optional[str] = None
    size: Optional[str] = None
    founded: Optional[str] = None
    website: Optional[str] = None
    scraped_at: datetime

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: datetime

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
    uptime: float

# Utility Functions
def extract_linkedin_id(url: str) -> str:
    """Extract LinkedIn ID from URL"""
    patterns = [
        r'linkedin\.com/in/([^/?]+)',
        r'linkedin\.com/pub/([^/?]+)',
        r'linkedin\.com/company/([^/?]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            # Remove trailing slash if present
            linkedin_id = match.group(1).rstrip('/')
            return linkedin_id
    
    raise ValueError("Invalid LinkedIn URL format")

# API Endpoints
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information"""
    return {
        "message": settings.API_TITLE,
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    import time
    return HealthResponse(
        status="healthy",
        version=settings.API_VERSION,
        timestamp=datetime.utcnow(),
        uptime=time.time()
    )

@app.post("/scrape", response_model=Union[ProfileResponse, CompanyResponse])
async def scrape_linkedin_endpoint(request: ScrapeRequest):
    # Log incoming request
    print(f"[INFO] Received scrape request: type={request.type}, url={request.url}")
    try:
        linkedin_id = extract_linkedin_id(str(request.url))
        print(f"[INFO] Extracted LinkedIn ID: {linkedin_id}")
        
        if request.type == "profile":
            profile_data = await scrape_linkedin_profile(linkedin_id)
            print(f"[INFO] Scraped profile data: {profile_data}")
            
            if "error" in profile_data:
                print(f"[ERROR] Profile scraping failed: {profile_data['error']}")
                raise HTTPException(
                    status_code=422,
                    detail=f"Profile scraping failed: {profile_data['error']}"
                )
            
            # Type-safe extraction of education, experience, and about data
            education_data = profile_data.get("education")
            experience_data = profile_data.get("experience")
            about_data = profile_data.get("about")
            
            # Extract about text from the dictionary structure
            about_text = None
            if about_data and isinstance(about_data, dict):
                positions = about_data.get("positions", [])
                if positions:
                    about_text = positions[0]  # About text is stored in the first position
            
            print(f"[INFO] Returning ProfileResponse for {linkedin_id}")
            return ProfileResponse(
                linkedin_id=profile_data.get("linkedin_id", linkedin_id),
                name=profile_data.get("name", ""),
                avatar_url=profile_data.get("avatar"),
                headline=profile_data.get("headline"),
                about=about_text,
                experience=experience_data if isinstance(experience_data, dict) else None,
                education=education_data if isinstance(education_data, dict) else None,
                scraped_at=datetime.utcnow()
            )
        
        elif request.type == "company":
            company_data = scrape_linkedin_company(linkedin_id)
            print(f"[INFO] Scraped company data: {company_data}")
            
            if "error" in company_data:
                print(f"[ERROR] Company scraping failed: {company_data['error']}")
                raise HTTPException(
                    status_code=422,
                    detail=f"Company scraping failed: {company_data['error']}"
                )
            
            print(f"[INFO] Returning CompanyResponse for {linkedin_id}")
            return CompanyResponse(
                linkedin_id=company_data.get("linkedin_id", linkedin_id),
                name=company_data.get("name", ""),
                description=company_data.get("description"),
                size=company_data.get("size"),
                founded=company_data.get("founded"),
                website=company_data.get("website"),
                scraped_at=datetime.utcnow()
            )
        
    except ValueError as e:
        print(f"[ERROR] ValueError in scrape endpoint: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid LinkedIn URL: {str(e)}"
        )
    except HTTPException as he:
        print(f"[ERROR] HTTPException in scrape endpoint: {he.detail}")
        raise
    except Exception as e:
        print(f"[ERROR] Unexpected error in scrape endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

# Legacy endpoint for backward compatibility (redirects to new unified endpoint)
@app.post("/scrape/legacy", response_model=ProfileResponse)
async def legacy_scrape_endpoint(request: ScrapeRequest):
    """
    Legacy endpoint for backward compatibility.
    Redirects to the new unified /scrape endpoint
    """
    return await scrape_linkedin_endpoint(request)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL
    ) 