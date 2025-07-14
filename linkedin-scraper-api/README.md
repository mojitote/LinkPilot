# LinkedIn Scraper API

A production-ready FastAPI service for scraping LinkedIn profiles and companies with RESTful design principles.

## 🏗️ Architecture Overview

This API follows industry-standard RESTful design patterns:

### ✅ RESTful Design Principles
- **Resource-based URLs**: `/scrape` (unified endpoint)
- **Proper HTTP methods**: POST for data processing
- **Type parameter**: Distinguish between profile and company scraping
- **Standard status codes**: 200, 400, 422, 500
- **JSON request/response**: Consistent data format
- **Versioning**: API version in headers and docs
- **Documentation**: Auto-generated OpenAPI/Swagger docs

### 🚀 Features
- **Profile Scraping**: Extract LinkedIn profile data
- **Company Scraping**: Extract LinkedIn company data
- **Batch Processing**: Scrape multiple profiles at once
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Comprehensive error responses
- **Health Monitoring**: Health check endpoints
- **CORS Support**: Cross-origin request handling
- **Docker Support**: Containerized deployment

## 📋 API Endpoints

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | API information | - |
| GET | `/health` | Health check | - |
| GET | `/docs` | Swagger documentation | - |
| POST | `/scrape` | Scrape LinkedIn profile/company | `{"url": "...", "type": "profile"}` |
| POST | `/scrape/batch` | Batch scrape profiles/companies | `{"urls": ["url1", "url2"], "type": "profile"}` |
| POST | `/scrape/legacy` | Legacy endpoint (backward compatibility) | `{"url": "..."}` |

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.11+
- Google Chrome (for web scraping)
- Docker (optional)

### Local Development

1. **Clone and setup**
```bash
cd linkedin-scraper-api
```

2. **Configure environment variables**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env file with your LinkedIn credentials
# Get these values from your LinkedIn browser cookies
nano .env
```

3. **Quick start (recommended)**
```bash
./start.sh
```

4. **Manual setup**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the API
python main.py
```

5. **Access documentation**
```
http://localhost:8000/docs
```

### Docker Deployment

1. **Build and run**
```bash
docker-compose up --build
```

2. **Or build manually**
```bash
docker build -t linkedin-scraper-api .
docker run -p 8000:8000 linkedin-scraper-api
```

## 📝 Usage Examples

### Scrape a LinkedIn Profile

```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://linkedin.com/in/johndoe",
    "type": "profile"
  }'
```

**Response:**
```json
{
  "linkedin_id": "johndoe",
  "name": "John Doe",
  "headline": "Software Engineer at Tech Corp",
  "education": {
    "positions": ["Bachelor of Science"],
    "institutions": ["University of Technology"],
    "dates": ["2018-2022"]
  },
  "experience": {
    "positions": ["Software Engineer"],
    "institutions": ["Tech Corp"],
    "dates": ["2022-Present"]
  },
  "avatar_url": "https://...",
  "location": "San Francisco, CA",
  "industry": "Technology",
  "summary": "Passionate software engineer...",
  "scraped_at": "2024-01-15T10:30:00Z"
}
```

### Batch Scrape Multiple Profiles

```bash
curl -X POST "http://localhost:8000/scrape/batch" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://linkedin.com/in/user1",
      "https://linkedin.com/in/user2",
      "https://linkedin.com/in/user3"
    ],
    "type": "profile",
    "max_concurrent": 3
  }'
```

### Scrape a LinkedIn Company

```bash
curl -X POST "http://localhost:8000/scrape" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://linkedin.com/company/microsoft",
    "type": "company"
  }'
```

### Health Check

```bash
curl "http://localhost:8000/health"
```

**Response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 1234.56
}
```

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LINKEDIN_ACCESS_TOKEN` | **Required** | LinkedIn authentication token from browser cookies |
| `LINKEDIN_ACCESS_TOKEN_EXP` | **Required** | Token expiration timestamp |
| `HEADLESS` | `True` | Run browser in headless mode (`True`/`False`) |
| `HOST` | `0.0.0.0` | Server host |
| `PORT` | `8000` | Server port |
| `RELOAD` | `true` | Auto-reload on changes |
| `LOG_LEVEL` | `info` | Logging level |
| `RATE_LIMIT_PER_MINUTE` | `60` | Rate limiting |
| `BATCH_SIZE_LIMIT` | `10` | Max batch size |
| `SCRAPER_TIMEOUT` | `30` | Scraping timeout |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed origins |

### Getting LinkedIn Credentials

1. **Login to LinkedIn** in your browser
2. **Open Developer Tools** (F12)
3. **Go to Application/Storage tab**
4. **Find Cookies** for `linkedin.com`
5. **Copy the value** of `li_at` cookie → `LINKEDIN_ACCESS_TOKEN`
6. **Copy the expiration** timestamp → `LINKEDIN_ACCESS_TOKEN_EXP`

### Production Configuration

```bash
# .env
HOST=0.0.0.0
PORT=8000
RELOAD=false
LOG_LEVEL=warning
RATE_LIMIT_PER_MINUTE=30
BATCH_SIZE_LIMIT=5
SCRAPER_TIMEOUT=60
CORS_ORIGINS=https://yourdomain.com
API_KEY=your-secret-api-key
```

## 🔒 Security Considerations

### Rate Limiting
- Default: 60 requests per minute
- Configurable via environment variables
- Per-IP tracking

### Input Validation
- URL format validation
- LinkedIn domain verification
- Request size limits

### Error Handling
- No sensitive data in error messages
- Proper HTTP status codes
- Structured error responses

## 📊 Monitoring & Health Checks

### Health Endpoint
```bash
GET /health
```

### Metrics (Optional)
Enable metrics collection:
```bash
ENABLE_METRICS=true
```

### Logging
- Structured JSON logging
- Request/response logging
- Error tracking

## 🚀 Deployment

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linkedin-scraper-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: linkedin-scraper-api
  template:
    metadata:
      labels:
        app: linkedin-scraper-api
    spec:
      containers:
      - name: api
        image: linkedin-scraper-api:latest
        ports:
        - containerPort: 8000
        env:
        - name: HOST
          value: "0.0.0.0"
        - name: PORT
          value: "8000"
```

### Cloud Platforms
- **AWS**: ECS, EKS, or Lambda
- **Google Cloud**: Cloud Run, GKE
- **Azure**: Container Instances, AKS
- **Render**: Docker deployment
- **Railway**: Direct deployment

## 🧪 Testing

### Unit Tests
```bash
pytest tests/
```

### Integration Tests
```bash
pytest tests/integration/
```

### Load Testing
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8000/health

# Using Artillery
artillery run load-test.yml
```

## 📈 Performance Optimization

### Caching
- Redis integration for response caching
- Rate limiting with Redis
- Session management

### Async Processing
- Background tasks for batch operations
- Non-blocking I/O operations
- Connection pooling

### Resource Management
- Memory-efficient scraping
- Connection timeouts
- Resource cleanup

## 🔧 Troubleshooting

### Common Issues

1. **Chrome not found**
   ```bash
   # Install Chrome on Ubuntu
   sudo apt-get install google-chrome-stable
   ```

2. **Rate limiting**
   ```bash
   # Check current limits
   curl -H "X-RateLimit-Remaining" http://localhost:8000/health
   ```

3. **CORS errors**
   ```bash
   # Update CORS_ORIGINS in environment
   export CORS_ORIGINS="http://localhost:3000,https://yourdomain.com"
   ```

### Debug Mode
```bash
LOG_LEVEL=debug python main.py
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

- **Documentation**: `/docs` endpoint
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions 