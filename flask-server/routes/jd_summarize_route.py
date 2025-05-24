from flask import request, jsonify
from models.db import SessionLocal
from models.model import JobDescription
from models.model import JobDescription

from controllers.text_extractor import extract_text_from_s3_url
from controllers.jd_summarizing_agent import summarize_jd

def jd_summarize_route(app):
    @app.route('/jd_summarize', methods=['POST'])
    def jd_summarize():
        """
        Endpoint to summarize a job description.
        """

        data = request.get_json()

        jd = data.get("jd_file")

        if not jd:
            return jsonify({"error": "Please provide a document file."}), 400

        jd_text = extract_text_from_s3_url(jd)
        
        # Call the controller to summarize the JD
        summary = summarize_jd(jd_text)

        db = SessionLocal()
        data = db.query(JobDescription).filter_by(description=jd).first()

        if not data:
            return jsonify({"error": "Job description not found"}), 404
        
        # Update the job description with the summary
        data.jdSummary = summary
        db.add(data)
        db.commit()
        db.close()
        
        return jsonify({"summary": summary})