# AI Image Generator

This is a full-stack MERN application that allows users to generate images using AI.

## Technologies Used

### Client
- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM

### Server
- Node.js
- Express
- MongoDB (with Mongoose)
- JWT for authentication
- Bcrypt for password hashing
- Dotenv for environment variables

## Setup and Installation

### Prerequisites
- Node.js and npm (or yarn)
- MongoDB

### Server Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the `server` directory and add the following environment variables:
   ```
   PORT=4000
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   ```
5. Start the server:
   ```bash
   npm run server
   ```

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client development server:
   ```bash
   npm run dev
   ```
The application should now be running on your local machine.