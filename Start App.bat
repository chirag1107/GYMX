@echo off
echo =========================================
echo       Starting GymX Fat Loss App 
echo =========================================
echo.
echo Checking dependencies...
call npm install

echo.
echo Starting the development server...
echo Your browser should open automatically in a few seconds.
echo (If it doesn't open automatically, look for the "Local:" link below and click it)
echo.

call npm run dev
pause
