# 🧠 AI Coding Coach

## 🚀 Project Overview
**AI Coding Coach** is an intelligent, interactive platform designed to help developers master data structures and algorithms (DSA). Unlike standard coding platforms that only check for correctness, AI Coach acts as a **virtual mentor**, providing real-time feedback on time/space complexity, code cleanliness, and optimization strategies.

It leverages **Generative AI (GPT-4o)** to analyze code, detect patterns, suggest optimizations, and even visualize algorithms dynamically.

---

## 🌟 Key Features

### 1. 🤖 AI-Powered Analysis
- **Deep Code Critique**: Goes beyond syntax errors to analyze logic, edge cases, and best practices.
- **Complexity Analysis**: Automatically calculates Time (Big O) and Space complexity.
- **Pattern Recognition**: Identifies if the user applied the correct algorithmic pattern (e.g., Sliding Window, Two Pointers).

### 2. ⚡ Intelligent Optimization
- **Auto-Optimization**: Rewrites the user's code to be production-ready and efficient.
- **Approach Comparison**: detailed comparison between the "User's Approach" and the "Optimized Approach".

### 3. 📊 Dynamic Visualization
- **Mermaid.js Integration**: Automatically generates flowcharts to visualize the logic of the optimized solution.
- **Interactive Charts**:
  - **Skill Radar**: Visualizes proficiency across different topics (Arrays, DP, Trees).
  - **Topic Distribution**: Pie chart showing the diversity of practiced problems.
  - **Progress Tracker**: Line chart tracking performance ratings over time.

### 4. 🗺️ Personalized Roadmap
- **AI-Generated Path**: Creates a custom learning roadmap based on the user's recent performance and weak areas.
- **Milestone Tracking**: Visual timeline of current level and next goals.

### 5. 💬 Interactive Coach Chat
- **Ask the Coach**: A built-in chat interface allowing users to ask follow-up questions about their code or the AI's feedback.
- **Suggested Questions**: AI proactively suggests conceptual questions to test understanding.

### 6. 📚 Smart Resources
- **Context-Aware Learning**: Automatically fetches relevant YouTube tutorials and LeetCode problems based on the specific error or topic of the last submission.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (React, Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI (for premium, accessible components)
- **Charts**: Recharts (for data visualization)
- **Editor**: Monaco Editor (VS Code like experience)
- **Icons**: Lucide React

### Backend & AI
- **AI Runtime**: Vercel AI SDK
- **Model**: OpenAI GPT-4o
- **Database**: Supabase (PostgreSQL)
- **ORM/Query**: Supabase JS Client

### Infrastructure
- **Authentication**: Supabase Auth (ready for integration)
- **Deployment**: Vercel (recommended)

---

## 🏗️ System Architecture

1.  **User Interface**: Users write code in the `CodeEditor`.
2.  **API Layer**:
    - `/api/analyze`: Sends code to OpenAI with a specialized system prompt to extract structured data (critique, complexity, visualization).
    - `/api/chat`: Handles conversational context for the "Ask Coach" feature.
    - `/api/roadmap`: Generates personalized learning paths.
3.  **Data Layer**:
    - **Supabase**: Stores `submissions` (code, topic, difficulty) and `analyses` (ratings, feedback).
    - **Real-time Sync**: Dashboard components fetch data directly from Supabase to show live progress.

---

## 🔮 Future Scope
- **Multi-Language Execution**: Integrate a code execution engine (sandbox) to run code against test cases.
- **Gamification**: Add badges, streaks, and leaderboards to boost engagement.
- **IDE Extension**: Port the "Coach" features to a VS Code extension.
- **Mock Interviews**: AI-driven voice-based mock interview sessions.

---

## 🏁 Getting Started

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/tohin003/AI-Coach.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment**:
    - Create `.env.local` with `OPENAI_API_KEY` and `NEXT_PUBLIC_SUPABASE_URL/KEY`.
4.  **Run locally**:
    ```bash
    npm run dev
    ```
