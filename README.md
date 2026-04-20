<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
</div>

<h1 align="center">&#9889; EV-RIT Hub</h1>
<p align="center"><strong>Real-Time EV Intelligence & Infrastructure Analytics Platform</strong></p>

## 🚀 Overview
**EV-RIT** is a full-stack, dual-architecture Capstone project. It bridges a modern **Next.js 14 consumer-facing web application** with an elite, analytical **Python Streamlit Terminal** dedicated to Electric Vehicle (EV) infrastructure, battery machine learning diagnostics, embedded financial charting (TradingView), and real-time mapping of high-grade Level 2/Level 3 DC Fast Chargers.
<img width="1919" height="1079" alt="Screenshot 2026-04-20 192900" src="https://github.com/user-attachments/assets/8afbee08-8ef7-4255-913c-5278fdaf530a" />
<img width="1919" height="1078" alt="Screenshot 2026-04-20 192925" src="https://github.com/user-attachments/assets/f9cea771-4774-47ce-a2d4-4d3857da6b22" />
<img width="1919" height="1079" alt="Screenshot 2026-04-20 192956" src="https://github.com/user-attachments/assets/5462948d-34ef-48fb-8ef0-114cbf453039" />
<img width="1913" height="1079" alt="Screenshot 2026-04-20 193007" src="https://github.com/user-attachments/assets/0b8a7cfd-caf5-4606-96ec-50038f8b3f22" />
<img width="1919" height="1078" alt="Screenshot 2026-04-20 193026" src="https://github.com/user-attachments/assets/bab8902d-b16f-412b-aefc-986c6513a48f" />
<img width="1919" height="1079" alt="Screenshot 2026-04-20 193105" src="https://github.com/user-attachments/assets/e90340b6-28ec-44b2-9c15-f50851dbf23a" />
<img width="1917" height="1079" alt="Screenshot 2026-04-20 193146" src="https://github.com/user-attachments/assets/2e2423ed-0490-42ac-a940-d8735001cf72" />
<img width="1919" height="1078" alt="Screenshot 2026-04-20 193201" src="https://github.com/user-attachments/assets/c011b793-6f6c-4060-abcb-3dee95c399b0" />
<img width="1919" height="1079" alt="Screenshot 2026-04-20 193214" src="https://github.com/user-attachments/assets/8106e55b-07bc-4c88-b795-ef0f82a95eba" />


## 🏗️ Architecture & Features

This platform employs a tightly integrated dual-stack operational model:
- **Frontend (Web Layer):** Next.js 14 (App Router), Tailwind CSS, Framer Motion for highly polished UI/UX, e-commerce marketplace structures with Amazon API mocks, and NextAuth for secure authentication.
- **Backend (Intelligence Terminal):** Python-based Streamlit Application acting as an "OS-style" Terminal.
  - **Market Intelligence (`market_data.py`):** Live WebSocket financial data streaming of major EV/Battery ETFs (LIT, REMX, COPX, BATT) using TradingView advanced widget integratons.
  - **Precision Infrastructure Map (`map_ui.py`):** Interactive Folium map displaying high-accuracy GPS pins for EV charger networks across India with automated Google Maps deep-links.
  - **Battery ML (`battery_ml.py`):** Dedicated module serving data-science models predicting EV battery health and range diagnostics.
  - **Supabase Integration:** Real-time user telemetry and terminal access logging built on PostgreSQL.

## 🛠️ Quick Start (Local Development)

Both servers (Next.js & Streamlit) are wired to launch simultaneously via a single command using `concurrently`.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) 3.10+
- A configured `.env.local` containing your NextAuth strings and Supabase anon keys.

### 2. Setup
Clone the repo and install both Node and Python dependencies.
```bash
# Clone the repo
git clone https://github.com/your-username/ev-rit.git
cd ev-rit

# Install Frontend Dependencies
npm install

# Activate Python Virtual Environment (Windows PowerShell example)
python -m venv venv
./venv/Scripts/Activate.ps1

# Install Backend Dependencies
pip install -r requirements.txt
```

### 3. Run the Dual-Stack Server
Fire up both the Next.js Consumer Site & the Streamlit Terminal simultaneously:
```bash
npm run dev
```
- **Consumer Web App:** `http://localhost:3000`
- **Intelligence Terminal:** `http://localhost:8501`

---
*Developed as a Final Year Capstone Project.*
