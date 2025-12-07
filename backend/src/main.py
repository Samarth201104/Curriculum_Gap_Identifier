import json
from src.extract import extract_text
from src.structure_ai import structure_content
from src.similarity_engine import compute_similarity
from src.recommendations import generate_recommendations
from src.report_generator import save_json_report
from src.pdf_report import generate_pdf_report
#from src.enhanced_pdf_report import enhanced_pdf_report
from src.styled_pdf_report import create_report



def run(curriculum_path, standards_path):

    print("📥 Extracting text...")
    curriculum_text = extract_text(curriculum_path)
    standards_text = extract_text(standards_path)

    print("🤖 Structuring content with Gemini...")
    structured_curriculum_raw = structure_content(curriculum_text, "results/structured_curriculum.json")
    structured_curriculum = json.loads(structured_curriculum_raw)

    structured_standards_raw = structure_content(standards_text, "results/structured_standards.json")
    structured_standards = json.loads(structured_standards_raw)


    print("📌 Running similarity & alignment...")
    mapping = compute_similarity(structured_curriculum, structured_standards)
    with open("results/mapping_results.json", "w") as f:
        json.dump(mapping, f, indent=2)

    print("🧠 Generating recommendations...")
    recommendations = generate_recommendations(mapping, structured_curriculum, structured_standards)

    print("📄 Saving final report...")
    save_json_report(mapping, recommendations, "results/final_report.json")

    print("📄 Generating PDF report...")
    create_report("results/final_report.json")

    print("📎 PDF exported to: results/final_report.pdf")


    print("\n🎉 DONE — Check the results/ folder.\n")


if __name__ == "__main__":
    run("data/curriculum.pdf", "data/standards.pdf")
