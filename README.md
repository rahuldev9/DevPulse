🚀 DevPulse

DevPulse is a full-stack developer platform built with Next.js and Node.js that allows users to write, manage, submit, and analyze code across multiple programming languages.
It provides authentication, code storage, submission tracking, analytics, and a competitive leaderboard system.

📌 Overview

DevPulse is designed to help developers practice coding, track their activity, and monitor performance through detailed analytics and dashboards.

After authentication, users can write code in multiple languages, save projects, submit solutions, and compete with others through a leaderboard based on submission activity.

✨ Features
🔐 Authentication & Authorization

Secure user registration and login

Protected routes using authentication middleware

Role-based authorization

Session/token management

Account management options

💻 Code Editor

Write code directly in the browser

Supported languages:

Python

Java

C++

JavaScript

Save code snippets

Edit existing code

Delete saved code

Persistent storage for user projects

📤 Code Submission System

Submit coding solutions

Track submission history

Store submission records

Automatic submission counting

🏆 Leaderboard

Ranked based on highest number of submissions

Real-time ranking updates

Competitive coding environment

📊 Dashboard & Analytics

User activity overview

Total submissions

Saved codes statistics

Coding performance insights

Submission analysis

⚙️ User Settings

Update account settings

Logout functionality

Delete account permanently

🏗️ Tech Stack
Frontend

Next.js

React

Tailwind CSS (or your styling framework)

Modern UI Components

Backend

Node.js

Express.js

REST APIs

Database

MongoDB / PostgreSQL (update based on your project)

Authentication

JWT / Session-based Authentication

⚡ Installation

1. Clone the Repository
   git clone https://github.com/your-username/DevPulse.git
   cd devpulse
2. Install Dependencies
   Frontend
   cd frontend
   npm install
   Backend
   cd backend
   npm install
3. Environment Variables

Create a .env file in the server folder:

PORT=5000
MONGO_URI=mongodb
JWT_SECRET=your_secret_key
NODE_ENV=dev
JUDGE0_URL=https://ce.judge0.com/submissions?base64_encoded=false&wait=true
CLIENT_URL=http://localhost:3000
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
EMAIL_USER=email
EMAIL_PASS=your_pass
GOOGLE_CLIENT_ID=your_ID
GOOGLE_CLIENT_SECRET=your_Secret

Start Backend
npm run dev
Start Frontend
npm run dev

App will run on:

Frontend: http://localhost:3000
Backend: http://localhost:5000

📊 Core Modules

Authentication System

Code Editor Module

Submission Engine

Leaderboard System

Analytics Dashboard

User Management

🔒 Security Features

Protected API routes

Token-based authentication

Secure password handling

Authorized resource access

🚀 Future Improvements

Code execution sandbox

AI-based code analysis

Team collaboration

Coding challenges

Real-time collaboration editor

🤝 Contributing

Contributions are welcome!

Fork the repository

Create a feature branch

Commit changes

Submit a Pull Request

👨‍💻 Author

Developed by Rahul
