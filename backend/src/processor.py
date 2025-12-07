import sys, os
from extract import extract_text
from structure_ai import structure_content
from similarity_engine import compute_similarity
from recommendations import generate_recommendations
from styled_pdf_report import create_report
import json


def process(curriculum_path, standards_path):
    
    curriculum_text = extract_text(curriculum_path)
    standards_text = extract_text(standards_path)

    structured_curriculum = structure_content(curriculum_text)
    structured_standards = structure_content(standards_text)

    mapping = compute_similarity(structured_curriculum, structured_standards)
    recommendations = generate_recommendations(mapping, structured_curriculum, structured_standards)

    result_json_path = "results/final_report.json"
    with open(result_json_path, "w") as f:
        json.dump({"mapping_results": mapping, "recommendations": recommendations}, f, indent=2)

    create_report(result_json_path)

    print("DONE")


if __name__ == "__main__":
    process(sys.argv[1], sys.argv[2])
