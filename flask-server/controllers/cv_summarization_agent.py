from together import Together
from config import Config

# Configure Together API key
client = Together(api_key=Config.TOGETHER_AI_API_KEY)

def summarize_cv(cv_text):
    """Summarizes the given Resume/ CV text using the Llama-3.3-70B-Instruct-Turbo model."""

    prompt = f"""
        You are a resume extraction assistant. Your job is to extract structured details only from the content provided below.

        Follow these rules strictly:
        - Do NOT assume or infer any details that are not explicitly mentioned.
        - If a field is not clearly present, leave it empty (use empty string `""` or empty list `[]`).
        - Do NOT use external knowledge or make guesses.
        - Do NOT include any extra text, headers, or explanations in the output like "Here are the extracted details in a clean, readable format:", etc...

        Extract and return the following fields **only**:

        1. Candidate Name : Candidate's full name
        2. Email or Contact Info : Candidate's email address or phone number etc...
        3. Experience Level (e.g., "2+ years", "Fresher", "6 months", etc.) : Candidate's experience level
        4. Key Skills (List of technical or domain skills mentioned) : Candidate's key skills
        5. Projects (List of projects or work experience mentioned) : Deatily mention everything related to the Candidate's projects or work experience as it is from the resume which include tech they used what they did neatly without leaving minor details helping in the selection process
        6. Qualifications (e.g., degrees, certifications, etc.) :  Candidate's qualifications
        7. Other Notable Information (optional — only if explicitly mentioned, such as projects, achievements)

        Resume Text:
        {cv_text}
    """

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    except Exception as e:
        return f"Error: {str(e)}"