#!/bin/bash

# Production SSG Optimization - Migration Script
# This script helps you migrate from puppeteer to puppeteer-core + @sparticuz/chromium

set -e  # Exit on error

echo "======================================"
echo "🚀 VISIBI SSG Optimization Migration"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

cd "$(dirname "$0")/frontend"

echo "📍 Current directory: $(pwd)"
echo ""

# Step 1: Backup
echo "📦 Step 1: Creating backup..."
if [ ! -d "../backups" ]; then
  mkdir -p ../backups
fi
timestamp=$(date +%Y%m%d_%H%M%S)
backup_dir="../backups/frontend_${timestamp}"
mkdir -p "$backup_dir"
cp package.json "$backup_dir/"
cp package-lock.json "$backup_dir/" 2>/dev/null || true
echo "   ✅ Backup created at: $backup_dir"
echo ""

# Step 2: Clean install
echo "🧹 Step 2: Cleaning old dependencies..."
if [ -d "node_modules" ]; then
  echo "   Removing node_modules..."
  rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
  echo "   Removing package-lock.json..."
  rm -f package-lock.json
fi
echo "   ✅ Cleaned"
echo ""

# Step 3: Install new dependencies
echo "📥 Step 3: Installing optimized dependencies..."
echo "   This may take 1-2 minutes..."
npm install
echo "   ✅ Dependencies installed"
echo ""

# Step 4: Verify installation
echo "🔍 Step 4: Verifying installation..."
if npm list puppeteer-core > /dev/null 2>&1; then
  echo "   ✅ puppeteer-core installed"
else
  echo -e "   ${RED}❌ puppeteer-core missing${NC}"
  exit 1
fi

if npm list @sparticuz/chromium > /dev/null 2>&1; then
  echo "   ✅ @sparticuz/chromium installed"
else
  echo -e "   ${RED}❌ @sparticuz/chromium missing${NC}"
  exit 1
fi

if npm list puppeteer > /dev/null 2>&1; then
  echo -e "   ${YELLOW}⚠️  Old puppeteer still present - this is okay if used elsewhere${NC}"
else
  echo "   ✅ Old puppeteer removed"
fi
echo ""

# Step 5: Test build
echo "🏗️  Step 5: Testing build process..."
echo "   Running: npm run build"
echo "   (This may take 30-60 seconds)"
echo ""

if npm run build; then
  echo ""
  echo "   ✅ Build successful!"
  echo ""
else
  echo ""
  echo -e "   ${RED}❌ Build failed - check errors above${NC}"
  echo ""
  exit 1
fi

# Step 6: Verify pre-rendered files
echo "📄 Step 6: Verifying pre-rendered HTML files..."
expected_files=(
  "dist/index.html"
  "dist/about/index.html"
  "dist/geo/index.html"
  "dist/seo/index.html"
  "dist/ppc/index.html"
  "dist/tool/index.html"
  "dist/insights/index.html"
  "dist/how-we-work/index.html"
)

success_count=0
for file in "${expected_files[@]}"; do
  if [ -f "$file" ]; then
    size=$(wc -c < "$file" | tr -d ' ')
    if [ "$size" -gt 1000 ]; then
      echo "   ✅ $file (${size} bytes)"
      success_count=$((success_count + 1))
    else
      echo -e "   ${YELLOW}⚠️  $file exists but seems empty (${size} bytes)${NC}"
    fi
  else
    echo -e "   ${RED}❌ $file missing${NC}"
  fi
done
echo ""

# Summary
echo "======================================"
echo "📊 Migration Summary"
echo "======================================"
echo ""
echo "Pre-rendered pages: $success_count / ${#expected_files[@]}"
echo ""

if [ "$success_count" -eq "${#expected_files[@]}" ]; then
  echo -e "${GREEN}✅ MIGRATION SUCCESSFUL!${NC}"
  echo ""
  echo "Next steps:"
  echo "  1. Test locally: npm run serve"
  echo "  2. Commit changes: git add . && git commit -m 'Optimize SSG'"
  echo "  3. Deploy to Railway: git push"
  echo ""
  echo "Expected Railway build time: 30-60 seconds"
  echo ""
else
  echo -e "${YELLOW}⚠️  MIGRATION PARTIALLY SUCCESSFUL${NC}"
  echo ""
  echo "Some pages failed to pre-render. This might be okay."
  echo "Check build logs above for errors."
  echo ""
fi

echo "Backup location: $backup_dir"
echo ""
echo "======================================"
