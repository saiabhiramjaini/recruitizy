from together import Together
from config import Config
import re

# Configure Together API key
client = Together(api_key=Config.TOGETHER_AI_API_KEY)

def final_check(cv_text):
    """ Validates whether the candidate’s claimed skills are actually reflected in their resume.
    Uses Llama-3.3-70B-Instruct-Turbo model for reasoning and legitimacy check. """

    prompt = f"""You are an intelligent and critical HR screening assistant.

        A candidate has submitted their resume. Your task is to evaluate whether the skills they have listed in their "Skills" section are actually reflected or used meaningfully in their projects, work experience, education, or other resume content.

        ### Step-by-step Instructions:

        1. **Extract all claimed skills** listed in the "Skills" section or anywhere clearly stated as a list of skills.
        2. **For each skill**, verify if it has been:
        - **Applied in a project or work experience**
        - **Mentioned with relevant usage or context**
        - **Clearly demonstrated with a use-case, tool, or output**

        3. Create a **table** as output:
        - Columns: Skill | Mentioned in Resume? (Yes/No) | Where/How It Was Used (summary)
        
        4. Then calculate the **Skill Legitimacy Score** as:
        \\[ (Number of Skills Validated / Total Claimed Skills) × 100 \\]%
        
        5. Provide a final evaluation:
        - If score ≥ 70%, write: "**VALID**: The candidate has genuinely demonstrated most of the claimed skills."
        - If score < 70%, write: "**NOT VALID**: The candidate's claimed skills are mostly unsupported or unclear."

        ### Resume:
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

def final_check_score(cv_text):
    """
    Validates whether the candidate’s claimed skills are reflected in the resume.
    Returns only the Skill Legitimacy Score as an integer.
    """
    prompt = f"""You are an intelligent and critical HR screening assistant.

        A candidate has submitted their resume. Your task is to evaluate whether the skills they have listed in their "Skills" section are actually reflected or used meaningfully in their projects, work experience, education, or other resume content.

        ### Step-by-step Instructions:

        1. **Extract all claimed skills** listed in the "Skills" section or anywhere clearly stated as a list of skills.
        2. **For each skill**, verify if it has been:
        - **Applied in a project or work experience**
        - **Mentioned with relevant usage or context**
        - **Clearly demonstrated with a use-case, tool, or output**

        3. Then calculate the **Skill Legitimacy Score** as:
        \\[ (Number of Skills Validated / Total Claimed Skills) × 100 \\]%

        ### Resume:
        {cv_text}

        ### Output:
        - Only return the Skill Legitimacy Score as a percentage (e.g., 83%).
        - Do not include any other text or explanation.
        - Ensure the score is a simple number format (like 80%).
        - Avoid any additional comments or context.
    """

    try:
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        output_text = response.choices[0].message.content

        # Extract the first percentage number (e.g., 83%)
        match = re.search(r"(\d+)\s*%", output_text)
        if match:
            return int(match.group(1))
        else:
            return "Score not found in response."

    except Exception as e:
        return f"Error: {str(e)}"
