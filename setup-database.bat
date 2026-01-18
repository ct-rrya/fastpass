@echo off
echo ========================================
echo FastPass Database Setup
echo ========================================
echo.

echo Step 1: Checking Prisma installation...
call npx prisma --version
if errorlevel 1 (
    echo ERROR: Prisma not installed!
    echo Run: npm install
    pause
    exit /b 1
)
echo ✓ Prisma installed
echo.

echo Step 2: Checking .env file...
if not exist .env (
    echo WARNING: .env file not found!
    echo.
    echo Please create .env file with:
    echo DATABASE_URL="postgresql://user:pass@host:port/database"
    echo.
    echo For Railway: Copy DATABASE_URL from Railway PostgreSQL service
    echo For Local: Install PostgreSQL and use localhost connection
    echo.
    pause
    exit /b 1
)
echo ✓ .env file exists
echo.

echo Step 3: Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)
echo ✓ Prisma Client generated
echo.

echo Step 4: Running database migration...
echo This will create tables in your database.
echo.
choice /C YN /M "Continue with migration"
if errorlevel 2 goto :skip_migration

call npx prisma migrate dev --name init
if errorlevel 1 (
    echo ERROR: Migration failed!
    echo.
    echo Common issues:
    echo - DATABASE_URL is incorrect
    echo - PostgreSQL is not running
    echo - Database doesn't exist
    echo.
    echo Check DATABASE_SETUP.md for help
    pause
    exit /b 1
)
echo ✓ Migration completed
echo.

:skip_migration

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start server: npm run server
echo 2. Test the app: http://localhost:3001
echo 3. View database: npx prisma studio
echo.
echo See DATABASE_SETUP.md for more info
echo.
pause
