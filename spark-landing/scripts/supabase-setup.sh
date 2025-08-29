#!/bin/bash

# Supabase Setup Script for Restaurant Management System
# This script helps you transition from local to production Supabase

set -e

echo "🚀 Supabase Setup Script"
echo "========================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists supabase; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   or"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

if ! command_exists docker; then
    echo "❌ Docker not found. Please install Docker Desktop first."
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Prerequisites met"

# Function to start local Supabase
start_local() {
    echo "🏠 Starting local Supabase..."
    supabase start
    echo "✅ Local Supabase started successfully!"
    echo ""
    echo "📊 Local Supabase URLs:"
    echo "   API: http://127.0.0.1:54321"
    echo "   Studio: http://127.0.0.1:54323"
    echo "   Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
    echo ""
}

# Function to stop local Supabase
stop_local() {
    echo "🛑 Stopping local Supabase..."
    supabase stop
    echo "✅ Local Supabase stopped"
}

# Function to reset local database
reset_local() {
    echo "🔄 Resetting local database..."
    supabase db reset
    echo "✅ Local database reset successfully!"
}

# Function to setup production
setup_production() {
    echo "🌐 Setting up production Supabase..."
    echo ""
    echo "Please provide your Supabase project details:"
    echo ""
    
    read -p "Enter your Supabase project reference: " PROJECT_REF
    read -p "Enter your Supabase project URL: " PROJECT_URL
    read -p "Enter your Supabase anon key: " ANON_KEY
    read -p "Enter your Supabase service role key: " SERVICE_ROLE_KEY
    
    if [ -z "$PROJECT_REF" ] || [ -z "$PROJECT_URL" ] || [ -z "$ANON_KEY" ] || [ -z "$SERVICE_ROLE_KEY" ]; then
        echo "❌ All fields are required!"
        exit 1
    fi
    
    echo ""
    echo "🔗 Linking to production project..."
    supabase link --project-ref "$PROJECT_REF"
    
    echo ""
    echo "📤 Pushing schema to production..."
    supabase db push
    
    echo ""
    echo "📝 Creating production environment file..."
    cat > .env.production << EOF
# Production Supabase Environment
VITE_SUPABASE_URL=$PROJECT_URL
VITE_SUPABASE_ANON_KEY=$ANON_KEY
VITE_SUPABASE_SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

# Production Database URL (if needed)
# DATABASE_URL=your_production_db_url_here
EOF
    
    echo "✅ Production setup completed!"
    echo ""
    echo "📁 Production environment file created: .env.production"
    echo "🔐 Remember to add .env.production to .gitignore"
}

# Function to show status
show_status() {
    echo "📊 Supabase Status:"
    echo ""
    
    if supabase status >/dev/null 2>&1; then
        echo "✅ Local Supabase is running"
        supabase status
    else
        echo "❌ Local Supabase is not running"
    fi
    
    echo ""
    echo "🔗 Project links:"
    supabase projects list 2>/dev/null || echo "No projects linked"
}

# Function to show help
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start-local      Start local Supabase instance"
    echo "  stop-local       Stop local Supabase instance"
    echo "  reset-local      Reset local database"
    echo "  setup-prod       Setup production Supabase"
    echo "  status           Show current status"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-local"
    echo "  $0 setup-prod"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    "start-local")
        start_local
        ;;
    "stop-local")
        stop_local
        ;;
    "reset-local")
        reset_local
        ;;
    "setup-prod")
        setup_production
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        show_help
        ;;
esac
