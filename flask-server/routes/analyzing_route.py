from flask import request, jsonify
from models.db import SessionLocal
from models.model import CandidateProfile, JobDescription, Company
from controllers.text_extractor import extract_text_from_s3_url
from controllers.cv_summarization_agent import summarize_cv
from controllers.resume_matching_agent import match_jd_cv
from controllers.candidate_fit_summary_agent import candidate_fit_summary
from controllers.rejection_feedback_agent import generate_rejection_email, generate_rejection_email_lastphase
from controllers.selection_feedback_agent import generate_selection_email
from controllers.final_check_agent import final_check, final_check_score
 
def analyzing_candidate_route(app):
    @app.route('/candidate_screening', methods=['POST'])
    def shortlisting_candidate():
        """
        Candidate screening route triggered via email (POST request).
        This route:
        - Fetches candidate using email
        - Extracts and summarizes resume
        - Compares resume with JD
        - Makes final selection decision
        """

        # Get candidate email from form
        email = request.json.get("email")
        if not email:
            return jsonify({"error": "Email is required"}), 400

        db = SessionLocal()

        # Fetch candidate from DB
        candidate = db.query(CandidateProfile).filter_by(email=email).first()
        if not candidate:
            db.close()
            return jsonify({"error": "Candidate not found"}), 404

        # Fetch associated job and company details
        job_id = candidate.jobId
        job = db.query(JobDescription).filter_by(id=job_id).first()
        company = db.query(Company).filter_by(id=job.companyId).first()

        jd_text = job.jdSummary
        job_title = job.title
        threshold = job.threshold
        company_name = company.name
        candidate_name = f"{candidate.firstName} {candidate.lastName}"
        resume_url = candidate.resume

        # Step 1: Extract text from resume (S3 URL)
        cv_text = extract_text_from_s3_url(resume_url)

        # Step 2: Summarize CV using LLM agent
        cv_summary = summarize_cv(cv_text)

        # Step 3: Calculate matching score between JD and CV summary
        matching_score = match_jd_cv(jd_text, cv_summary)

        if matching_score >= threshold:
            # Step 4: Perform final LLM-based check and scoring
            final_check_result = final_check(cv_summary)
            final_score = final_check_score(cv_summary)

            if final_score >= 70:
                # Candidate is selected for interview
                fit_summary = candidate_fit_summary(company_name, jd_text, cv_summary, final_check_result)
                interview_email = generate_selection_email(company_name, candidate_name, job_title, fit_summary)

                candidate.status = "shortlisted"
                candidate.aiAnalysis = {
                    "cv_summary": cv_summary,
                    "matching_score": matching_score,
                    "final_score": final_score,
                    "final_check_result": final_check_result,
                    "candidate_fit_summary": fit_summary,
                    "ai_selection_email": interview_email.get("body", "")
                }
                candidate.aiMailResponse = interview_email
                db.add(candidate)
                db.commit()
                db.close()

                return jsonify({
                    "message": f"Candidate {candidate_name} added to the database with status 'shortlisted'.",
                    "status": "Shortlisted",
                    "score": matching_score,
                    "candidate_fit_summary": fit_summary
                })

            else:
                # Final score too low — reject in last phase
                rejection_email = generate_rejection_email_lastphase(company_name, candidate_name, final_check_result)

                candidate.status = "rejected"
                candidate.aiAnalysis = {
                    "cv_summary": cv_summary,
                    "matching_score": matching_score,
                    "final_score": final_score,
                    "final_check_result": final_check_result, 
                    "ai_rejection_email": rejection_email.get("body", "")
                }
                candidate.aiMailResponse = rejection_email
                db.add(candidate)
                db.commit()
                db.close()

                return jsonify({
                    "message": f"Candidate {candidate_name} added to the database with status 'rejected'.",
                    "status": "Rejected",
                    "score": matching_score,
                    "rejection_email": rejection_email
                })

        else:
            # Matching score is below threshold — direct rejection
            rejection_email = generate_rejection_email(company_name, candidate_name, jd_text, cv_summary)

            candidate.status = "rejected"
            candidate.aiAnalysis = {
                "cv_summary": cv_summary,
                "matching_score": matching_score,
                "ai_rejection_email": rejection_email.get("body", "")
            }
            candidate.aiMailResponse = rejection_email
            db.add(candidate)
            db.commit()
            db.close()

            return jsonify({
                "message": f"Candidate {candidate_name} added to the database with status 'rejected'.",
                "status": "Rejected",
                "score": matching_score,
                "rejection_email": rejection_email
            })
