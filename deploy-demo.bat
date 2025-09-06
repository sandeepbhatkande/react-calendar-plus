@echo off

REM Build the demo
npm run build:demo

REM Create a temporary directory for deployment
if not exist temp-deploy mkdir temp-deploy
xcopy /E /I demo-dist temp-deploy

REM Create a .nojekyll file to prevent Jekyll processing
echo. > temp-deploy\.nojekyll

REM Switch to gh-pages branch (create if doesn't exist)
git checkout -b gh-pages 2>nul || git checkout gh-pages

REM Remove all files except .git
for /f "delims=" %%i in ('dir /b /a-d') do del "%%i" 2>nul
for /f "delims=" %%i in ('dir /b /ad') do if not "%%i"==".git" rmdir /s /q "%%i" 2>nul

REM Copy demo files
xcopy /E /I temp-deploy .

REM Add and commit
git add .
git commit -m "Deploy demo to GitHub Pages"

REM Push to gh-pages branch
git push origin gh-pages

REM Switch back to main branch
git checkout main

REM Clean up
rmdir /s /q temp-deploy

echo Demo deployed to GitHub Pages!
echo Demo URL: https://sandeepbhatkande.github.io/react-calendar-plus/
pause
