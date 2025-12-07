#!/usr/bin/env python3
"""
Start the Curriculum Gap Identifier API
"""

import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from api import app

if __name__ == '__main__':
    # Check for required environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ ERROR: GEMINI_API_KEY is not set in .env file")
        print("💡 Create a .env file with: GEMINI_API_KEY=your_key_here")
        sys.exit(1)
    
    print("=" * 50)
    print("🎓 Curriculum Gap Identifier API")
    print("=" * 50)
    print("📁 Data folder: data/")
    print("📁 Results folder: results/")
    print("🔑 Gemini API: ✅ Configured")
    print("🌐 Frontend URL: http://localhost:3000")
    print("🚀 Starting server on http://localhost:5000")
    print("=" * 50)
    
    app.run(debug=True, port=5000, use_reloader=True)