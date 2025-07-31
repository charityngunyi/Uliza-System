# ULIZA Q&A Intelligence System
## Table of Contents
- [Features](#-features)
- [System Requirements](#-system-requirements)
- [Backend Setup](#-backend-setup)
- [Frontend Setup](#-frontend-setup)
- [Configuration](#-configuration)
- [Running the System](#-running-the-system)
- [API Documentation](#-api-documentation)
- [Troubleshooting](#-troubleshooting)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
## 🌟 Features
- Secure User Authentication with JWT tokens
- AI-Powered Answers using OpenAI/DeepSeek LLMs
- Query History tracking
- Responsive UI built with Next.js and TailwindCSS
- RESTful API with FastAPI backend
## 💻 System Requirements
- Python 3.9+
- Node.js 16+
- npm 8+
- OpenAI API key (or DeepSeek API key)
- Basic terminal knowledge
## 🔧 Backend Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Uliza-System.git
   cd Uliza-System/backend
2.Create and activate virtual environment:
# Linux/MacOS
python -m venv venv
source venv/bin/activate

# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1
3.Install Python dependencies:
pip install --upgrade pip
pip install -r requirements.txt
4.Set up environment variables:
Create a .env file in the backend directory with:
touch .env
Then add these required configurations:
# OpenAI API Key (required)
OPENAI_API_KEY=your_api_key_here

# Secret key (generate with: openssl rand -hex 32)
SECRET_KEY=your_generated_secret_key

# JWT Configuration
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database Settings
DATABASE_URL=sqlite+aiosqlite:///./sql_app.db

"
🖥 Frontend Setup
1. Navigate to frontend directory:
   cd ../frontend
2.Install Node.js dependencies:
npm install
