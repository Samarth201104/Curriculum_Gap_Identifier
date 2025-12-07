<<<<<<< HEAD
# Curriculum Gap Identifier

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-blue)](https://flask.palletsprojects.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-green)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Overview

**Curriculum Gap Identifier** is an intelligent, AI-powered web application that analyzes educational curricula and compares them against academic standards to identify gaps and provide actionable recommendations. Using Google's Gemini AI, the application automatically structures, maps, and analyzes curriculum documents to ensure alignment with educational standards.

### Key Features

✨ **AI-Powered Analysis** - Leverage Gemini 2.5 Flash for intelligent curriculum mapping and gap detection  
📊 **Standards Alignment** - Ensure curriculum meets national and state academic standards automatically  
📈 **Detailed Insights** - Get comprehensive reports on coverage, gaps, and improvement recommendations  
📤 **Easy Upload** - Simple drag-and-drop interface for curriculum and standards documents  
📄 **PDF Reports** - Generate professional PDF reports with analysis results and visualizations

## 🏗️ Architecture

The application uses a modern full-stack architecture:

```
┌─────────────────────────────────────────────────────┐
│         Frontend (Next.js + React)                  │
│  - Drag & Drop File Upload                          │
│  - Real-time Processing Status                      │
│  - Interactive Results Dashboard                    │
│  - PDF Report Viewer                                │
└────────────────────┬────────────────────────────────┘
                     │ (API)
┌────────────────────▼────────────────────────────────┐
│         Backend (Flask + Python)                    │
│  - PDF/DOCX/TXT Extraction                          │
│  - Gemini AI Structuring & Analysis                 │
│  - Similarity Engine & Mapping                      │
│  - Recommendation Generation                       │
│  - PDF Report Generation                           │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (for frontend)
- **Python** 3.8+ (for backend)
- **Google Gemini API Key** (get it from [Google AI Studio](https://aistudio.google.com))
- **pip** (Python package manager)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/curriculum-gap-identifier.git
cd curriculum-gap-identifier
```

#### 2. Backend Setup

```bash
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_api_key_here > .env
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local file
echo NEXT_PUBLIC_API_URL=http://localhost:5000 > .env.local
```

### Running the Application

#### Start Backend Server

```bash
cd backend

# Activate virtual environment (if not already activated)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run the Flask server
python run.py
# Server runs on http://localhost:5000
```

#### Start Frontend Development Server

```bash
cd frontend

# Run the Next.js development server
npm run dev
# Application opens at http://localhost:3000
```

## 📖 Usage

1. **Upload Documents**
   - Navigate to the homepage at `http://localhost:3000`
   - Use the drag-and-drop interface to upload your curriculum document
   - Upload your academic standards document

2. **Supported Formats**
   - PDF (.pdf)
   - Word Documents (.docx)
   - Text Files (.txt)

3. **View Results**
   - Monitor real-time processing status
   - Review detailed analysis report
   - Download PDF report with recommendations

## 📁 Project Structure

```
curriculum-gap-identifier/
├── backend/                          # Flask backend application
│   ├── api.py                        # Flask app & API routes
│   ├── run.py                        # Application entry point
│   ├── requirements.txt              # Python dependencies
│   ├── data/                         # Upload folder for documents
│   ├── results/                      # Generated reports & analysis
│   └── src/                          # Core modules
│       ├── config.py                 # Configuration settings
│       ├── extract.py                # PDF/DOCX text extraction
│       ├── structure_ai.py           # Gemini AI structuring
│       ├── similarity_engine.py      # Curriculum-standards mapping
│       ├── recommendations.py        # Gap analysis & recommendations
│       ├── report_generator.py       # JSON report generation
│       ├── pdf_report.py             # Basic PDF report creation
│       └── styled_pdf_report.py      # Enhanced styled PDF reports
│
├── frontend/                         # Next.js React frontend
│   ├── package.json                  # Node dependencies
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS configuration
│   ├── jsconfig.json                 # JavaScript config
│   ├── public/                       # Static assets
│   │   ├── uploads/                  # Uploaded files storage
│   │   └── results/                  # Generated results storage
│   └── src/
│       ├── app/                      # Next.js app directory
│       │   ├── layout.jsx            # Root layout
│       │   ├── page.jsx              # Homepage
│       │   ├── globals.css           # Global styles
│       │   ├── api/                  # API route handlers
│       │   │   ├── process/          # Processing endpoint
│       │   │   └── upload/           # Upload endpoint
│       │   ├── analyze/              # Analysis page
│       │   └── results/              # Results page
│       ├── components/               # React components
│       │   ├── FileUpload.jsx        # File upload component
│       │   ├── Navbar.jsx            # Navigation bar
│       │   ├── Footer.jsx            # Footer component
│       │   ├── ResultCard.jsx        # Result display card
│       │   └── ResultViewer.jsx      # Result viewer
│       └── services/
│           └── api.js                # API service utilities
│
└── README.md                         # This file
```

## 🔧 Configuration

### Backend Configuration (.env)

Create a `.env` file in the `backend/` directory:

```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Flask Configuration (optional)
FLASK_ENV=development
FLASK_DEBUG=True

# Upload Settings (optional)
MAX_UPLOAD_SIZE=50MB
```

### Frontend Configuration (.env.local)

Create a `.env.local` file in the `frontend/` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 📦 Dependencies

### Backend

Key Python packages:
- **Flask** - Web framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **google-generativeai** - Google Gemini API client
- **pdfplumber** - PDF text extraction
- **python-docx** - DOCX file handling
- **pandas** - Data manipulation
- **matplotlib** - Data visualization
- **python-dotenv** - Environment variable management

See `backend/requirements.txt` for full list.

### Frontend

Key JavaScript packages:
- **Next.js** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Toastify** - Toast notifications
- **Lucide React** - Icon library

See `frontend/package.json` for full list.

## 🔌 API Endpoints

### Upload & Process

**POST** `/api/upload`
- Upload curriculum and standards documents
- Returns: Session ID and processing status

**POST** `/api/process`
- Process uploaded documents
- Returns: Analysis results and recommendations

**GET** `/api/results/<session_id>`
- Retrieve analysis results
- Returns: JSON report with mapping and recommendations

**GET** `/api/download/<session_id>`
- Download PDF report
- Returns: PDF file

## 🤖 How It Works

1. **Text Extraction** - Extracts text from PDF, DOCX, or TXT files
2. **AI Structuring** - Uses Gemini AI to structure content into topics, standards, and learning objectives
3. **Similarity Analysis** - Computes semantic similarity between curriculum and standards
4. **Mapping & Alignment** - Identifies which curriculum topics cover which standards
5. **Gap Detection** - Analyzes coverage and identifies missing standards
6. **Recommendations** - Generates actionable recommendations to fill gaps
7. **Report Generation** - Creates detailed JSON and PDF reports with visualizations

## 📊 Output

### JSON Report
Contains:
- Structured curriculum content
- Structured academic standards
- Curriculum-to-standards mapping
- Coverage statistics
- Gap analysis
- Recommendations for improvement

### PDF Report
Includes:
- Executive summary
- Coverage statistics charts
- Detailed mapping table
- Identified gaps
- Actionable recommendations
- References and citations

## 🔒 Security

- API keys stored in environment variables
- CORS configured for localhost development
- File upload size limits enforced
- Secure filename handling for uploaded files
- Input validation on all API endpoints

## 🐛 Troubleshooting

### Issue: "ModuleNotFoundError" in backend

**Solution:**
```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: Frontend can't connect to backend

**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Verify CORS is enabled in `backend/api.py`

### Issue: Gemini API not working

**Solution:**
- Verify `GEMINI_API_KEY` in `backend/.env`
- Check API key has Gemini API access enabled
- Ensure API key has appropriate quota

### Issue: PDF generation fails

**Solution:**
- Install required system fonts
- Check file permissions in `results/` directory
- Verify all dependencies: `pip install --upgrade -r requirements.txt`

## 📈 Performance Optimization

### Backend
- Uses caching for similar documents
- Implements async processing for large files
- Optimizes Gemini API calls with structured prompts

### Frontend
- Next.js Image optimization
- Lazy loading for result components
- Client-side caching with localStorage

## 🛣️ Roadmap

- [ ] Support for more file formats (Excel, Google Docs)
- [ ] Batch processing multiple curriculums
- [ ] Advanced filtering and search in results
- [ ] Curriculum comparison tool
- [ ] Export results in multiple formats
- [ ] User authentication and project management
- [ ] API documentation and Swagger UI
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Support

For support, email your-email@example.com or open an issue in the repository.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent content analysis
- Next.js for the fantastic React framework
- Flask for the lightweight Python web framework
- All contributors and users of this project

---

**Last Updated:** December 2025  
**Version:** 1.0.0

---

Made with ❤️ for better education


