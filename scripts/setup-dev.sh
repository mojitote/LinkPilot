#!/bin/bash

# LinkPilot Development Setup Script
# This script sets up the development environment for LinkPilot

set -e

echo "🚀 Setting up LinkPilot development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
    PYTHON_MAJOR=$(echo $PYTHON_VERSION | cut -d'.' -f1)
    PYTHON_MINOR=$(echo $PYTHON_VERSION | cut -d'.' -f2)
    
    if [ "$PYTHON_MAJOR" -lt 3 ] || ([ "$PYTHON_MAJOR" -eq 3 ] && [ "$PYTHON_MINOR" -lt 11 ]); then
        print_error "Python 3.11+ is required. Current version: $PYTHON_VERSION"
        exit 1
    fi
    
    print_success "Python $PYTHON_VERSION is installed"
}

# Check if Docker is installed (optional)
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
        if command -v docker-compose &> /dev/null; then
            print_success "Docker Compose is installed"
        else
            print_warning "Docker Compose is not installed"
        fi
    else
        print_warning "Docker is not installed (optional for local development)"
    fi
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Are you in the correct directory?"
        exit 1
    fi
    
    npm install
    print_success "Frontend dependencies installed"
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend dependencies..."
    
    if [ ! -f "linkedin-scraper-api/requirements.txt" ]; then
        print_error "Backend requirements.txt not found"
        exit 1
    fi
    
    cd linkedin-scraper-api
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    
    # Install development dependencies
    pip install black isort flake8 mypy pytest pytest-cov pytest-asyncio
    
    cd ..
    print_success "Backend dependencies installed"
}

# Setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env.local" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env.local
            print_success "Created .env.local from env.example"
            print_warning "Please edit .env.local with your API keys and configuration"
        else
            print_warning "No env.example found. Please create .env.local manually"
        fi
    else
        print_success ".env.local already exists"
    fi
}

# Setup Git hooks (optional)
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running pre-commit checks..."

# Frontend linting
echo "Running frontend linting..."
npm run lint
if [ $? -ne 0 ]; then
    echo "Frontend linting failed"
    exit 1
fi

# Frontend formatting check
echo "Running frontend formatting check..."
npm run format:check
if [ $? -ne 0 ]; then
    echo "Frontend formatting check failed"
    exit 1
fi

echo "Pre-commit checks passed!"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_success "Git pre-commit hook installed"
    else
        print_warning "Not a Git repository. Skipping Git hooks setup"
    fi
}

# Run initial tests
run_tests() {
    print_status "Running initial tests..."
    
    # Frontend tests
    print_status "Running frontend tests..."
    npm run test:run
    
    # Backend tests
    print_status "Running backend tests..."
    cd linkedin-scraper-api
    source venv/bin/activate
    pytest tests/ -v
    cd ..
    
    print_success "All tests passed!"
}

# Main setup function
main() {
    print_status "Starting LinkPilot development setup..."
    
    # Check prerequisites
    check_node
    check_python
    check_docker
    
    # Setup dependencies
    setup_frontend
    setup_backend
    
    # Setup environment
    setup_env
    
    # Setup Git hooks
    setup_git_hooks
    
    # Run tests
    if [ "$1" != "--skip-tests" ]; then
        run_tests
    fi
    
    print_success "🎉 LinkPilot development environment setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Edit .env.local with your API keys"
    echo "2. Start the development servers:"
    echo "   - Frontend: npm run dev"
    echo "   - Backend: cd linkedin-scraper-api && source venv/bin/activate && uvicorn main:app --reload"
    echo "3. Or use Docker: docker-compose up -d"
    echo ""
    echo "Happy coding! 🚀"
}

# Run main function with all arguments
main "$@" 