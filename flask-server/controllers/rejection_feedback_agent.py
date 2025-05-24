import google.generativeai as genai
from config import Config

# Configure Gemini API key
genai.configure(api_key=Config.GEMINI_API_KEY)


def generate_rejection_email(company_name, candidate_name, jd_summary, cv_summary):
    """
    Generate ONLY the rejection reasons in bullet points.
    Returns just why they were rejected, not full email content.
    """
    prompt = f"""
        A candidate named {candidate_name} has been rejected based on job requirements vs their qualifications.

        Job Description Summary:
        {jd_summary}

        Candidate Resume Summary:
        {cv_summary}

        Generate exactly 4-5 bullet points explaining why this candidate was rejected.

        Requirements:
        - Output exactly 4-5 bullet points
        - Be explainative where each point telling why the candidate was rejected
        - Each point should be a specific gap/mismatch between JD requirements and candidate qualifications
        - Use format: • [specific reason for rejection]
        - Keep each bullet point concise and clear
        - Focus on concrete skill gaps, experience mismatches, or missing qualifications

        Output only the bullet points, nothing else.
    """

    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
    }

    try:
        analysis_model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",
            generation_config=generation_config
        )
        response = analysis_model.generate_content(prompt)
        email_body = response.text.strip()

        # Now manually create the full email JSON with subject, greeting, and closing
        subject = f"Update on Your Application for {company_name}"
        greeting = f"Dear {candidate_name},"
        closing = f"Sincerely,\nHR Team at {company_name}"

        return {
            "subject": subject,
            "greeting": greeting,
            "body": email_body,
            "closing": closing
        }

    except Exception as e:
        return {"error": "Email generation failed", "details": str(e)}


    
    
def generate_rejection_email_lastphase(company_name, candidate_name, final_check_result):
    """
    Generate ONLY the rejection reasons in bullet points for final phase rejection.
    Returns just why they were rejected, not full email content.
    """
    prompt = f"""
        A candidate named {candidate_name} has been rejected in the final evaluation phase.

        Final Evaluation Summary:
        {final_check_result}

        Generate exactly 4-5 bullet points explaining why this candidate was rejected based on the final evaluation.

        Requirements:
        - Output exactly 4-5 bullet points
        - Be explainative where each point telling why the candidate was rejected
        - Each point should be a specific reason from the final evaluation summary
        - Use format: • [specific reason for rejection]
        - Keep each bullet point concise and clear
        - Focus on concrete issues identified in the final evaluation

        Output only the bullet points, nothing else.
    """

    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 8192,
    }

    try:
        analysis_model = genai.GenerativeModel(
            model_name="gemini-2.0-flash-exp",
            generation_config=generation_config
        )
        response = analysis_model.generate_content(prompt)
        email_body = response.text.strip()

        # Now manually create the full email JSON with subject, greeting, and closing
        subject = f"Update on Your Application for {company_name}"
        greeting = f"Dear {candidate_name},"
        closing = f"Sincerely,\nHR Team at {company_name}"

        return {
            "subject": subject,
            "greeting": greeting,
            "body": email_body,
            "closing": closing
        }

    except Exception as e:
        return {"error": "Email generation failed", "details": str(e)}