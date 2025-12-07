import json
import re
import google.generativeai as genai
from .config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-2.5-flash"


def extract_json(clean_text: str):
    """Extracts the first JSON block inside a response."""
    match = re.search(r'\{[\s\S]*\}', clean_text)
    if match:
        return match.group(0)
    else:
        raise ValueError("❌ Model did not return valid JSON.")


def structure_content(text: str, output_path: str):
    prompt = f"""
    You are an AI curriculum parser.

    Return ONLY valid JSON.
    No explanations, no markdown, no extra text.

    JSON Format:
    {{
      "subject": "",
      "topics": [],
      "subtopics": [],
      "competencies": [],
      "learning_outcomes": []
    }}

    Extract based on the following content:

    {text}
    """

    model = genai.GenerativeModel(MODEL_NAME)
    response = model.generate_content(prompt)

    raw = response.text.strip()

    # Clean markdown fences if present
    raw = raw.replace("```json", "").replace("```", "").strip()

    extracted_json = extract_json(raw)

    with open(output_path, "w") as f:
        f.write(extracted_json)

    return extracted_json
