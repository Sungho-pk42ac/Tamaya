# Project Brief & PRD: Tamanya Medlife (건강냥 비서)

> 제품 설계·브랜드 문서. 요구사항 명세는 deep-interview spec(`.omc/specs/`, git-ignored)·consensus plan(`.omc/plans/`)을, 시스템 시각화는 `medlife-design.html`을 참고.

## 1. Product Overview
**Tamanya Medlife** is an AI-driven wellness and lifestyle coaching application specifically designed for young, single-person households in Korea. The service centers around a comforting companion mascot, **건강냥 (Geongang-nyang)**, who "wakes up" at night to help users process their day and establish healthy routines.

### Core Concept
- **"The Night-Waking Assistant"**: A unique cycle where the day is for light logging and the night is for deep reflection and coaching.
- **Companion-First**: Focuses on emotional stability and gentle behavioral nudges rather than clinical tracking.
- **Wellness, Not Medical**: Provides lifestyle coaching for sleep, meals, exercise, and medication without offering medical diagnoses.

---

## 2. Target Audience
- **Primary**: Single-person households (1인 가구) in their 20s and 30s.
- **User Needs**: Emotional companionship, routine management, mental health support, and gentle accountability for self-care.

---

## 3. Core Features & User Flows

### A. Onboarding & Personalization
- **Goal Setting**: Users select primary focus areas (e.g., sleep recovery, meal tracking, medication reminders).
- **Persona Tuning**: Users customize the AI's "voice" (Warm/Parental, Realistic/Relative, Light/Friendly, or Calm/Coach).

### B. Daily Cycle
- **Day Check-in**: Low-friction logging of status (sleep, meals, exercise, mood).
- **Night Chat Coaching**: An interactive session in "Night Mode" where the AI analyzes the day's logs and offers empathetic coaching.
- **Routine Suggestion**: The AI proposes "micro-routines" for the next day based on the previous night's conversation.

### C. Insights & Reporting
- **Weekly Wellness Report**: Visual summaries of mood trends, behavior patterns (e.g., "Meal irregularity: 3 times"), and encouraging notes from the mascot.

### D. Safety & Boundaries
- **Medical Safety Boundary**: Clear communication regarding the scope of service, explicitly stating it is not a medical diagnostic tool and providing emergency contact information (119).

---

## 4. Design Principles & Visual Identity

### Visual Language
- **Aesthetic**: Warm, "Korean Lifestyle" editorial style.
- **Texture**: Paper-textured backgrounds to evoke a personal journal feel.
- **Palette**: Earthy and cozy (Coffee Brown, Cream, Paper Beige, Espresso Night).
- **Typography**: Bold Korean headings paired with clean body text and handwritten-style notes.

### Key Components
- **Soft Cards**: Rounded corners (Round 8-12) with thin, dark "ink" borders.
- **Mascot Integration**: Constant presence of the hand-drawn cat mascot to maintain the companion experience.
- **Mode Switching**: Distinct visual transition between Light (Day) and Espresso (Night) modes.

---

## 5. Success Metrics
- **Retention**: Daily active users (DAU) engaging with the Night Chat.
- **Behavioral Change**: Number of user-confirmed "Micro-routines" completed.
- **User Sentiment**: Qualitative feedback on emotional comfort provided by the assistant.

---

## 6. Technical Considerations
- **Platform**: Mobile-first responsive design.
- **AI Engine**: Natural Language Processing for empathetic coaching and signal extraction from chat logs.
- **Privacy**: High-security data management for personal wellness records.
