# LinkPilot - AI-Powered LinkedIn Assistant

[![CI/CD Pipeline](https://github.com/your-username/LinkPilot/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/your-username/LinkPilot/actions/workflows/ci.yml)
[![Security Scan](https://github.com/your-username/LinkPilot/workflows/Security%20Scan/badge.svg)](https://github.com/your-username/LinkPilot/actions/workflows/security.yml)
[![Docker Build](https://github.com/your-username/LinkPilot/workflows/Docker%20Build%20and%20Push/badge.svg)](https://github.com/your-username/LinkPilot/actions/workflows/docker.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, AI-powered LinkedIn assistant built with Next.js, FastAPI, and MongoDB. Features automated contact management, intelligent message generation, and professional networking automation.

## 🚀 Features

- **AI-Powered Messaging**: Generate personalized messages using Hugging Face and OpenAI
- **Contact Management**: Automated LinkedIn contact scraping and organization
- **Smart Automation**: Intelligent follow-up scheduling and message optimization
- **Modern UI/UX**: Professional LinkedIn-inspired design with Tailwind CSS
- **Real-time Chat**: Interactive chat interface for message generation
- **Profile Management**: Comprehensive user profile setup and management

## 🏗️ Architecture

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand for client-side state
- **Authentication**: NextAuth.js integration
- **Testing**: Vitest for unit and integration tests

### Backend (FastAPI)
- **Framework**: FastAPI with async support
- **Database**: MongoDB with PyMongo
- **AI Integration**: Hugging Face and OpenAI APIs
- **Scraping**: Selenium with Chrome automation
- **Testing**: pytest with coverage reporting

### CI/CD Pipeline
- **Automated Testing**: Linting, unit tests, and integration tests
- **Security Scanning**: Dependency vulnerability checks and code analysis
- **Containerization**: Docker multi-stage builds
- **Deployment**: Automated staging and production deployments
- **Monitoring**: Comprehensive logging and error tracking

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- React 19
- Tailwind CSS
- Zustand
- NextAuth.js
- Vitest

### Backend
- FastAPI
- Python 3.11
- MongoDB
- Selenium
- Hugging Face API
- OpenAI API

### DevOps
- GitHub Actions
- Docker & Docker Compose
- Vercel (Frontend)
- Railway (Backend)
- MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB
- Docker (optional)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/LinkPilot.git
   cd LinkPilot
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd linkedin-scraper-api
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development servers**
   ```bash
   # Frontend (Terminal 1)
   npm run dev
   
   # Backend (Terminal 2)
   cd linkedin-scraper-api
   python -m uvicorn main:app --reload
   ```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🧪 Testing

### Frontend Tests
```bash
# Run all tests
npm run test:run

# Run with UI
npm run test:ui

# Run integration tests
npm run test:integration
```

### Backend Tests
```bash
cd linkedin-scraper-api

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html
```

### Code Quality
```bash
# Frontend linting
npm run lint
npm run format:check

# Backend linting
cd linkedin-scraper-api
black .
isort .
flake8 .
```

## 🚀 Deployment

### CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline with:

- **Automated Testing**: Linting, unit tests, and integration tests
- **Security Scanning**: Dependency vulnerability checks
- **Containerization**: Docker image building and pushing
- **Deployment**: Automated staging and production deployments

### Manual Deployment

1. **Frontend (Vercel)**
   ```bash
   npm run build
   vercel --prod
   ```

2. **Backend (Railway)**
   ```bash
   cd linkedin-scraper-api
   railway up
   ```

3. **Docker Deployment**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 📚 Documentation

- [API Documentation](docs/api-architecture.md)
- [Design Guidelines](docs/design-guidelines.md)
- [CI/CD Setup](docs/ci-cd-setup.md)
- [Development Guide](docs/dev_plan.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Standards

- Follow ESLint and Prettier configurations
- Write comprehensive tests
- Update documentation
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LinkedIn for the professional networking platform
- Hugging Face for AI model hosting
- OpenAI for advanced language models
- The open-source community for amazing tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/LinkPilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/LinkPilot/discussions)
- **Documentation**: [Project Wiki](https://github.com/your-username/LinkPilot/wiki)

---

**Built with ❤️ for professional networking automation** 