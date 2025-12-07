from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import json
import os


def generate_pdf_report(json_path, output_pdf="results/final_report.pdf"):
    """Converts final_report.json into a readable PDF report."""

    if not os.path.exists(json_path):
        raise FileNotFoundError(f"JSON report not found: {json_path}")

    with open(json_path, "r") as f:
        data = json.load(f)

    c = canvas.Canvas(output_pdf, pagesize=A4)
    width, height = A4

    # Title
    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "Curriculum Alignment Report")

    y = height - 100
    line_spacing = 18

    def write_line(text, font="Helvetica", size=11, indent=0):
        nonlocal y
        if y < 60:
            c.showPage()
            y = height - 50

        c.setFont(font, size)
        c.drawString(50 + indent, y, text)
        y -= line_spacing

    write_line("📌 Covered Competencies:", "Helvetica-Bold", 14)
    for item in data.get("mapping_results", []):
        if item["status"] == "Fully aligned":
            write_line(f"✔ {item['standard_topic']} → {item['closest_curriculum_topic']}", indent=20)

    y -= 10
    write_line("❗ Missing Learning Goals:", "Helvetica-Bold", 14)
    for item in data.get("mapping_results", []):
        if item["status"] == "Missing":
            write_line(f"⚠ {item['standard_topic']}", indent=20)

    y -= 10
    write_line("⚙ Suggested Improvements:", "Helvetica-Bold", 14)

    suggestions = data.get("recommendations", "")
    if isinstance(suggestions, list):
        for s in suggestions:
            write_line(f"- {s}", indent=20)
    else:
        for line in suggestions.split("\n"):
            write_line(f"- {line}", indent=20)

    y -= 10
    write_line("🧭 Roadmap for Strengthening Curriculum:", "Helvetica-Bold", 14)
    write_line("Refer alignment summary and recommendations for ordering improvements.", indent=20)

    c.save()
    return output_pdf
