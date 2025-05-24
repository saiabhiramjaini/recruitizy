from flask import request, jsonify

from controllers.text_extractor import extract_text_from_s3_url
from controllers.resume_parsing_agent import parse_resume

def parse_resume_route(app):
    @app.route('/parse_cv', methods=['POST'])
    def parse_route():
        """
        Endpoint to parse resume/cv.
        """

        data = request.get_json()

        cv = data.get("cv_file")

        if not cv:
            return jsonify({"error": "Please provide a document file."}), 400

        cv_text = extract_text_from_s3_url(cv)

        resume = parse_resume(cv_text)

        if not resume:
            return jsonify({"error": "Resume parsing failed"}), 500

        # Clean or strip the resume text
        if resume.startswith("```"):
            resume = resume.removeprefix("```").strip()
        if resume.endswith("```"):
            resume = resume.removesuffix("```").strip()
        
        return resume