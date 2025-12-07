import json

def save_json_report(mapping, recommendations, output_path):
    final_report = {
        "mapping_results": mapping,
        "recommendations": recommendations
    }

    with open(output_path, "w") as f:
        json.dump(final_report, f, indent=2)

    return output_path
