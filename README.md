# ThyroDiag API 🩺

A REST API backend for **ThyroDiag** — a medical platform that helps doctors diagnose and manage thyroid gland disorders using AI-assisted analysis.

---

## 🚀 Tech Stack

| Technology | Usage |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **express-validator** | Input validation |
| **cookie-parser** | Cookie handling |

---

## 📁 Project Structure
```
app/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   ├── doctor.model.js          # Doctor/User model
│   │   ├── patient.model.js         # Patient model
│   │   ├── labResult.model.js       # Lab results model
│   │   ├── symptomRecord.model.js   # Symptoms model
│   │   ├── diagnosis.model.js       # Diagnosis model
│   │   ├── appointment.model.js     # Appointments model
│   │   ├── notification.model.js    # Notifications model
│   │   └── dashboardStats.model.js  # Dashboard stats model
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── labResult.controller.js
│   │   ├── symptom.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── patient.route.js
│   │   ├── labResult.route.js
│   │   ├── symptom.route.js
│   │   └── dashboard.route.js
│   ├── middleware/
│   │   └── error.middleware.js      # protect + validate + errorHandler
│   ├── services/
│   │   ├── user.service.js
│   │   ├── patient.service.js
│   │   ├── labResult.service.js
│   │   ├── symptom.service.js
│   │   └── dashboard.service.js
│   ├── seed/
│   │   └── seed.js                  # Database seeder
│   └── app.js
├── .env.example
├── package.json
└── server.js
```

---

## ⚙️ Installation
```bash
# 1. Clone the repo
git clone https://github.com/your-username/thyrodiag-api.git
cd thyrodiag-api

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
```

---

## 🔑 Environment Variables

Create a `.env` file in the root with:
```env
MONGO_URI=mongodb://localhost:27017/thyrodiag
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
```

Generate a secure `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🌱 Seed Database

Populate the database with 2 doctors and 10 patients for testing:
```bash
npm run seed
```

**Test credentials after seeding:**

| Doctor | Email | Password |
|---|---|---|
| Dr. Mohammed Al-Said | mohammed@thyrodiag.com | Doctor@1234 |
| Dr. Sarah Hassan | sarah@thyrodiag.com | Doctor@1234 |

---

## 🏃 Running the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

---

## 📡 API Endpoints

### 🔐 Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register |
| `POST` | `/api/auth/login` | Public | Login |
| `POST` | `/api/auth/logout` | Public | Logout |
| `GET` | `/api/auth/me` | 🔒 Protected | Current Doctor |

### 🏠 Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/dashboard` | 🔒 Protected | Home page informations |

### 🧑‍🤝‍🧑 Patients
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/patients` | 🔒 Protected | File list with filter and search |
| `POST` | `/api/patients` | 🔒 Protected | Add new patient |
| `GET` | `/api/patients/all` | 🔒 Protected | All patients |

### 🧪 Lab Results
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/patients/:patientId/lab-results` | 🔒 Protected | All patient tests |
| `POST` | `/api/patients/:patientId/lab-results` | 🔒 Protected | add new test |
| `GET` | `/api/patients/:patientId/lab-results/:labId` | 🔒 Protected | Only one test |

### 📋 Symptoms
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/patients/:patientId/symptoms` | 🔒 Protected | Patient's symptoms |
| `POST` | `/api/patients/:patientId/symptoms` | 🔒 Protected | Record new symptoms |

---

## 📝 Request Examples

### Register
```json
POST /api/auth/register
{
    "fullName": "Dr. Ahmed Mohamed",
    "email": "ahmed@hospital.com",
    "password": "Doctor@1234"
}
```

### Add Patient
```json
POST /api/patients
{
    "fullName": "أحمد محمد علي",
    "age": 42,
    "gender": "male",
    "phone": "01012345678",
    "email": "patient@example.com",
    "clinicalHistory": "يعاني من خمول في الغدة الدرقية منذ 3 سنوات"
}
```

### Add Lab Result
```json
POST /api/patients/:patientId/lab-results
{
    "tsh": 12.5,
    "freeT4": 0.6,
    "freeT3": 2.1,
    "testDate": "2023-10-27",
    "notes": "المريض صائم 12 ساعة قبل التحليل"
}
```

### Register Symptoms
```json
POST /api/patients/:patientId/symptoms
{
    "fatigue": "moderate",
    "weightChange": "mild",
    "coldHeatIntolerance": "severe",
    "hairLoss": true,
    "drySkin": true,
    "neckSwelling": false,
    "anxiety": 65,
    "moodSwings": 40,
    "concentrationDifficulty": 75,
    "additionalNotes": "المريض يشكو من إرهاق شديد"
}
```

---

## 🔒 Authentication

All protected routes require a JWT token either as:

**Bearer Token header:**
```
Authorization: Bearer <your_token>
```

**Or httpOnly Cookie** (set automatically on login)

---

## 🏥 Thyroid Reference Ranges (ATA 2024)

| Hormone | Low | Normal | High |
|---|---|---|---|
| TSH | < 0.4 mIU/L | 0.4 – 4.0 mIU/L | > 4.0 mIU/L |
| Free T4 | < 0.8 ng/dL | 0.8 – 1.8 ng/dL | > 1.8 ng/dL |
| Free T3 | < 2.3 pg/mL | 2.3 – 4.2 pg/mL | > 4.2 pg/mL |
| Total T3 | < 80 ng/dL | 80 – 200 ng/dL | > 200 ng/dL |

---

## 👨‍💻 Author

Built with ❤️ for ThyroDiag — Thyroid Gland Diagnosis Platform
