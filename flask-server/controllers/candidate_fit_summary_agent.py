import google.generativeai as genai
from config import Config

# Configure Gemini API key
genai.configure(api_key=Config.GEMINI_API_KEY)

def candidate_fit_summary(company_name, job_title, cv_summary, final_check_result):
    """
    Generate a professional candidate fit summary explaining why the candidate is shortlisted for the role.
    Includes insights from the final_check analysis to strengthen reasoning.
    """
    prompt = f"""
        You are part of the recruitment team at {company_name}. A hiring manager is reviewing shortlisted candidates for the role of {job_title}.

        Based on the candidate’s resume summary and the final alignment analysis provided, write a short and professional paragraph (80–100 words) explaining why this candidate is a strong fit for the role.

        Resume Summary:
        \"\"\"
        {cv_summary}
        \"\"\"

        Final Alignment Insights (model-generated):
        \"\"\"
        {final_check_result}
        \"\"\"

        Your task:
        - Write a confident, HR-style explanation of why this candidate is suitable.
        - Emphasize achievements, skill match, relevant experience, and domain fit.
        - Do not repeat or list raw resume data.
        - Use the tone of an internal recruitment justification email.

        Only return the fit summary paragraph.
    """

    generation_config = {
        "temperature": 0.8,
        "top_p": 0.9,
        "top_k": 40,
        "max_output_tokens": 512,
    }

    try:
        analysis_model = genai.GenerativeModel(model_name="gemini-2.0-flash-exp", generation_config=generation_config)
        response = analysis_model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error generating summary: {str(e)}"
