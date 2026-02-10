# AgentMAX: AI-Powered HR Interviewer

AgentMAX is a premium, real-time AI interviewing platform built using the **Gemini 2.0 Multimodal Live API**. It simulates a professional HR interview experience with a structured 10-question protocol and a high-fidelity futuristic interface.

![AgentMAX UI](https://img.shields.io/badge/UI-Google--Inspired--Sci--Fi-blue)
![Built With](https://img.shields.io/badge/Built%20With-Gemini%202.0-orange)
![License](https://img.shields.io/badge/License-Apache%202.0-green)

---

## 🚀 Key Features

### 📋 Structured 10-Question Protocol
* **Automated Flow**: Follows a strict HR protocol, evaluating candidates through 10 targeted questions.
* **Contextual Responses**: The agent maintains context throughout the session, adapting its follow-ups based on candidate answers.
* **Automated Conclusion**: Leveraging a custom `conclude_interview` tool, the agent automatically finalizes the session and transitions to a completion screen once the protocol is finished.

### 🎨 Futuristic "Google-Inspired" Interface
* **Light Mode Aesthetics**: A clean, professional palette using Google's signature blues and off-whites.
* **Sci-Fi UI Infrastructure**:
    * **Animated HUD**: Subtle vertical scanning lines and glowing UI frames around video feeds.
    * **Grid Workspace**: A dynamic, interactive background grid that enhances the technical feel.
    * **Audio Pulse Display**: Real-time visualization of the AI's voice with azure glows and pulsating animations.

### ⚙️ Seamless Interview Lifecycle
* **Interaction Shield**: A "Start Interview" overlay ensures browser audio permissions are granted before the AI initiates contact, preventing muted greetings.
* **Pause/Resume**: Efficiently pause the interview (muting mic/audio) without losing session state or resetting progress.
* **Clean Data Handling**: Automatically wipes conversation logs and session state upon stopping or completing an interview to ensure privacy and a fresh start for the next candidate.

---

## 🛠 Technical Stack

* **Core**: React, TypeScript
* **Intelligence**: Gemini 2.0 Multimodal Live API
* **Styling**: SCSS (Scoped components with modern CSS variables)
* **Real-time Engine**: WebSockets for multimodal streaming (Audio, Video, Tools)
* **Visuals**: Vega Lite for dynamic graph rendering in the console

---

## 🏁 Getting Started

### 1. Prerequisites
*   An API key from [Google AI Studio](https://aistudio.google.com/).
*   Node.js (v18+)

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
REACT_APP_GEMINI_API_KEY=your_api_key_here
```

### 3. Installation & Run
```bash
npm install
npm start
```

---

## 🏗 Deployment
This project is optimized for **Cloudflare Pages**. It includes strict ESLint compliance and optimized build scripts to ensure a smooth CI/CD pipeline.

```bash
npm run build
```

---

## 📜 License
Copyright 2024 Google LLC. Licensed under the Apache License, Version 2.0.
