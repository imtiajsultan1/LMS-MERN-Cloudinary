# MERN LMS 2024 (LMS LEARN)

Full‑stack MERN LMS with student, instructor, and admin roles. Frontend is Vite + React, backend is Express + MongoDB.

Repo: https://github.com/imtiajsultan1/LMS-MERN-Cloudinary.git

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Atlas or local)

## Clone
```bash
git clone https://github.com/imtiajsultan1/LMS-MERN-Cloudinary.git
cd LMS-MERN-Cloudinary
```

## Server setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173

# Cloudinary (required for media upload)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# PayPal (optional; dummy payments work without these)
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET_ID=...

# Force dummy payments (optional)
DUMMY_PAYMENTS=true
```

Start the server:
```bash
npm run dev
```

Expected logs:
```
Server is now running on port 5000
mongodb is connected
```

## Client setup
Open a new terminal:
```bash
cd client
npm install
npm run dev
```

App runs on `http://localhost:5173`.

## Seed data (recommended for testing)
From `server/`:
```bash
npm run seed:reset
```

Seeded accounts (password: `Password123!`):
- Admin: `admin@example.com`
- Admin: `superadmin@example.com`
- Instructor: `ava.instructor@example.com`
- Instructor: `noah.instructor@example.com`
- Students:
  - `mia.student@example.com`
  - `ethan.student@example.com`
  - `sofia.student@example.com`
  - `lucas.student@example.com`
  - `zara.student@example.com`
  - `oliver.student@example.com`

## How to run (quick)
1) Start server: `cd server && npm run dev`
2) Start client: `cd client && npm run dev`
3) Open `http://localhost:5173`

## Admin dashboard
Login as admin and go to:
- `http://localhost:5173/admin`

Admin can:
- Manage user roles
- Publish/unpublish courses
- View orders

## Dummy card payment + invoice
If `DUMMY_PAYMENTS=true` (or PayPal keys are missing), payment is simulated:
- Buy a course from course details
- Fill the dummy card + billing form
- You will be redirected to `/invoice/:orderId`

## Common issues
- **MongoDB Atlas IP blocked**: add your IP in Atlas Network Access.
- **EADDRINUSE: 5000**: another app is using port 5000. Stop it or set `PORT=5001`.
- **CORS error**: ensure `CLIENT_URL=http://localhost:5173` in `server/.env`.
- **Login fails**: make sure the server is running and you seeded the DB.

## Notes
- `.env` is ignored by git. Do not commit secrets.
- If you change server port, update `client/src/api/axiosInstance.js`.
