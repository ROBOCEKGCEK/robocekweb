# ROBOCEK Main Portal 🌐🤖

Welcome to the official repository of **ROBOCEK (Robotics & Innovation Collective)** — the official robotics club of **Government College of Engineering, Kannur (GCEK)**. 

This repository houses the public-facing portal designed to highlight our projects, manage registration/login for students, showcase ongoing events, and provide resources for our community.

---

## 🎨 Preview & Aesthetics

The web portal is built with a premium, sleek aesthetic featuring:
* **Dynamic Design**: Clean dark/light mode configurations that respect system settings and feature micro-animations.
* **Responsive Layouts**: Fully responsive grid systems tailored for mobile, tablet, and desktop viewports.
* **Component Hub Showcase**: Deep links and booking integrations for the community components library.

---

## 🚀 Key Features

* **Club Showcase & Slide Gallery**: An interactive hero area featuring lab activity updates, photos, and core focus areas (Autonomy, Swarms, Edge AI, Embedded Control).
* **Project Hub**: An open-source portfolio showing student builds (such as STM32 line followers, SLAM Swarm platforms, Jetson Nano visual defect inspectors) complete with tags and GitHub links.
* **Events & Form Portal**: Integration for students to discover upcoming robotics workshops, register interest, and submit custom dynamic form fields.
* **ExeCom Directory**: A beautiful interface presenting the club’s executive committee, core managers, and media crew.
* **Authentication**: Seamless student login and profile creation, connected securely to Firestore.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
* **Styling**: Tailwind CSS for maximum responsiveness and high-fidelity custom themes
* **Backend Database & Security**: 
  * **Firebase Auth**: Student registration & session management
  * **Cloud Firestore**: Real-time storage of users, projects, events, and dynamic form metadata
  * **Firestore Rules**: Granular role-based security configurations

---

## 🗄️ Firestore Database Architecture

The backend operates on a serverless Firestore layout with the following root collections:

1. **`/users`**: Student profiles storing basic details (membership ID, name, batch, approved status, contact).
2. **`/projects`**: Showcased hardware and software developments containing GitHub repositories, descriptions, tags, and authors.
3. **`/events`**: Roster of events, category tags, schedules, whatsapp groups, fee details, and dynamic custom form parameters.
4. **`/custom_forms`**: Configurable standalone dynamic questionnaires used to capture tailored event answers.

---

## 💻 Getting Started & Setup

### Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or later recommended)
* [npm](https://www.npmjs.com/) or another package manager (yarn, pnpm)
* A Firebase account and project initialized.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/<your-username>/robocekweb.git
   cd robocekweb
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file at the root of the project by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
   ```

4. **Deploy Security Rules**
   Ensure your Firestore security rules are configured correctly. You can copy the rules defined in `firestore.rules` and upload them to the Firebase console under the **Rules** tab of your Firestore Database.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the portal!

6. **Production Build & Verification**
   Build the static and dynamic bundle:
   ```bash
   npm run build
   npm run start
   ```

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 👥 Authors & Credits

Developed by **Harikesh O P** and the **ROBOCEK Core Team**. Special thanks to Government College of Engineering, Kannur.
