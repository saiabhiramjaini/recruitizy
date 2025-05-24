import google.generativeai as genai
from config import Config

# Configure Gemini API key
genai.configure(api_key=Config.GEMINI_API_KEY)

def generate_selection_email(company_name, candidate_name, job_title, candidate_summary_fit):
    """
    Generate only the content explaining why the candidate was selected by AI screening.
    Returns just the selection reasons, not full email structure.
    """

    prompt = f"""
        A candidate named {candidate_name} has applied for the position of {job_title} and has been shortlisted through AI screening.

        Here is the candidate's fit summary:
        {candidate_summary_fit}

        Generate exactly 5 bullet points explaining why the AI shortlisted this candidate based on the fit summary.

        Requirements:
        - Output exactly 5 bullet points
        - Be explainative where each point telling why the candidate was selected
        - Each point should be a specific reason/qualification that matched the job requirements
        - Use format: • [specific reason/skill/experience]
        - Keep each bullet point concise and clear
        - Focus on concrete qualifications, not generic praise

        Output only the 5 bullet points, nothing else.
    """

    generation_config = {
        "temperature": 0.8,
        "top_p": 0.95,
        "top_k": 40,
        "max_output_tokens": 1024
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