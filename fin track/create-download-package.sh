#!/bin/bash

# Create a clean download package
echo "📦 Creating FinTrack Download Package..."

# Create package directory
mkdir -p FinTrack-Download

# Copy essential files
cp -r src FinTrack-Download/
cp package.json FinTrack-Download/
cp vite.config.ts FinTrack-Download/
cp vite.config.simple.ts FinTrack-Download/
cp vite.config.pwa.ts FinTrack-Download/
cp index.html FinTrack-Download/
cp README.md FinTrack-Download/
cp .env.example FinTrack-Download/
cp .gitignore FinTrack-Download/
cp QUICK-FIX.md FinTrack-Download/
cp package-download.md FinTrack-Download/
cp download-instructions.md FinTrack-Download/

# Copy built app
cp -r dist FinTrack-Download/

# Create a simple start script
cat > FinTrack-Download/start.bat << 'BAT'
@echo off
echo Starting FinTrack App...
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
call npm run dev
echo.
echo App will open at http://localhost:3000
pause
BAT

# Create a simple start script for Mac/Linux
cat > FinTrack-Download/start.sh << 'SH'
#!/bin/bash
echo "Starting FinTrack App..."
echo ""
echo "Installing dependencies..."
npm install
echo ""
echo "Starting development server..."
npm run dev
echo ""
echo "App will open at http://localhost:3000"
SH

chmod +x FinTrack-Download/start.sh

# Create final README
cat > FinTrack-Download/README.md << 'README'
# 🎉 FinTrack - Personal Finance Management App

## 🚀 Quick Start

### Windows:
1. Double-click `start.bat`
2. Wait for installation to complete
3. App opens at http://localhost:3000

### Mac/Linux:
1. Open terminal in this folder
2. Run: `./start.sh`
3. App opens at http://localhost:3000

### Manual Start:
```bash
npm install
npm run dev
```

## 📱 Mobile App Installation
1. Open the app in your mobile browser
2. Look for "Add to Home Screen" option
3. Install as a native-like app!

## 🔧 Setup Authentication (Optional)
1. Go to https://supabase.com (free)
2. Create a project
3. Copy your URL and key to `.env` file

## ✨ Features
- 💰 Transaction management
- 📊 Data visualization
- 🏦 Multi-account support
- 📈 Budget tracking
- 🎨 Dark/light themes
- 📱 Mobile responsive
- 🔐 Email authentication
- 💾 Offline support

## 📁 Files Included
- `src/` - Source code
- `dist/` - Built app
- `start.bat` - Windows launcher
- `start.sh` - Mac/Linux launcher
- `QUICK-FIX.md` - Troubleshooting

---
**Ready to manage your finances!** 💪
README

echo "✅ Package created successfully!"
echo "📁 Location: FinTrack-Download/"
echo "📦 Size: $(du -sh FinTrack-Download/ | cut -f1)"
echo ""
echo "🎯 To download:"
echo "1. Copy the 'FinTrack-Download' folder to your PC"
echo "2. Double-click 'start.bat' (Windows) or run './start.sh' (Mac/Linux)"
echo "3. App opens at http://localhost:3000"
