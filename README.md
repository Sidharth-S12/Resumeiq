# ✦ ResumeIQ — AI-Powered Career Platform

> Your complete AI-powered career partner — from resume building to interview prep, all in one place. Built with React, Firebase & Groq AI.

---

## 🚀 Live Demo

> Coming soon — deploying on Vercel

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Resume Analyzer** | Upload your resume and get AI-powered score, job match %, strengths, missing skills and rewrite suggestions |
| 📝 **Resume Builder** | Build professional resumes with 4 beautiful templates (Classic, Modern, Minimal, Bold) and download as PDF |
| 🧠 **Mock Interview Test** | 10 AI-generated MCQ questions based on real interview topics with instant scoring |
| 🎙️ **Interview Q&A Practice** | Answer real interview questions and get AI feedback — score, model answer and pro tips |
| 🧭 **Career Path Generator** | Get a complete month-by-month career roadmap with courses, projects and tools |
| 🎯 **Skill Roadmap** | Personalized learning plan with verified free resources (YouTube, freeCodeCamp, Coursera) |
| 💬 **AI Career Assistant** | Floating chatbot for resume tips, career advice and skill suggestions |
| 📊 **Progress Dashboard** | Track resume scores over time, skill gaps and career progress with charts |
| 📧 **Email Results** | Get analysis and test results sent directly to your Gmail |
| 🔐 **Authentication** | Google Sign-in + Email/Password with email verification and forgot password |

---

## 🛠️ Tech Stack

```
Frontend    →  React 18 + Vite
Styling     →  CSS (custom, no frameworks)
AI Engine   →  Groq API (Llama 3.3 70B)
Auth        →  Firebase Authentication
Database    →  Firebase Firestore
Email       →  EmailJS
PDF         →  jsPDF + html2canvas
Routing     →  React Router DOM v6
Hosting     →  Vercel (coming soon)
```

---

## 📁 Project Structure

```
resumeiq/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Responsive navigation
│   │   ├── MobileMenu.jsx      # Mobile hamburger menu
│   │   ├── ChatBot.jsx         # Floating AI assistant
│   │   ├── SkillRoadmap.jsx    # Learning resources component
│   │   ├── ResumePreview.jsx   # Resume live preview
│   │   ├── ResumeTemplates.jsx # 4 resume templates
│   │   └── TestResult.jsx      # MCQ test results
│   ├── pages/
│   │   ├── Landing.jsx         # Public landing page
│   │   ├── Auth.jsx            # Sign in / Sign up
│   │   ├── Home.jsx            # Resume analyzer
│   │   ├── ResumeBuilder.jsx   # Resume builder
│   │   ├── MockTest.jsx        # MCQ interview test
│   │   ├── InterviewPractice.jsx # Q&A interview practice
│   │   ├── CareerPath.jsx      # Career roadmap generator
│   │   └── Dashboard.jsx       # User dashboard
│   ├── firebase.js             # Firebase configuration
│   ├── analyzeResume.js        # Groq AI resume analysis
│   ├── saveAnalysis.js         # Firestore operations
│   ├── sendEmail.js            # EmailJS integration
│   ├── pdfWorker.js            # PDF text extraction
│   ├── App.jsx                 # Root component + routing
│   ├── App.css                 # Global styles
│   └── index.css               # Base styles
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── index.html
└── vite.config.js
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone the repository
```bash
git clone https://github.com/Sidharth-S12/Resumeiq.git
cd Resumeiq
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:
```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Groq AI
VITE_GROQ_API_KEY=your_groq_api_key

# EmailJS
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Set up Firebase

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Google + Email/Password
3. Create **Firestore Database** (test mode)
4. Copy your config to `.env`

### 5. Get Groq API Key

1. Sign up at [console.groq.com](https://console.groq.com)
2. Create an API key
3. Add to `.env`

### 6. Set up EmailJS

1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Connect your Gmail service
3. Create an email template
4. Add Service ID, Template ID and Public Key to `.env`

### 7. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_GROQ_API_KEY` | Groq API Key for AI features |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS Template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Public Key |

---

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

---

## 🚀 Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables
5. Click Deploy!

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Built By

**Sidharth S** — Built with ❤️ using React, Firebase & Groq AI

---

<div align="center">
  <strong>⭐ Star this repo if you found it helpful!</strong>
</div>