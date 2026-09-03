<a href="http://localhost:3000">RentProof MyPrototype</a>
# RentProof 🏠

**Rental Property Condition Inspection & Evidence Comparison Platform**

RentProof is a professional web application built to help tenants, property managers, and landlords organize rental property condition evidence by systematically comparing move-in baseline photos with move-out exit photos.

---

## 🌟 Problem Solved

Security deposit disputes during lease exit often stem from disorganized, un-timestamped photo evidence or subjective interpretations of property damage vs normal wear and tear. 

RentProof solves this by providing:
1. **Organized Evidence Structure**: Pair move-in and move-out photos by room.
2. **Autonomous AI Inspection Agent**: Step-by-step feature extraction and differential comparison.
3. **Neutral Observation Standard**: Categorizes observable differences objectively without making legal claims or determining fault.
4. **Print & PDF Condition Reports**: Generates formal condition documents complete with image evidence grids.

---

## 🚀 Key Features

- **Dashboard Overview**: View active property inspections, rooms analyzed, observable changes, and quick stats.
- **Preloaded Demo Inspection**: Instant access to *"Sunrise Apartments - Flat 204"* with pre-rendered photographic evidence.
- **Room Management**: Default rooms (Living Room, Kitchen, Bedroom, Bathroom) + custom room adder (Balcony, Dining Room, Hallway, etc.).
- **Real Photo Uploader**: Client-side drag & drop photo upload supporting JPG, PNG, WEBP with canvas thumbnail compression.
- **AI Inspection Agent**: 8-step agentic visualizer showing real-time execution, progress bars, and a timestamped agent activity console.
- **Interactive Before/After Slider**: Interactive split-slider and side-by-side evidence comparison per room.
- **Neutral Findings Classification**: Classifies observations into `UNCHANGED`, `POSSIBLE CHANGE`, `NEEDS REVIEW`, or `INSUFFICIENT EVIDENCE`.
- **Print & PDF Reports**: Includes browser print stylesheet (`@media print`) for clean PDF downloads.
- **Offline Data Persistence**: IndexedDB storage ensures all images, rooms, and reports survive browser refresh without paid cloud databases.
- **Demo AI Mode & Pluggable AI Provider**: Pluggable architecture ready for OpenAI GPT-4 Vision or Gemini Vision APIs.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Storage**: Browser IndexedDB API (high-capacity local image storage)
- **Backend**: Node.js, Express, TypeScript, CORS
- **AI Abstraction**: `AIInspectionProvider` (`DemoAIProvider` & `RealVisionAIProvider`)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone & Setup Project
```bash
cd rentproof
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:3000`.

### 3. Backend Setup (Optional Node Proxy)
```bash
cd backend
npm install
npm run dev
```
The backend server will run on `http://localhost:5000`.

---

## 💡 Demo Mode vs Real AI Vision

RentProof works **immediately out of the box** in **Demo Mode** without requiring any paid API keys or cloud accounts.

### Configuring Real Cloud AI Vision (Optional)
To connect a real vision model later:
1. Create a `.env` file in the root using `.env.example`.
2. Add your vision model API key:
   ```env
   VITE_AI_API_KEY=your_openai_or_gemini_api_key
   ```
3. The `RealVisionAIProvider` will automatically switch from simulated analysis to live vision model analysis.

---

## ⚖️ Legal & Neutrality Standard

RentProof is an objective visual observation tool. The application explicitly:
- Does NOT make legal conclusions
- Does NOT determine tenant or landlord liability
- Does NOT claim deposit entitlement

All observations use standardized neutral phrasing (*"Observable difference"*, *"Possible change"*, *"Needs review"*, *"Insufficient evidence"*).

---

## 📄 Production Build

To build the frontend production bundle:
```bash
cd frontend
npm run build
```

To build the backend server:
```bash
cd backend
npm run build
```
