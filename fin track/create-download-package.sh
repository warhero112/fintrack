#!/bin/bash

echo "📦 Creating FinTrack Download Package..."

# Create download directory
mkdir -p FinTrack-Download

# Copy essential files
cp -r src FinTrack-Download/
cp -r dist FinTrack-Download/
cp package.json FinTrack-Download/
cp package-lock.json FinTrack-Download/
cp vite.config.ts FinTrack-Download/
cp index.html FinTrack-Download/
cp .env.example FinTrack-Download/
cp .gitignore FinTrack-Download/
cp README.md FinTrack-Download/

# Create start scripts
cat > FinTrack-Download/start.bat << 'BAT'
@echo off
echo Starting FinTrack App...
echo Installing dependencies...
call npm install
echo Starting development server...
call npm run dev
BAT

cat > FinTrack-Download/start.sh << 'SH'
#!/bin/bash
echo "Starting FinTrack App..."
echo "Installing dependencies..."
npm install
echo "Starting development server..."
npm run dev
SH

chmod +x FinTrack-Download/start.sh

# Create README for download
cat > FinTrack-Download/README.md << 'README'
# FinTrack - Personal Finance Management

## 🚀 Quick Start

### Windows:
1. Double-click `start.bat`
2. Wait for installation to complete
3. App opens at http://localhost:3000

### Mac/Linux:
1. Run `./start.sh`
2. Wait for installation to complete
3. App opens at http://localhost:3000

## ✨ Features

- 💰 **Transaction Management** - Add, edit, delete transactions
- 📊 **Financial Analytics** - Charts and insights
- 🤖 **AI Financial Advisor** - Powered by DeepSeek AI
- 📸 **Bill Scanning** - OCR-powered receipt scanning
- 📱 **Mobile Ready** - PWA support
- 🔒 **Secure** - Local data storage
- 🎨 **Modern UI** - Beautiful, responsive design

## 🔧 Setup (Optional)

For AI features, add your DeepSeek API key to `.env`:
```
VITE_DEEPSEEK_API_KEY=your-deepseek-api-key
```

## 📱 Mobile Installation

1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Install as a native app

## 🆘 Support

If you encounter any issues:
1. Make sure Node.js is installed
2. Check your internet connection
3. Try deleting `node_modules` and running `npm install`

Enjoy managing your finances! 💳
README

echo "✅ Package created successfully!"
echo "📁 Location: FinTrack-Download/"
echo "📦 Size: $(du -sh FinTrack-Download/ | cut -f1)"
echo ""
echo "🎯 To download:"
echo "1. Copy the 'FinTrack-Download' folder to your PC"
echo "2. Double-click 'start.bat' (Windows) or run './start.sh' (Mac/Linux)"
echo "3. App opens at http://localhost:3000"
