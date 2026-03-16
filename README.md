# Lume — AI-Powered Image Toolkit

**Lume** is a full-stack SaaS platform that brings together powerful AI image tools in one place. Generate images from text prompts, remove backgrounds, upscale low-resolution photos, and clean up unwanted objects — all powered by the [ClipDrop API](https://clipdrop.co/).

---

## Features

| Feature | Description |
|---|---|
| **Text-to-Image Generation** | Describe what you want and get a stunning AI-generated image in seconds |
| **Background Removal** | Instantly remove backgrounds from any uploaded image with AI precision |
| **Image Upscaling** | Enhance low-resolution images up to 2048×2048 crystal-clear quality |
| **Image Cleanup** | Erase unwanted objects from photos using image + mask input |
| **Authentication** | Secure user registration & login with JWT and bcrypt |
| **Payment Integration** | Purchase credits via **Razorpay** or **Stripe** |
| **Credit System** | Each AI operation costs 1 credit; new users receive 5 free credits |
| **Smooth Animations** | Beautiful scroll-triggered animations with Framer Motion |

---

## Architecture

```
┌──────────────────────────┐       ┌──────────────────────────┐
│         CLIENT           │       │         SERVER           │
│  React + Vite + Tailwind │◄─────►│  Express + MongoDB       │
│  Deployed on Vercel      │  API  │  Deployed on Vercel      │
└──────────────────────────┘       └────────┬─────────────────┘
                                            │
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                        ClipDrop API   Razorpay API   Stripe API
```

---

## Tech Stack

### Frontend
- **React 18** — Component-based UI
- **Vite** — Lightning-fast bundler & dev server
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Scroll & interaction animations
- **React Router DOM** — Client-side routing
- **Axios** — HTTP client
- **React Toastify** — Toast notifications

### Backend
- **Node.js + Express** — REST API server
- **MongoDB + Mongoose** — Database & ODM
- **JWT** — Token-based authentication
- **bcrypt** — Secure password hashing
- **Multer** — Multipart file upload handling
- **Razorpay SDK** — Indian payment gateway
- **Stripe SDK** — Global payment gateway

---

## Project Structure

```
Lume/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/             # Static assets, icons, images, data
│   │   ├── components/         # Reusable UI components
│   │   │   ├── AiTools.jsx     # AI tools showcase grid
│   │   │   ├── Header.jsx      # Hero section with CTA
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Login.jsx       # Auth modal (login/register)
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   ├── Steps.jsx       # How-it-works section
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Description.jsx
│   │   │   └── GenerateBtn.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx   # Global state & API methods
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Result.jsx       # Text-to-image generation
│   │   │   ├── RemoveBg.jsx     # Background removal tool
│   │   │   ├── Upscale.jsx      # Image upscaling tool
│   │   │   ├── Cleanup.jsx      # Image cleanup tool
│   │   │   ├── BuyCredit.jsx    # Credit purchase plans
│   │   │   └── Verify.jsx       # Payment verification
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json              # Vercel SPA rewrite rules
│   └── package.json
│
├── server/                      # Backend (Express + MongoDB)
│   ├── configs/
│   │   └── mongodb.js           # Database connection
│   ├── controllers/
│   │   ├── UserController.js    # Auth, credits, payments
│   │   ├── imageController.js   # Text-to-image generation
│   │   └── aiToolsController.js # BG removal, upscale, cleanup
│   ├── middlewares/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── userModel.js         # User schema (name, email, credits)
│   │   └── transactionModel.js  # Transaction schema
│   ├── routes/
│   │   ├── userRoutes.js        # Auth & payment endpoints
│   │   ├── imageRoutes.js       # Image generation endpoint
│   │   └── aiToolsRoutes.js     # AI tools endpoints
│   ├── server.js                # Entry point
│   ├── vercel.json              # Vercel serverless config
│   └── package.json
│
└── README.md
```

---

## Setup & Installation

### Prerequisites

- **Node.js** v18+ and **npm**
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **ClipDrop API Key** — [Get one here](https://clipdrop.co/apis)
- **Razorpay** and/or **Stripe** keys (for payments)

### 1. Clone the Repository

```bash
git clone https://github.com/ApurvArc/Lume.git
cd Lume
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLIPDROP_API=your_clipdrop_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

CURRENCY=USD
```

Start the server:

```bash
npm run server       # Development (with nodemon)
npm start            # Production
```

### 3. Client Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the client:

```bash
npm run dev
```

The app will be running at **http://localhost:5173**.

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Login and receive JWT |
| `GET`  | `/api/user/credits` | Get user credit balance *(auth)* |

### Image Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/image/generate-image` | Generate image from text prompt *(auth)* |

### AI Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai-tools/remove-bg` | Remove image background *(auth, file upload)* |
| `POST` | `/api/ai-tools/upscale` | Upscale image resolution *(auth, file upload)* |
| `POST` | `/api/ai-tools/cleanup` | Remove objects from image *(auth, image + mask upload)* |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/pay-razor` | Create Razorpay order *(auth)* |
| `POST` | `/api/user/verify-razor` | Verify Razorpay payment |
| `POST` | `/api/user/pay-stripe` | Create Stripe checkout session *(auth)* |
| `POST` | `/api/user/verify-stripe` | Verify Stripe payment *(auth)* |

---

## Credit Plans

| Plan | Credits | Price |
|------|---------|-------|
| **Basic** | 100 | ₹10 |
| **Advanced** | 500 | ₹50 |
| **Business** | 5,000 | ₹250 |

New users receive **5 free credits** on signup. Each AI operation (generation, background removal, upscale, cleanup) costs **1 credit**.

---

## Deployment

Both the client and server are configured for deployment on **[Vercel](https://vercel.com/)**:

- **Client** — Standard Vite SPA with rewrite rules for client-side routing
- **Server** — Deployed as a serverless function via `@vercel/node`

> Make sure to set all environment variables in your Vercel project dashboard.

---

## License

This project is licensed under the **ISC License**.