#!/bin/bash

# EduCore Test Runner
# This script runs all tests for both backend and frontend

set -e

echo "========================================="
echo "EduCore School Management System"
echo "Comprehensive Test Suite"
echo "========================================="

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
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the EduCore root directory"
    exit 1
fi

# Backend Tests
print_status "Running Backend Tests..."
cd backend

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
fi

# Run backend unit tests
print_status "Running Backend Unit Tests..."
npm run test -- --coverage --watchAll=false

# Run backend integration tests
print_status "Running Backend Integration Tests..."
npm run test -- --testPathPattern=integration --watchAll=false

cd ..

# Frontend Tests
print_status "Running Frontend Tests..."
cd frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
fi

# Run frontend unit tests
print_status "Running Frontend Unit Tests..."
npm run test -- --coverage --watchAll=false

# Run frontend component tests
print_status "Running Frontend Component Tests..."
npm run test -- --testPathPattern=components --watchAll=false

cd ..

# E2E Tests
print_status "Running E2E Tests..."
cd frontend

# Install Playwright browsers if needed
if [ ! -d "node_modules/.playwright" ]; then
    print_status "Installing Playwright browsers..."
    npx playwright install
fi

# Run E2E tests
print_status "Running E2E Tests..."
npm run test:e2e

cd ..

# Generate Test Report
print_status "Generating Test Report..."
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo "Backend Tests: Completed"
echo "Frontend Unit Tests: Completed"
echo "Frontend Component Tests: Completed"
echo "E2E Tests: Completed"
echo "========================================="

print_success "All tests completed successfully!"
print_status "Check the coverage reports in the following directories:"
echo "- Backend: backend/coverage/"
echo "- Frontend: frontend/coverage/"
echo "- E2E: frontend/playwright-report/"

echo "========================================="
echo "Test Results Summary:"
echo "- Backend Unit Tests: PASSED"
echo "- Backend Integration Tests: PASSED"
echo "- Frontend Unit Tests: PASSED"
echo "- Frontend Component Tests: PASSED"
echo "- E2E Tests: PASSED"
echo "========================================="

print_success "EduCore test suite completed successfully!"
