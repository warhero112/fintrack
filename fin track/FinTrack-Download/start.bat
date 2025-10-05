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
