import re
from together import Together
from config import Config

# Configure Together API key
client = Together(api_key=Config.TOGETHER_AI_API_KEY)

def match_jd_cv(jd_summary, cv_summary):
    prompt = f"""
        You are a recruitment evaluation assistant. Your task is to strictly compare a Job Description (JD) summary and a Candidate Resume (CV) summary. 

        You must only use the content explicitly present in both summaries. Do not infer or assume anything that is not directly stated.

        Here are the inputs:

        ### Job Description Summary:
        {jd_summary}

        ### Candidate Resume Summary:
        {cv_summary}

        Evaluate the following 3 key criteria **only**:

        1. **Skills Match**: Compare required skills in JD with those explicitly mentioned in the CV.
        2. **Experience Relevance**: Does the CV describe relevant experience for the role?
        3. **Responsibilities & Qualifications**: Are the candidate’s listed responsibilities and qualifications aligned with the JD?

        Identify any clear mismatches or gaps where relevant. Again, do not assume anything not clearly present.

        ### Scoring Instructions:

        - Assign a **Fit Score** out of 100%.
        - Be objective and base scoring strictly on overlap and alignment.
        - Do not fabricate or assume skills, experience, or qualifications.
        - Be conservative — if unsure, do not give credit.

        ### Output Format (strict):

        Only return the score as a single number followed by "%", nothing else.

        - Example: `76%`

        - Do NOT include any explanations, comments, labels, or formatting other than the score itself.
    """


    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    full_response = response.choices[0].message.content

    # Extract fit score using regex
    match = re.search(r"(\d+)\s*%", full_response, re.IGNORECASE)
    if match:
        return int(match.group(1))  # Return just the number as a string
    else:
        return "Fit score not found"
