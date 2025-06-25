# Technical Requirements Document (TRD): Conversational QA Prototype (Voice-Based)

---

## 1. System Overview

This prototype demonstrates a **voice-to-voice conversational QA system** for operators who complete complex decision-based tasks (e.g., loan assessments). The operator completes a structured form guided by a Standard Operating Procedure (SOP), then engages in a real-time, spoken conversation with an AI agent. The AI reviews their inputs, evaluates alignment to SOP logic, and asks reflective questions—spoken aloud—to help uncover gaps in reasoning or flawed assumptions.

---

## 2. Core Components

### A. Frontend (Next.js)

| Component         | Description                                                    |
| ----------------- | -------------------------------------------------------------- |
| SOP Viewer        | Displays the SOP structure and logic reference                 |
| Input Form        | Operator inputs decisions and reasoning per step               |
| Voice QA Module   | Embedded recorder and audio playback (WebRTC or MediaRecorder) |
| QA Trigger Button | Activates the voice QA session                                 |
| QA Transcript UI  | Optional: shows real-time transcription and conversation log   |

---

### B. Backend (Node.js or Next.js API Routes)

| Endpoint          | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| `/api/runQA`      | Accepts SOP + operator input, manages STT ➝ LLM ➝ TTS pipeline              |
| `/api/transcribe` | Converts audio (WebM/WAV) to text using OpenAI Whisper / Deepgram / GCP STT |
| `/api/speak`      | Converts LLM reply to speech using ElevenLabs or OpenAI TTS                 |
| `/api/loopQA`     | Orchestrates multi-turn voice interactions                                  |

---

### C. Conversational AI Engine

| Layer                | Tooling                             | Role                                                 |
| -------------------- | ----------------------------------- | ---------------------------------------------------- |
| STT (Speech-to-Text) | OpenAI Whisper / Deepgram / GCP STT | Transcribes operator’s speech                        |
| LLM                  | OpenAI GPT-4 via API                | Generates QA coaching prompts based on SOP + inputs  |
| TTS (Text-to-Speech) | ElevenLabs / OpenAI TTS             | Converts AI questions back into speech               |
| Orchestrator         | LangGraph or stateful loop logic    | Maintains conversational state across multiple turns |

---

## 3. System Instructions (Prompt Design)

**System Prompt Template:**

```
You are a voice-based QA coach helping a colleague reflect on a recently completed task.

Your tone should be calm, curious, supportive, and professional—like a thoughtful peer debriefing a teammate.

You’ve been given:
- A standard operating procedure (SOP) detailing the ideal steps.
- The operator’s actual inputs, decisions, and reasoning.

Your goal:
- Ask 2–4 coaching questions that help the operator reflect.
- Identify any missing steps, flawed logic, or unclear assumptions.
- Encourage them to articulate their reasoning aloud.
- Compliment clarity, completeness, or smart decisions where appropriate.

Avoid: sounding judgmental, giving away answers, or quoting SOP line-by-line.

Instead, make it feel like a human conversation—natural, probing, and thought-provoking.
```

---

## 4. Conversational Flow: Voice QA Pipeline

1. **Trigger**
   Operator clicks "Start QA" ➝ frontend sends user input + SOP to `/api/runQA`.

2. **Step 1: LLM Prompt Composition**
   Backend composes prompt using:

   * SOP structure (in natural language summary)
   * Operator’s step-by-step inputs
   * Key decisions extracted
   * Any flagged deviations or logic gaps

3. **Step 2: First Turn**

   * GPT-4 generates 1–2 verbal coaching questions
   * Response converted to speech via ElevenLabs API
   * Played back to operator

4. **Step 3: User Response**

   * Operator replies via mic
   * STT converts to text
   * New transcript sent back to GPT-4 as next input

5. **Step 4: Follow-Up**

   * GPT-4 asks 1–2 follow-ups
   * After 2–3 exchanges, session ends or escalates to manual QA

6. **Session Transcript (Optional)**

   * Store STT, LLM, and TTS outputs for session review/reporting

---

## 5. Data Structures

### SOP (JSON Schema):

```json
{
  "processName": "Loan Approval",
  "steps": [
    {
      "id": "step1",
      "title": "Verify Income",
      "description": "Ensure applicant income exceeds threshold",
      "type": "decision"
    },
    {
      "id": "step2",
      "title": "Assess Credit Score",
      "description": "Check if score is above minimum and stable",
      "type": "judgment"
    },
    ...
  ]
}
```

### Operator Input Payload:

```json
{
  "step1": { "input": "Confirmed $95k/yr from payslip", "valid": true },
  "step2": { "input": "Score is 712, stable last 6 months", "valid": true },
  ...
}
```

---

## 6. Performance Requirements

| Metric                         | Target                    |
| ------------------------------ | ------------------------- |
| TTS latency                    | < 2s per response         |
| STT processing time            | < 3s for 15s audio        |
| LLM completion time            | < 5s per QA prompt        |
| Total turn-around per exchange | ≤ 7s (ideal), ≤ 10s (max) |
| QA session duration            | Max 3 turns (≈ 90s total) |

---

## 7. Security & Compliance

* Audio data processed transiently unless explicitly stored
* HTTPS enforced for all client/server calls
* Secure handling of API keys in `.env`
* Option to anonymize user transcript before LLM input

---

## 8. Development & Deployment

| Tool                   | Use                                   |
| ---------------------- | ------------------------------------- |
| Vercel                 | Frontend hosting (Next.js)            |
| Cloud Functions        | Voice processing API routes (Node.js) |
| Firebase/Supabase      | Optional session storage              |
| Whisper/ElevenLabs API | STT and TTS cloud services            |

---

## 9. Testing Plan

* ✅ STT accuracy vs human transcript
* ✅ LLM prompt validation (intent, tone, relevance)
* ✅ TTS playback realism and prosody
* ✅ Turn latency under demo conditions
* ✅ UX test: clarity of coaching, emotional response

---

## 10. Future Enhancements

* Add agent voice personas (e.g., warm coach, expert reviewer)
* Integrate real process logs for automated deviation detection
* Live stream QA into training dashboards
* Add repair suggestions or explanations to follow-up questions
* Enable dual-mode fallback (voice + text summary)

---

Let me know if you’d like a complementary diagram, LangGraph state machine sketch, or integration test plan next.
