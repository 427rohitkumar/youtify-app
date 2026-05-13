# 🎵 Youtify - Personal YouTube Music Streamer

**Youtify** ek minimal, fast aur clean Spotify-style full-stack personal web application hai jise Next.js (App Router) par banaya gaya hai. Yeh app YouTube Server se real-time audio streams fetch karti hai aur bina kisi server cost ke direct client-side stream karti hai. Isme user authentication, password management (OTP via Email), aur playlist creation ke liye dedicated MongoDB integration diya gaya hai.

---

## 🚀 Features

- 🎹 **Spotify-Style UI:** Tailwind CSS ke sath ek smooth aur responsive Dark Theme interface.
- 📲 **PWA Supported:** Mobile phone me native app ki tarah full-screen (Standalone) install karne ki suvidha.
- ⚡ **Zero Server Cost:** Poori tarah Vercel Serverless environment par chalne ke liye optimized.
- 🎧 **Direct Streaming:** YouTube se high-quality `.m4a`/`.webm` audio stream extraction, bina kisi slow FFmpeg conversion ke.
- 🔐 **Robust Auth:** JWT Token-based User Login/Signup session management.
- 📧 **OTP Password Reset:** Nodemailer aur SMTP service ke sath dynamic OTP validation.
- 🗄️ **Dedicated Remote DB:** Self-hosted VPS MongoDB Atlas (`youtify_db`) connection pool management ke sath.

---

## 📁 Project Folder Structure

```text
youtube-mp3-player/
├── app/
│   ├── api/
│   │   ├── extract/          # YouTube audio link extractor API
│   │   ├── auth/             # Login, Signup aur JWT routes
│   │   └── forgot-password/  # OTP generation aur email router
│   ├── layout.js             # Metadata aur PWA configurations
│   └── page.js               # Frontend Spotify player UI dashboard
├── lib/
│   └── mongodb.js            # Mongoose VPS Connection management
├── models/
│   ├── User.js               # User auth, credentials aur OTP schemas
│   └── Song.js               # Liked songs aur playlist database schemas
├── public/
│   ├── manifest.json         # Mobile installation configs
│   ├── icon-192.png          # App icon for smartphones (192x192)
│   └── icon-512.png          # App icon for smartphones (512x512)
├── .env.local                # Local environment secrets (Git-ignored)
└── package.json              # App dependencies aur scripts
```

---

## ⚙️ Tech Stack & Dependencies

- **Frontend/Backend Framework:** [Next.js 14+](https://nextjs.org) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database ORM:** [Mongoose (MongoDB)](https://mongoosejs.com)
- **Audio Extraction:** `@distube/ytdl-core`
- **Email Service:** `nodemailer`
- **Authentication:** `jsonwebtoken` & `bcryptjs`

---

## 🛠️ Step-by-Step Installation

### 1. Repository Clone & Setup

```bash
# Repo ko local system par open karein
cd youtube-mp3-player

# Sabhi required node packages install karein
npm install
```

### 2. Environment Variables (`.env.local`)

Project ke root directory me `.env.local` file banayein aur niche diye gaye format ke anusar apni keys dalein:

```env
# 🎵 YouTube API Config
YOUTUBE_API_KEY=AIzaSyA1_YOUR_REAL_GOOGLE_API_KEY

# 🔐 JWT Authentication Secrets
JWT_SECRET=your_super_secure_random_jwt_key_here
JWT_EXPIRES_IN=7d

# 📧 Email SMTP Configuration (OTP System)
EMAIL_HOST=gmail.com
EMAIL_PORT=465
EMAIL_USER=your_personal_email@gmail.com
EMAIL_PASS=your_google_app_password_here

# 🗄️ VPS MongoDB Connection URL
MONGODB_URI=mongodb://rohitt:427rohitt@<YOUR_VPS_IP>:27017/youtify_db?authSource=admin

# 🌐 App Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. MongoDB Server Setup (VPS Command Sheet)

Aapke dedicated `youtify_db` aur `rohitt` user permission ko check karne ke liye `mongosh` CLI commands:

```javascript
// 1. Switch to custom database
use youtify_db

// 2. Initialize a dummy row to create the DB physically
db.init_collection.insertOne({ project: "Youtify Initialized" })

// 3. Grant access to your worker user
use admin
db.grantRolesToUser("rohitt", [{ role: "readWrite", db: "youtify_db" }, { role: "dbAdmin", db: "youtify_db" }])
```

---

## 🏃‍♂️ Running the Project Locally

```bash
# Development server start karein
npm run dev
```

Ab apne browser me `http://localhost:3000` par jaakar **Youtify** ka upyog karein.

---

## 📲 Progressive Web App (PWA) Deployment

1. Project ko GitHub par push karke **Vercel** par single click me deploy karein.
2. Apne smartphone (Android/iOS) ke browser me deploy kiya gaya unique URL open karein.
3. Browser settings me jaakar **"Add to Home Screen"** ya **"Install App"** par click karein.
4. Ab aap bina kisi browser URL bar ke direct app ki tarah offline storage features ke sath isse use kar sakte hain.

---

## ⚠️ Disclaimer

Yeh project poori tarah se **Personal Educational Purpose** aur streaming testing ke liye banaya gaya hai. YouTube ke Terms of Service ka samman karein aur iska upyog commercial distribution ke liye na karein.
