# config.py
# Unified configuration management for LinkedIn Scraper API

import os
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv(override=True)

class Settings:
    """Unified application settings"""
    
    # LinkedIn API Configuration
    LINKEDIN_ACCESS_TOKEN: str = os.getenv('LINKEDIN_ACCESS_TOKEN') or ""
    LINKEDIN_ACCESS_TOKEN_EXP: str = os.getenv('LINKEDIN_ACCESS_TOKEN_EXP') or ""
    
    # Browser Configuration
    HEADLESS: bool = os.getenv('HEADLESS', 'True').lower() == 'true'
    
    # FastAPI Application Configuration
    API_TITLE: str = "LinkedIn Scraper API"
    API_VERSION: str = "2.0.0"
    API_DESCRIPTION: str = "A production-ready FastAPI service to scrape LinkedIn profiles and companies"
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    RELOAD: bool = os.getenv("RELOAD", "true").lower() == "true"
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "https://yourdomain.com"  # Add your production domain
    ]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    BATCH_SIZE_LIMIT: int = int(os.getenv("BATCH_SIZE_LIMIT", "10"))
    
    # Scraping Configuration
    SCRAPER_TIMEOUT: int = int(os.getenv("SCRAPER_TIMEOUT", "30"))
    SCRAPER_RETRY_ATTEMPTS: int = int(os.getenv("SCRAPER_RETRY_ATTEMPTS", "3"))
    SCRAPER_DELAY: int = int(os.getenv("SCRAPER_DELAY", "2"))
    
    # Security
    API_KEY_HEADER: str = "X-API-Key"
    API_KEY: str = os.getenv("API_KEY", "")
    
    # Database (if needed for caching)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # Monitoring
    ENABLE_METRICS: bool = os.getenv("ENABLE_METRICS", "false").lower() == "true"
    
    @classmethod
    def get_cors_origins(cls) -> List[str]:
        """Get CORS origins from environment or default"""
        env_origins = os.getenv("CORS_ORIGINS")
        if env_origins:
            return env_origins.split(",")
        return cls.CORS_ORIGINS
    
    @classmethod
    def validate_required_settings(cls):
        """Validate required environment variables"""
        if not cls.LINKEDIN_ACCESS_TOKEN:
            raise ValueError("LINKEDIN_ACCESS_TOKEN environment variable is required")
        
        if not cls.LINKEDIN_ACCESS_TOKEN_EXP:
            raise ValueError("LINKEDIN_ACCESS_TOKEN_EXP environment variable is required")

# Global settings instance
settings = Settings()

# Validate required settings on import
settings.validate_required_settings() 