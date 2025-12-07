import os
import uuid
import json
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sys
import threading
import time
from datetime import datetime

# Add src directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

# Import your existing modules
from src.extract import extract_text
from src.structure_ai import structure_content
from src.similarity_engine import compute_similarity
from src.recommendations import generate_recommendations
from src.styled_pdf_report import create_report
from src.config import GEMINI_API_KEY

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Configuration
UPLOAD_FOLDER = 'data'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['RESULTS_FOLDER'] = RESULTS_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

# Create folders if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Store active tasks
active_tasks = {}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_analysis_task(session_id, curriculum_path, standards_path):
    """Background task to process analysis using your existing logic"""
    try:
        active_tasks[session_id] = {
            "status": "processing",
            "progress": 10,
            "message": "Starting analysis..."
        }
        
        print(f"[{session_id}] 📥 Extracting text...")
        active_tasks[session_id]["progress"] = 20
        active_tasks[session_id]["message"] = "Extracting text from documents..."
        
        curriculum_text = extract_text(curriculum_path)
        standards_text = extract_text(standards_path)

        print(f"[{session_id}] 🤖 Structuring content with Gemini...")
        active_tasks[session_id]["progress"] = 40
        active_tasks[session_id]["message"] = "Analyzing content structure..."
        
        # Create structured files
        curriculum_json_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_curriculum.json")
        standards_json_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_standards.json")
        
        structured_curriculum_raw = structure_content(curriculum_text, curriculum_json_path)
        structured_curriculum = json.loads(structured_curriculum_raw)

        structured_standards_raw = structure_content(standards_text, standards_json_path)
        structured_standards = json.loads(structured_standards_raw)

        print(f"[{session_id}] 📌 Running similarity & alignment...")
        active_tasks[session_id]["progress"] = 60
        active_tasks[session_id]["message"] = "Computing similarity mapping..."
        
        mapping = compute_similarity(structured_curriculum, structured_standards)
        
        mapping_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_mapping.json")
        with open(mapping_path, "w") as f:
            json.dump(mapping, f, indent=2)

        print(f"[{session_id}] 🧠 Generating recommendations...")
        active_tasks[session_id]["progress"] = 80
        active_tasks[session_id]["message"] = "Generating recommendations..."
        
        # Get the FULL detailed recommendations from Gemini
        recommendations = generate_recommendations(mapping, structured_curriculum, structured_standards)

        # Format gaps with proper structure
        gaps_list = []
        for i, item in enumerate(mapping):
            if item["status"] == "Missing":
                # Determine severity based on similarity
                severity = "HIGH"
                if "similarity" in item:
                    if item["similarity"] < 0.3:
                        severity = "HIGH"
                    elif item["similarity"] < 0.6:
                        severity = "MEDIUM"
                    else:
                        severity = "LOW"
                
                gaps_list.append({
                    "id": i + 1,
                    "topic": item["standard_topic"],
                    "severity": severity,
                    "description": f"Missing coverage of '{item['standard_topic']}' in curriculum",
                    "recommendation": f"Add module on {item['standard_topic']} with appropriate learning outcomes"
                })
            elif item["status"] == "Partial match":
                gaps_list.append({
                    "id": i + 1,
                    "topic": item["standard_topic"],
                    "severity": "MEDIUM",
                    "description": f"Partial coverage of '{item['standard_topic']}' (similarity: {item['similarity']:.2f})",
                    "recommendation": f"Enhance existing content for {item['standard_topic']}"
                })

        # Calculate statistics
        total_topics = len(mapping)
        covered_topics = sum(1 for m in mapping if m['status'] != 'Missing')
        coverage_percentage = (covered_topics / total_topics * 100) if total_topics > 0 else 0

        # Create clean final report
        final_report = {
            "id": session_id,
            "mapping_results": mapping,
            "summary": {
                "coverage": f"{coverage_percentage:.1f}%",
                "topicsCovered": covered_topics,
                "totalTopics": total_topics,
                "gaps": len(gaps_list),
                "recommendations": 15,  # Standard number for frontend display
                "alignmentScore": round(coverage_percentage)
            },
            "gaps": gaps_list,
            "recommendations": recommendations,  # Send FULL detailed recommendations as string
            "strengths": [
                "Strong foundation in programming fundamentals",
                "Good balance of theory and practice",
                "Regular assessment and feedback mechanisms",
                "Structured learning progression"
            ],
            "timestamp": datetime.now().isoformat()
        }
        
        # Save JSON report
        json_report_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_report.json")
        with open(json_report_path, "w", encoding='utf-8') as f:
            json.dump(final_report, f, indent=2, ensure_ascii=False)
        
        # Generate PDF report
        pdf_report_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_report.pdf")
        create_report(json_report_path, pdf_report_path)

        active_tasks[session_id] = {
            "status": "completed",
            "progress": 100,
            "message": "Analysis completed successfully",
            "report_id": session_id,
            "report_paths": {
                "json": json_report_path,
                "pdf": pdf_report_path,
                "mapping": mapping_path
            }
        }
        
        print(f"[{session_id}] ✅ Analysis completed!")
        
    except Exception as e:
        print(f"[{session_id}] ❌ Error: {str(e)}")
        active_tasks[session_id] = {
            "status": "failed",
            "progress": 0,
            "message": f"Analysis failed: {str(e)}"
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "Curriculum Gap Identifier AI",
        "gemini_configured": bool(GEMINI_API_KEY)
    })

@app.route('/api/upload', methods=['POST'])
def upload_files():
    """Handle file uploads"""
    try:
        if 'curriculum' not in request.files or 'standards' not in request.files:
            return jsonify({"error": "Both curriculum and standards files are required"}), 400
        
        curriculum_file = request.files['curriculum']
        standards_file = request.files['standards']
        
        if curriculum_file.filename == '' or standards_file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if not (allowed_file(curriculum_file.filename) and allowed_file(standards_file.filename)):
            return jsonify({"error": f"Allowed file types: {', '.join(ALLOWED_EXTENSIONS)}"}), 400
        
        # Generate session ID
        session_id = str(uuid.uuid4())[:8]
        
        # Save files with session ID
        curriculum_filename = f"curriculum_{session_id}.pdf"
        standards_filename = f"standards_{session_id}.pdf"
        
        curriculum_path = os.path.join(app.config['UPLOAD_FOLDER'], curriculum_filename)
        standards_path = os.path.join(app.config['UPLOAD_FOLDER'], standards_filename)
        
        curriculum_file.save(curriculum_path)
        standards_file.save(standards_path)
        
        return jsonify({
            "message": "Files uploaded successfully",
            "session_id": session_id,
            "files": {
                "curriculum": curriculum_filename,
                "standards": standards_filename
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_analysis():
    """Start analysis process"""
    try:
        data = request.json
        session_id = data.get('session_id')
        curriculum_file = data.get('curriculum')
        standards_file = data.get('standards')
        
        if not all([session_id, curriculum_file, standards_file]):
            return jsonify({"error": "Missing required parameters"}), 400
        
        # Check if files exist
        curriculum_path = os.path.join(app.config['UPLOAD_FOLDER'], curriculum_file)
        standards_path = os.path.join(app.config['UPLOAD_FOLDER'], standards_file)
        
        if not os.path.exists(curriculum_path) or not os.path.exists(standards_path):
            return jsonify({"error": "Uploaded files not found"}), 404
        
        # Start processing in background thread
        thread = threading.Thread(
            target=process_analysis_task,
            args=(session_id, curriculum_path, standards_path)
        )
        thread.daemon = True
        thread.start()
        
        return jsonify({
            "message": "Analysis started",
            "session_id": session_id,
            "status": "processing",
            "estimated_time": "2-3 minutes"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/status/<session_id>', methods=['GET'])
def get_status(session_id):
    """Check analysis status"""
    if session_id not in active_tasks:
        return jsonify({"error": "Session not found"}), 404
    
    return jsonify(active_tasks[session_id])

@app.route('/api/reports/<session_id>', methods=['GET'])
def get_report(session_id):
    """Get report data"""
    try:
        report_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_report.json")
        
        if not os.path.exists(report_path):
            return jsonify({"error": "Report not found"}), 404
        
        with open(report_path, 'r', encoding='utf-8') as f:
            report_data = json.load(f)
        
        return jsonify(report_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/<session_id>/pdf', methods=['GET'])
def download_pdf(session_id):
    """Download PDF report"""
    try:
        pdf_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_report.pdf")
        
        if not os.path.exists(pdf_path):
            return jsonify({"error": "PDF report not found"}), 404
        
        return send_file(
            pdf_path,
            as_attachment=True,
            download_name=f"curriculum_report_{session_id}.pdf",
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/reports/<session_id>/json', methods=['GET'])
def download_json(session_id):
    """Download JSON report"""
    try:
        json_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_report.json")
        
        if not os.path.exists(json_path):
            return jsonify({"error": "JSON report not found"}), 404
        
        return send_file(
            json_path,
            as_attachment=True,
            download_name=f"curriculum_data_{session_id}.json",
            mimetype='application/json'
        )
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/results/<session_id>/mapping', methods=['GET'])
def get_mapping(session_id):
    """Get mapping data"""
    try:
        mapping_path = os.path.join(app.config['RESULTS_FOLDER'], f"{session_id}_mapping.json")
        
        if not os.path.exists(mapping_path):
            return jsonify({"error": "Mapping data not found"}), 404
        
        with open(mapping_path, 'r') as f:
            mapping_data = json.load(f)
        
        return jsonify(mapping_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Curriculum Gap Identifier API...")
    print(f"📁 Upload folder: {app.config['UPLOAD_FOLDER']}")
    print(f"📁 Results folder: {app.config['RESULTS_FOLDER']}")
    print(f"🔑 Gemini API: {'✅ Configured' if GEMINI_API_KEY else '❌ Not configured'}")
    print("🌐 Server running on http://localhost:5000")
    app.run(debug=True, port=5000)