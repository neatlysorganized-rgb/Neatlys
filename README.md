# Neatlys

This repository contains the Neatlys service platform scaffold (Next.js frontend + API routes).

Local setup (basic):

1. Copy `.env.example` to `.env.local` and fill values.
2. Install dependencies:

```bash
cd Neatlys
npm install
```

3. Run dev server:

```bash
npm run dev
```

Database:
- Apply `src/config/schema.sql` to your Neon/Postgres instance before running.

API routes are under `src/pages/api/`.

## Project Overview
Neatlys is a project that aims to simplify the management of personal and professional tasks through an organized interface that allows users to manage their schedules efficiently.

## Features
- User authentication and authorization
- Interactive dashboard for task management
- Reminders and notifications
- Integration with calendar services
- Data visualization for tasks and deadlines

## Tech Stack
- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Deployment: Docker, Heroku

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/neatlysorganized-rgb/Neatlys.git
   cd Neatlys
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the application:
   ```bash
   npm start
   ```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
DATABASE_URL=mongodb://localhost:27017/neatlys
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Database Setup
1. Install MongoDB locally or use a cloud service like MongoDB Atlas.
2. Create a new database named `neatlys`.
3. Ensure you have the correct `DATABASE_URL` set in your `.env` file.

## Deployment Instructions
1. Build the production image:
   ```bash
   docker build -t neatlys:latest .
   ```
2. Run the container:
   ```bash
   docker run -p 5000:5000 env-file .env neatlys:latest
   ```
3. To deploy on Heroku:
   - Create a new Heroku app and link it to this repository.
   - Set your environment variables on Heroku.
   - Deploy the app via the Heroku dashboard or CLI.