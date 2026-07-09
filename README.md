# 🚀 Hirely

# Hirely --- AI-Powered ATS Resume Analyzer & Resume Comparison Platform

An end-to-end AI-powered web application that helps job seekers and recruiters optimize their resumes using **Google Gemini AI**. Hirely analyzes resumes against job descriptions, provides ATS compatibility scores, recruiter insights, skill-gap analysis, downloadable reports, and includes a powerful **Resume vs Resume Comparison** engine.


------------------------------------------------------------------------

# 🌐 Live Demo

### Frontend 
https://hirely-resume-analyzer.vercel.app/

### Backend API
https://smart-resume-analyzer-1n57.onrender.com

### GitHub Repository
https://github.com/ShriyanshPandey-702/Hirely

------------------------------------------------------------------------

## ✨ Features

### 🔐 Authentication

-   Clerk Authentication
-   Google Sign-in
-   GitHub Sign-in
-   Email Authentication
-   Protected Routes
-   Profile Management

### 🤖 AI Resume Analysis

-   PDF Resume Upload
-   Drag & Drop Support
-   Job Description Templates
-   Custom Job Description
-   ATS Match Score
-   Skill Matching
-   Missing Skills
-   Keyword Analysis
-   Candidate Strengths
-   Skill Gap Analysis
-   AI Reasoning
-   Recruiter Recommendations
-   Downloadable PDF Report

### 🆚 AI Resume Comparison

-   Resume A vs Resume B
-   Overall Winner
-   ATS Score Comparison
-   Radar Chart
-   Category Comparison
-   Keyword Comparison
-   Skills Comparison
-   Recruiter Opinion
-   AI Final Verdict
-   Improvement Suggestions
-   PDF Export
-   JSON Export

### 📊 Dashboard

-   Resume Analysis
-   Compare Page
-   Analysis History
-   Profile
-   Settings
-   Dark / Light Mode

------------------------------------------------------------------------

# 🛠 Tech Stack

## Frontend

-   React
-   Tailwind CSS
-   Axios
-   Chart.js
-   jsPDF
-   Lucide React

## Backend

-   Node.js
-   Express.js
-   Multer
-   pdf-parse
-   Google Gemini AI

## Database

-   MongoDB Atlas
-   Mongoose

## Authentication

-   Clerk

## Deployment

-   Vercel
-   Render

------------------------------------------------------------------------

# 📁 Folder Structure

``` text
Hirely
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── uploads
│   ├── utils
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   ├── dist
│   ├── .env
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md
```

------------------------------------------------------------------------

# ⚙️ Installation

``` bash
git clone <your-repository-url>
cd Hirely
```

### Backend

``` bash
cd backend
npm install
npm run dev
```

### Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

# 🔑 Environment Variables

Backend `.env`

``` env
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
CLERK_SECRET_KEY=your_clerk_secret
```

Frontend `.env`

``` env
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key
VITE_API_URL=http://localhost:5001
```

------------------------------------------------------------------------

# 🔄 Application Workflow

1.  Sign up / Sign in.
2.  Upload a PDF resume.
3.  Paste or select a job description.
4.  Resume text is extracted.
5.  Gemini AI analyzes the resume.
6.  ATS score is generated.
7.  Recruiter insights and recommendations are displayed.
8.  Export the report as PDF.
9.  History is saved for future access.

------------------------------------------------------------------------

# 🆚 Resume Comparison Workflow

1.  Upload Resume A.
2.  Upload Resume B.
3.  AI evaluates both resumes.
4.  Category-wise comparison is generated.
5.  Radar chart visualizes strengths.
6.  AI selects the stronger resume.
7.  Recruiter opinion and hiring recommendation are generated.
8.  Export comparison as PDF.

------------------------------------------------------------------------

# 📸 Screenshots

Add screenshots for:

-   Landing Page
-   Login
-   Sign Up
-   Dashboard
-   Resume Analysis
-   Analysis Result
-   Resume Comparison
-   Comparison Result
-   Radar Chart
-   Category Comparison
-   Keyword Analysis
-   Skills Comparison
-   Recruiter Opinion
-   Profile
-   Settings
-   Light Theme

------------------------------------------------------------------------

# 🚀 Future Roadmap

-   Resume Builder
-   Cover Letter Generator
-   LinkedIn Profile Analysis
-   Job Recommendation Engine
-   Recruiter Dashboard
-   Team Workspaces
-   Resume Ranking
-   Multi-language Support
-   AI Interview Preparation

------------------------------------------------------------------------

# 👨‍💻 Author

**Shriyansh Pandey**

-   GitHub: https://github.com/ShriyanshPandey-702
-   LinkedIn: https://www.linkedin.com/in/shriyansh-pandey-40673b348/

------------------------------------------------------------------------

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

------------------------------------------------------------------------

# 📄 License

This project is licensed under the MIT License.
