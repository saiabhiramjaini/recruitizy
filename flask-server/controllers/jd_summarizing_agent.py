from together import Together
from config import Config

# Configure Together API key
client = Together(api_key=Config.TOGETHER_AI_API_KEY)

def summarize_jd(jd_text):
    """Summarizes the given job description text using the Llama-3.3-70B-Instruct-Turbo model."""

    prompt = f"""You are a recruitment assistant. Your task is to read the job description and extract important details in a clean, readable format.

        Please extract and present the following information clearly with proper headings:

        1. **Role Title**  
        2. **Required Skills** (List the key skills)  
        3. **Experience Level** (e.g., 3+ years, Entry-level, Senior)  
        4. **Responsibilities** (List in bullet points)  
        5. **Preferred Qualifications** (Optional, only if mentioned)

        If any field isn’t explicitly mentioned in the description, leave it as an empty string or an empty list. Do not hallucinate or assume information.

        Job Description:
        {jd_text}
    """

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    
    except Exception as e:
        return f"Error: {str(e)}"