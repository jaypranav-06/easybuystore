# EasyBuyStore - Setup Guide

Welcome to EasyBuyStore! This guide will help you set up and run the project on your local machine.

##  Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL Database** (v8.0 or higher) - [Download here](https://www.mysql.com/downloads/)
- **Git** (optional, for version control) - [Download here](https://git-scm.com/)

> **Note for Windows users:** This guide includes commands for both Mac/Linux and Windows. For Windows, you can use Command Prompt, PowerShell, or Git Bash. PowerShell is recommended for better compatibility.

##  Installation Steps

### Step 1: Extract the Project

1. Extract the `easybuystore-nextjs.zip` file to your desired location
2. Open Terminal (Mac/Linux) or Command Prompt (Windows)
3. Navigate to the extracted folder:
   ```bash
   cd path/to/easybuystore-nextjs
   ```

### Step 2: Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

This will install all dependencies listed in `package.json`. This may take a few minutes.

### Step 3: Set Up the Database

#### 3.1 Create MySQL Database

**Option 1: Using MySQL Command Line**

**Mac/Linux:**
```bash
mysql -u root -p
```

**Windows:**
```cmd
# Open Command Prompt as Administrator
# If 'mysql' is not recognized, add MySQL to PATH or use full path:
# "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p

mysql -u root -p
```

**Then run (all platforms):**
```sql
CREATE DATABASE easybuystore;
exit;
```

**Option 2: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click on "Create New Schema" icon
4. Enter "easybuystore" as the schema name
5. Click "Apply"

#### 3.2 Configure Database Connection

1. Create a `.env` file in the root directory of the project

**Mac/Linux:**
```bash
cp .env.example .env
# Or create manually: touch .env
```

**Windows:**
```cmd
copy .env.example .env
# Or create manually: type nul > .env
```

2. Open the `.env` file in any text editor and add the following:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/easybuystore"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-to-random-string"

# PayPal Configuration (Optional - for payments)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
```

**Important:** Replace the following:
- `username` - Your MySQL username (usually `root`)
- `password` - Your MySQL password
- `your-secret-key-here-change-this-to-random-string` - Generate a random secret key

**To generate a secure secret key, run:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Set Up the Database Schema

Run Prisma commands to create the database tables:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push
```

### Step 5: Seed the Database (Optional)

If there's a seed script available, run:

```bash
npx prisma db seed
```

Or manually add some test data using the provided SQL scripts in the `data/` folder (if available).

### Step 6: Run the Development Server

Start the development server:

```bash
npm run dev
```

The application will start on **http://localhost:3000**

##  Accessing the Application

### Customer Interface
- **Home Page:** http://localhost:3000
- **Products:** http://localhost:3000/products
- **Cart:** http://localhost:3000/cart
- **Checkout:** http://localhost:3000/checkout
- **Sign In:** http://localhost:3000/signin
- **Sign Up:** http://localhost:3000/signup

### Admin Interface
- **Admin Login:** http://localhost:3000/admin/login
- **Admin Dashboard:** http://localhost:3000/admin

**Default Admin Credentials** (check `ADMIN_CREDENTIALS.md` file):
- Email: Check the documentation
- Password: Check the documentation

##  Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Run Prisma Studio (Database GUI)
npx prisma studio
```

##  Project Structure

```
easybuystore-nextjs/
 app/                      # Next.js app directory
    (customer pages)     # Customer-facing pages
    admin/               # Admin panel pages
    api/                 # API routes
 components/              # React components
    customer/           # Customer components
    admin/              # Admin components
 lib/                     # Utility functions
    auth/               # Authentication
    db/                 # Database connection
    services/           # Business logic
 prisma/                  # Database schema
    schema.prisma       # Prisma schema file
 public/                  # Static assets
 .env                     # Environment variables (create this)
 package.json            # Dependencies
 README.md               # Project documentation
```

##  Troubleshooting

### Database Connection Issues

**Error: "Can't connect to database"**
- Check that MySQL is running
- Verify your DATABASE_URL in `.env`
- Ensure the database exists
- Check username and password are correct

### Port Already in Use

**Error: "Port 3000 is already in use"**

**Mac/Linux:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

**Windows:**
```cmd
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with the actual process ID)
taskkill /PID <PID> /F

# Or use a different port (PowerShell)
$env:PORT=3001; npm run dev

# Or use a different port (CMD)
set PORT=3001 && npm run dev
```

### Module Not Found Errors

**Mac/Linux:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Windows (PowerShell):**
```powershell
# Clear node_modules and reinstall
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

**Windows (Command Prompt):**
```cmd
# Clear node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (warning: deletes all data)
npx prisma migrate reset
```

### Build Errors

**Mac/Linux:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Windows (PowerShell):**
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

**Windows (Command Prompt):**
```cmd
# Clear Next.js cache
rmdir /s /q .next
npm run dev
```

### Windows-Specific Issues

**MySQL not recognized as command**
- Add MySQL to your PATH environment variable:
  1. Search "Environment Variables" in Windows Start menu
  2. Click "Environment Variables" button
  3. Under "System variables", find and select "Path"
  4. Click "Edit" → "New"
  5. Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
  6. Click OK and restart Command Prompt

**Permission errors when installing packages**
- Run Command Prompt or PowerShell as Administrator
- Or use Git Bash (comes with Git for Windows)

**Line ending issues (CRLF vs LF)**
```cmd
# Configure Git to handle line endings
git config --global core.autocrlf true
```

##  Security Notes

1. **Never commit your `.env` file** to version control
2. **Change the NEXTAUTH_SECRET** to a secure random string
3. **Use strong passwords** for admin accounts
4. **Enable HTTPS** in production
5. **Keep dependencies updated** regularly

##  Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | MySQL connection string | Yes |
| NEXTAUTH_URL | Application URL | Yes |
| NEXTAUTH_SECRET | Secret for session encryption | Yes |
| NEXT_PUBLIC_PAYPAL_CLIENT_ID | PayPal Client ID | No |
| PAYPAL_CLIENT_SECRET | PayPal Secret | No |

##  Next Steps

After successfully running the project:

1. **Create an Admin Account** (if not seeded)
2. **Add Products** through the admin panel
3. **Configure Payment** settings (PayPal)
4. **Customize** the store settings
5. **Test** the ordering process

##  Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

##  Getting Help

If you encounter issues:

1. Check the `docs/` folder for detailed documentation
2. Review error messages carefully
3. Check the browser console for client-side errors
4. Check the terminal for server-side errors
5. Verify all environment variables are set correctly

##  License

This project is proprietary software. All rights reserved.

---

**Happy Shopping! **

For questions or support, contact the development team.
