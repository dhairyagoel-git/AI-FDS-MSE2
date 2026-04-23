# Lost & Found Item Management System
MERN Stack Application — MSE-2 Project

## Project Structure
```
lost-found/
├── backend/
│   ├── models/         # Mongoose models (User, Item)
│   ├── routes/         # Express routes (auth, items)
│   ├── middleware/     # JWT auth middleware
│   ├── server.js       # Entry point
│   └── .env.example    # Environment variables template
├── frontend/
│   ├── public/
│   └── src/
│       ├── pages/      # Register, Login, Dashboard
│       ├── App.js      # Router setup
│       ├── api.js      # Axios instance
│       └── index.css   # Styles
└── render.yaml         # Render deployment config
```

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Register new user |
| POST | /api/login | No | Login user, returns JWT |
| POST | /api/items | Yes | Add new item |
| GET | /api/items | Yes | Get all items |
| GET | /api/items/:id | Yes | Get item by ID |
| PUT | /api/items/:id | Yes | Update item (owner only) |
| DELETE | /api/items/:id | Yes | Delete item (owner only) |
| GET | /api/items/search?name=xyz | Yes | Search items by name |

## Deployment on GitHub

```bash
git init
git add .
git commit -m "Initial commit - Lost & Found MERN app"
git remote add origin https://github.com/YOUR_USERNAME/lost-found.git
git push -u origin main
```

## Deployment on Render

### Backend:
1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any random secret string
7. Click **Deploy**

### Frontend:
1. Update `src/api.js` → change `baseURL` to your Render backend URL
2. Go to Render → New → Static Site
3. Connect your GitHub repo
4. Set **Root Directory** to `frontend`
5. Build Command: `npm install && npm run build`
6. Publish Directory: `build`
7. Click **Deploy**

## MongoDB Atlas Setup
1. Create free cluster at https://mongodb.com/atlas
2. Create database user
3. Whitelist IP: 0.0.0.0/0 (allow all for Render)
4. Get connection string → paste in MONGO_URI

## Technologies Used
- **MongoDB** — Database
- **Express.js** — Backend framework
- **React.js** — Frontend
- **Node.js** — Runtime
- **bcrypt** — Password hashing
- **jsonwebtoken** — Authentication
- **Axios** — HTTP client
