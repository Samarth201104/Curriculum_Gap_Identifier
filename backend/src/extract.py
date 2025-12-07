import pdfplumber
from docx import Document

def extract_pdf(path):
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            if page.extract_text():
                text += page.extract_text() + "\n"
    return text.strip()

def extract_docx(path):
    doc = Document(path)
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def extract_text(path):
    if path.endswith(".pdf"):
        return extract_pdf(path)
    elif path.endswith(".docx"):
        return extract_docx(path)
    elif path.endswith(".txt"):
        return open(path).read()
    else:
        raise ValueError(f"Unsupported file format: {path}")
