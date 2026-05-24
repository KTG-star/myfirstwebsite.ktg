# Kevin's Blooms — Premium Flower Delivery

A full-stack flower delivery web application built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **Aurora Hero Section:** Animated mesh gradient background with floating flower petals.
- **Bento Grid Shop:** Asymmetric layout for featured collections and standard grid for all flowers.
- **Glassmorphism UI:** Frosted glass effects on cards, navbars, and panels.
- **JWT Authentication:** Secure user registration and login with protected routes.
- **Wishlist & Cart:** Full shopping experience with micro-interactions (petal bursts, bounces).
- **Admin Dashboard:** Manage inventory, track orders, and view site statistics.
- **Real-time Stock:** Live stock updates via Socket.io.
- **Responsive Design:** Mobile-first approach for all pages.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, GSAP, Lucide React, Axios.
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, JWT, Bcrypt.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance.

### 2. Backend Setup
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```
4. Seed the database with sample flowers and an admin user:
   ```bash
   npm run seed
   ```
   - Default Admin: `admin@kevinsblooms.com` / `Admin2025`
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the root folder:
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment (Render)

1. Push your code to a GitHub repository.
2. Create a "New Web Service" on [Render](https://render.com).
3. Connect your repository.
4. Set **Root Directory** to `server`.
5. Set **Build Command** to `npm install`.
6. Set **Start Command** to `node index.js`.
7. Add **Environment Variables**:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
8. Deploy!

## License
ISC
