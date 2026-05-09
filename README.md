# Taleem Hub API 🎓

> Multi-Tenant School & Academy Management SaaS Platform — Built for Pakistan.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

---

## 🌐 Overview

Taleem Hub is a cloud-based SaaS platform for private schools, coaching centers, and academies across Pakistan. It delivers **4 completely isolated portals** — Super Admin, School Admin, Teacher, and Parent/Student — each with strict role-based access control.

---

## ✨ Features

- 🏫 Multi-Tenant Architecture with PostgreSQL RLS
- 🔐 JWT Authentication — Role + Tenant based
- 👨‍🎓 Student, Teacher & Class Management
- 💰 Fee Management with Challan Generation
- 📍 GPS-based Teacher Attendance
- 📝 Exam, Marks & Result Card (PDF)
- 🔔 WhatsApp, Email & SMS Notifications
- 📊 AG Grid SSR — handles 10,000+ records
- 🔍 Complete Audit Logging

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS (Node.js) |
| Database | PostgreSQL 15 + TypeORM |
| Auth | JWT + Passport.js + Bcrypt |
| Email | Nodemailer + Gmail SMTP |
| Notifications | Twilio WhatsApp & SMS |
| Storage | AWS S3 / Cloudflare R2 |
| API Docs | Swagger (OpenAPI 3.0) |
| CI/CD | GitHub Actions |
| Hosting | Railway |

---

## 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/Moazali302/Taleem-Hub-api.git
cd Taleem-Hub-api

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start development server
npm run start:dev
```

---

## ⚙️ Environment Variables

```env
DATABASE_HOST=your_db_host
FRONTEND_URL=http://localhost:4200
BACKEND_URL=http://localhost:3000
PORT=3000
NODE_ENV=development
```

---

## 📡 API Endpoints

Base URL: `http://localhost:3000/v1`
Swagger Docs: `http://localhost:3000/api-docs`

| Module | Route |
|--------|-------|
| Auth | `/auth` |
| Students | `/students` |
| Teachers | `/teachers` |
| Classes | `/classes` |
| Attendance | `/attendance` |
| Fees | `/fees` |
| Exams & Results | `/exams` `/results` |
| Complaints | `/complaints` |
| Announcements | `/announcements` |
| Super Admin | `/super-admin` |

---

## 🤝 Contributing

```bash
git checkout -b feature/your-feature
git commit -m "feat: your feature"
git push origin feature/your-feature
# Open Pull Request to develop branch
```

### Commit Convention
`feat` `fix` `chore` `docs` `refactor` `test` `ci`

---

## 📞 Contact

📧 taleemhub2026@gmail.com | 🌐 taleemhub.pk

<p align="center">Built with ❤️ for Pakistan's Education System</p>