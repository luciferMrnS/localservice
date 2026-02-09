@echo off
echo Setting up Git repository...

REM Navigate to the correct directory
cd /d "f:\Desktop\VScode prj\local service\local-service-app"

REM Initialize git if not already done
if not exist ".git" (
    echo Initializing Git repository...
    git init
)

REM Add all files
echo Adding files to Git...
git add .

REM Create initial commit
echo Creating initial commit...
git commit -m "Enhanced admin dashboard with filtering, detailed views, and status management

- Rebuilt AdminDashboard.tsx with advanced filtering system
- Added sidebar filters for status, service type, and date range
- Implemented detailed request modal with photo gallery
- Added real-time statistics and status management
- Enhanced request display with badges and thumbnails
- Updated .env.local with Vercel Blob token
- Created comprehensive documentation files"

echo Git setup complete!
echo Files have been committed to the local repository.

echo.
echo To push to a remote repository, you need to:
echo 1. Add a remote repository: git remote add origin [your-repo-url]
echo 2. Push to remote: git push -u origin master
echo.
echo Current status:
git status

pause