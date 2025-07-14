# LinkedIn Scraper API - Project Structure

## 📁 Directory Structure

```
linkedin-scraper-api/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── start.sh               # Quick start script
├── .gitignore             # Git ignore rules
├── README.md              # Project documentation
├── PROJECT_STRUCTURE.md   # This file
├── config.py              # Configuration settings
├── settings.py            # Environment variables
├── Dockerfile             # Docker container definition
├── docker-compose.yml     # Docker Compose configuration
├── services/              # Core scraping services
│   ├── __init__.py
│   ├── candidate_scraper.py    # Profile scraping logic
│   ├── company_scraper.py      # Company scraping logic
│   └── scraping_utils.py       # Shared utilities and XPath functions
└── test/                  # Testing and debugging
    ├── debug.py           # Manual testing script
    ├── htmls/             # Saved HTML files (gitignored)
    │   └── js/            # JSON results (gitignored)
    └── test/              # Additional test files
```

## 🔧 Core Components

### `main.py`
- FastAPI application with RESTful endpoints
- Request/response models using Pydantic
- Error handling and validation
- CORS middleware configuration
- Health check endpoints

### `services/candidate_scraper.py`
- Main profile scraping function
- Selenium WebDriver setup
- Cookie injection for authentication
- Page scrolling and "Show more" clicking
- HTML snapshot saving (debug mode)

### `services/scraping_utils.py`
- XPath selectors for data extraction
- Name, headline, avatar extraction
- Education and experience parsing
- About section text extraction
- Chrome WebDriver configuration

### `services/company_scraper.py`
- Company profile scraping logic
- Company-specific data extraction

## 🚀 Quick Start

1. **Clone the repository**
2. **Run the quick start script**: `./start.sh`
3. **Access the API docs**: http://localhost:8000/docs
4. **Test with curl**:
   ```bash
   curl -X POST "http://localhost:8000/scrape" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://linkedin.com/in/username", "type": "profile"}'
   ```

## 🔍 Debugging

Use `test/debug.py` for manual testing:
```bash
cd test
python debug.py
# Enter LinkedIn ID when prompted
```

## 📊 API Response Format

### Profile Response
```json
{
  "linkedin_id": "username",
  "name": "John Doe",
  "avatar_url": "https://...",
  "headline": "Software Engineer",
  "about": "About text...",
  "education": {
    "positions": ["Bachelor of Science"],
    "institutions": ["University"],
    "dates": ["2018-2022"]
  },
  "experience": {
    "positions": ["Software Engineer"],
    "institutions": ["Tech Corp"],
    "dates": ["2022-Present"]
  },

  "scraped_at": "2024-01-15T10:30:00Z"
}
```

## 🛠️ Development

### Adding New Features
1. Add XPath selectors in `scraping_utils.py`
2. Update response models in `main.py`
3. Test with `debug.py`
4. Update documentation

### Environment Variables
- `LINKEDIN_ACCESS_TOKEN`: LinkedIn authentication token
- `HEADLESS`: Run browser in headless mode
- `CHROME_BINARY_PATH`: Custom Chrome path

## 🔒 Security Notes
- LinkedIn cookies required for scraping
- Rate limiting recommended
- CORS configuration for production
- Environment variables for sensitive data 