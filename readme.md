# 📚 Lecture Scheduler — Full Stack Web Application

A full-stack online lecture scheduling module with an **Admin Panel** and an **Instructor Panel**, built with React, Node.js, Express, and MongoDB.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router DOM, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| File Uploads | Multer |

---

## ✨ Features

### Admin Panel
- 🔐 Secure login with JWT authentication
- 📊 Dashboard with live stats (courses, instructors, lectures)
- 👨‍🏫 View all registered instructors
- 📚 View all courses with images and level badges
- ➕ Add new courses with image upload
- 🗓️ Schedule lectures and assign them to instructors
- ⚠️ **Two-layer clash detection** — prevents same instructor being assigned two lectures on the same date

### Instructor Panel
- 🔐 Secure login (role-based redirect)
- 👋 Personalized welcome dashboard
- 📋 View all assigned lectures with course details and dates
- 🔜 Upcoming vs ✅ Completed lecture separation

### Security
- Passwords encrypted with bcrypt before storing
- JWT tokens expire after 1 day
- Protected routes — unauthorized users redirected to login
- Role-based access control (admin vs instructor)
- MongoDB compound unique index as final clash detection safety net

---

## 📁 Project Structure

```
lecture-scheduler/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js              # protect + adminOnly middleware
│   ├── models/
│   │   ├── User.js              # User schema (admin + instructor)
│   │   ├── Course.js            # Course schema
│   │   └── Lecture.js           # Lecture schema with clash index
│   ├── routes/
│   │   ├── auth.js              # Register + Login routes
│   │   ├── users.js             # Get instructors route
│   │   ├── courses.js           # Course CRUD routes
│   │   └── lectures.js          # Lecture routes with clash detection
│   ├── uploads/                 # Uploaded course images
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js         # Axios instance with interceptor
        ├── components/
        │   ├── AdminLayout.jsx  # Admin sidebar + header layout
        │   └── InstructorLayout.jsx  # Instructor header layout
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        ├── pages/
        │   ├── Login.jsx        # Shared login page
        │   ├── admin/
        │   │   ├── Dashboard.jsx      # Admin dashboard
        │   │   ├── Instructors.jsx    # View all instructors
        │   │   ├── Courses.jsx        # View all courses
        │   │   ├── AddCourse.jsx      # Add course form
        │   │   └── AddLecture.jsx     # Schedule lecture form
        │   └── instructor/
        │       └── InstructorDashboard.jsx  # Instructor's lectures
        ├── App.jsx              # Routes + protected route logic
        └── main.jsx             # App entry point
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) v6+
- npm v9+

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd lecture-scheduler
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/lecture-scheduler
JWT_SECRET=mysecretkey123
```

Start the backend server:

```bash
npm run dev
```

You should see:
```
🚀 Server is running on port 5000
✅ MongoDB connected successfully
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🗄️ Database Setup

### Option 1 — Auto setup (recommended)
The database and collections are created automatically when you first run the backend and make API calls.

### Option 2 — Import database dump
If a database dump is provided:

```bash
mongorestore --db lecture-scheduler ./dump/lecture-scheduler
```

### Seed default users
Use Postman or any HTTP client to register users:

**Register Admin:**
```
POST http://localhost:5000/api/auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}
```

**Register Instructors:**
```
POST http://localhost:5000/api/auth/register
{
  "name": "Rahul Sharma",
  "email": "rahul@test.com",
  "password": "123456",
  "role": "instructor"
}
```

---

## 🔗 API Routes

### 🔐 Auth Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT token | Public |

### 👤 User Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/users/instructors` | Get all instructors | Admin only |

### 📚 Course Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/courses` | Create a new course (with image) | Admin only |
| GET | `/api/courses` | Get all courses | Protected |
| GET | `/api/courses/:id` | Get a single course | Protected |

### 🗓️ Lecture Routes
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/lectures` | Schedule a new lecture | Admin only |
| GET | `/api/lectures` | Get all lectures | Admin only |
| GET | `/api/lectures/instructor/:id` | Get lectures for a specific instructor | Protected |

---

## 🖥️ Frontend Pages & Routes

### Public
| Path | Page | Description |
|---|---|---|
| `/` | Login | Shared login for admin and instructor |

### Admin Panel (requires admin role)
| Path | Page | Description |
|---|---|---|
| `/admin/dashboard` | Dashboard | Stats + recent lectures |
| `/admin/instructors` | Instructors | View all instructors |
| `/admin/courses` | Courses | View all courses |
| `/admin/add-course` | Add Course | Create new course with image |
| `/admin/add-lecture` | Add Lecture | Schedule lecture with clash detection |

### Instructor Panel (requires instructor role)
| Path | Page | Description |
|---|---|---|
| `/instructor/dashboard` | My Lectures | View all assigned lectures |

---

## 🔒 Authentication Flow

```
User submits login form
        ↓
Backend verifies email + password
        ↓
JWT token generated (expires in 1 day)
        ↓
Token + user info saved to localStorage
        ↓
Role checked → redirect to admin or instructor panel
        ↓
Every API request automatically includes token via Axios interceptor
        ↓
Backend middleware verifies token on protected routes
```

---

## ⚠️ Clash Detection Logic

The system prevents double-booking instructors using two layers:

**Layer 1 — Backend code check:**
```
When scheduling a lecture:
→ Convert date to full day range (00:00:00 to 23:59:59)
→ Query: does a lecture exist for this instructor on this date?
→ YES → return 400 error "Schedule clash!"
→ NO  → proceed to save
```

**Layer 2 — MongoDB unique index:**
```javascript
lectureSchema.index({ instructor: 1, date: 1 }, { unique: true })
```
Even if layer 1 fails, MongoDB rejects duplicate instructor+date combinations at the database level.

---

## 👤 Default Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | 123456 |
| Instructor | rahul@test.com | 123456 |
| Instructor | priya@test.com | 123456 |
| Instructor | amit@test.com | 123456 |

---

## 📸 Application Screenshots

### Login Page
- Purple gradient login card
- Role-based redirect after login

### Admin Dashboard
- 3 stat cards (Courses, Instructors, Lectures)
- Recent lectures table
- Sidebar navigation

### Instructor Dashboard
- Welcome card with name and stats
- Upcoming and completed lecture cards
- Course images and level badges

---

## 🔮 Possible Future Enhancements

- [ ] Edit and delete courses and lectures
- [ ] Search and filter lectures by date/instructor
- [ ] Email notifications on lecture assignment
- [ ] Calendar view using `react-big-calendar`
- [ ] Deploy backend on Render, frontend on Vercel
- [ ] Pagination for large data sets
- [ ] Dark mode support

---

## 🧑‍💻 Built With Love

This project was built step by step as a learning exercise covering:
- Full stack architecture design
- REST API development
- JWT authentication
- MongoDB schema design
- React state management with Context API
- Protected routing in React
- File uploads with Multer

---

## 📄 License

This project is for educational purposes.