# Shop Management System

A complete MERN stack application for managing shops and products with user authentication.

## Features

- User Registration & Login with JWT
- Shop Management (Create, Read, Update)
- Product Management (Create, Read, Update under shops)
- Responsive UI with Tailwind CSS
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- Form validation on both client and server
- Protected routes and API endpoints

## Tech Stack

### Frontend
- React 18 with Vite
- React Router DOM for routing
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- CORS enabled

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd shop-management-app


cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# See Environment Variables section below


cd ../client

# Install dependencies
npm install



# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu
sudo systemctl start mongod

# On Windows
net start MongoDB