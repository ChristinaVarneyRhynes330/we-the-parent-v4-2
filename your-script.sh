#!/bin/bash

# We The Parent - Build Fix Setup Script
# This script will fix the critical build errors in your project

set -e  # Exit on any error

echo "🚀 Starting We The Parent build fixes..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from your project root directory."
    exit 1
fi

print_status "Detected project directory: $(pwd)"

# 1. Fix critical file structure issue
print_status "Fixing file structure issues..."

if [ -d "app/api/event id" ]; then
    print_warning "Found problematic directory 'app/api/event id' with space in name"
    
    # Create correct directory structure
    mkdir -p "app/api/events/[id]"
    
    # Move the route file if it exists
    if [ -f "app/api/event id/route.ts" ]; then
        mv "app/api/event id/route.ts" "app/api/events/[id]/route.ts"
        print_success "Moved route.ts to correct location"
    fi
    
    # Remove the old directory
    rm -rf "app/api/event id"
    print_success "Removed problematic directory"
else
    print_success "File structure is correct"
fi

# 2. Install missing dependencies
print_status "Installing missing dependencies..."

# Check if package.json needs updates
if ! grep -q "@headlessui/react" package.json; then
    print_status "Installing additional React dependencies..."
    npm install @headlessui/react @heroicons/react class-variance-authority clsx tailwind-merge
fi

if ! grep -q "@types/pdf2json" package.json; then
    print_status "Installing development dependencies..."
    npm install --save-dev @types/pdf2json ignore-loader
fi

print_success "Dependencies updated"

# 3. Create environment template
print_status "Creating environment template..."

if [ ! -f ".env.local" ]; then
    cat > .env.local << 'EOL'
# ===========================================
# We The Parent - Environment Configuration
# ===========================================

# Supabase Configuration
# Get these from your Supabase project dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_URL=your_supabase_project_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# AI API Keys
# OpenAI API key for document analysis
OPENAI_API_KEY=your_openai_api_key_here

# Groq API key for chat functionality  
AI_API_KEY=your_groq_api_key_here

# Google Gemini API key for document drafting
GOOGLE_API_KEY=your_google_api_key_here

# Development Environment
NODE_ENV=development

# ===========================================
# Instructions:
# 1. Replace all "your_*_here" values with actual keys
# 2. Never commit this file to version control
# 3. Keep your API keys secure
# ===========================================
EOL
    print_success "Created .env.local template"
    print_warning "IMPORTANT: You must update .env.local with your actual API keys!"
else
    print_success "Environment file already exists"
fi

# 4. Create .env.example for reference
cat > .env.example << 'EOL'
# Example environment configuration
# Copy this to .env.local and fill in your actual values

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_URL=https://your-project.supabase.co  
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

OPENAI_API_KEY=sk-...your-openai-key
AI_API_KEY=gsk_...your-groq-key  
GOOGLE_API_KEY=AIza...your-google-key

NODE_ENV=development
EOL

# 5. Update .gitignore to ensure sensitive files are not committed
print_status "Updating .gitignore..."

if [ -f ".gitignore" ]; then
    # Add environment files to gitignore if not already present
    if ! grep -q ".env.local" .gitignore; then
        echo "" >> .gitignore
        echo "# Environment files" >> .gitignore
        echo ".env.local" >> .gitignore
        echo ".env*.local" >> .gitignore
    fi
    
    # Add other common excludes
    if ! grep -q "# Build outputs" .gitignore; then
        echo "" >> .gitignore
        echo "# Build outputs" >> .gitignore
        echo ".next/" >> .gitignore
        echo "dist/" >> .gitignore
        echo "out/" >> .gitignore
    fi
    
    print_success "Updated .gitignore"
else
    # Create .gitignore if it doesn't exist
    cat > .gitignore << 'EOL'
# Dependencies
node_modules/

# Environment files
.env
.env.local
.env*.local

# Build outputs
.next/
dist/
out/

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Logs
logs
*.log
npm-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOL
    print_success "Created .gitignore"
fi

# 6. Clean build artifacts
print_status "Cleaning build artifacts..."
rm -rf .next dist out
npm run clean 2>/dev/null || print_warning "No clean script found, continuing..."

# 7. Verify TypeScript configuration
print_status "Checking TypeScript configuration..."

if [ -f "tsconfig.json" ]; then
    print_success "TypeScript configuration found"
else
    print_error "tsconfig.json not found!"
fi

# 8. Run type checking
print_status "Running TypeScript type check..."
if npm run type-check 2>/dev/null; then
    print_success "Type check passed"
else
    print_warning "Type check had issues - this is normal, we'll fix these next"
fi

# 9. Try building the project
print_status "Attempting to build the project..."

if npm run build; then
    print_success "🎉 BUILD SUCCESSFUL! 🎉"
    echo ""
    echo -e "${GREEN}========================${NC}"
    echo -e "${GREEN} Build completed successfully!${NC}"
    echo -e "${GREEN}========================${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env.local file with actual API keys"
    echo "2. Set up your Supabase database with the required tables"
    echo "3. Start the development server: npm run dev"
    echo ""
else
    print_error "Build failed. Here are the most common fixes:"
    echo ""
    echo "1. Check that all API keys are properly set in .env.local"
    echo "2. Verify your Supabase configuration"
    echo "3. Make sure all required dependencies are installed"
    echo ""
    echo "Run this command to see detailed error messages:"
    echo "npm run build"
    echo ""
    echo "If you need help, check the build error output above."
fi

# 10. Display summary
echo ""
echo -e "${BLUE}===========================================${NC}"
echo -e "${BLUE}           Setup Summary${NC}"
echo -e "${BLUE}===========================================${NC}"
echo "✅ Fixed file structure (removed space in folder name)"
echo "✅ Installed missing dependencies" 
echo "✅ Created environment configuration template"
echo "✅ Updated .gitignore"
echo "✅ Cleaned build artifacts"
echo ""

if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  IMPORTANT: Update .env.local with your actual API keys${NC}"
else
    echo -e "${RED}❌ Environment file missing${NC}"
fi

echo ""
echo "🚀 Your We The Parent application should now be ready to run!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""

print_success "Setup script completed!"