import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai
from .config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

# Updated working model
EMBED_MODEL = "models/text-embedding-004"


def embed(sentence):
    response = genai.embed_content(model=EMBED_MODEL, content=sentence)
    return np.array(response["embedding"])


def compute_similarity(curriculum_data, standard_data):

    results = []

    for std_topic in standard_data["topics"]:
        std_vec = embed(std_topic)

        best_match = None
        best_score = -1

        for cur_topic in curriculum_data["topics"]:
            curr_vec = embed(cur_topic)
            score = cosine_similarity([std_vec], [curr_vec])[0][0]

            if score > best_score:
                best_score = score
                best_match = cur_topic

        status = ("Fully aligned" if best_score >= 0.80
                  else "Partial match" if best_score >= 0.60
                  else "Missing")

        results.append({
            "standard_topic": std_topic,
            "closest_curriculum_topic": best_match,
            "similarity": round(float(best_score), 2),
            "status": status
        })

    return results
