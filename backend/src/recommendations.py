import json
import google.generativeai as genai
from .config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"

def generate_recommendations(mapping_data, curriculum, standards):
    prompt = f"""
    You are an expert instructional designer and curriculum specialist. 
    Generate a DETAILED, STRUCTURED curriculum gap analysis report.
    
    CURRICULUM-TO-STANDARDS MAPPING DATA:
    {json.dumps(mapping_data, indent=2)[:2000]}  # Limit length to avoid token issues
    
    Generate a COMPREHENSIVE report with the following EXACT structure:
    
    ### OVERALL ANALYSIS & EXECUTIVE SUMMARY
    [Provide 2-3 paragraphs summarizing alignment quality, major gaps, and strategic recommendations]
    
    ### MISSING LEARNING GOALS ANALYSIS
    For EACH standard topic that needs improvement, analyze by Bloom's Taxonomy levels:
    
    1. **Topic: [Standard Topic Name]**
       - Status: [Fully aligned/Partial match/Missing]
       - Closest Curriculum Match: [Matched topic]
       - Similarity Score: [Score]
       - Bloom's Taxonomy Gaps:
         * Remember: [Missing knowledge/recall outcomes]
         * Understand: [Missing comprehension outcomes]
         * Apply: [Missing application outcomes]
         * Analyze: [Missing analysis outcomes]
         * Evaluate: [Missing evaluation outcomes]
         * Create: [Missing creation outcomes]
    
    ### SUGGESTED IMPROVEMENTS
    [Numbered list of 10-15 specific, actionable improvements]
    1. [Specific improvement action]
    2. [Specific improvement action]
    ...
    
    ### TOPIC SEQUENCING RECOMMENDATIONS
    [Logical module ordering with rationale]
    - Prerequisite chains and dependencies
    - Cognitive progression flow
    - Recommended sequence with timeline
    
    ### REDUNDANCY WARNINGS
    [Identify overlapping topics and suggest consolidation]
    - Topic: [Overlapping topic]
      - Locations: [Where it appears]
      - Consolidation Recommendation: [How to combine]
    
    ### IMPLEMENTATION ROADMAP
    [Phased implementation plan]
    - Phase 1 (Immediate): [Actions for first month]
    - Phase 2 (Short-term): [Actions for 1-3 months]
    - Phase 3 (Medium-term): [Actions for 3-6 months]
    
    IMPORTANT RULES:
    1. Use complete sentences and paragraphs
    2. Be specific and actionable
    3. Reference actual topics from the mapping data
    4. Include Bloom's Taxonomy analysis for each gap
    5. Do NOT use bullet points for the main analysis sections
    6. Make this comprehensive and professional
    """

    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)

    return response.text