from together import Together
from config import Config

def parse_resume(cv_text):
    """Parses the given Resume/CV text using the Llama-3.3-70B-Instruct-Turbo model."""
    
    prompt = f"""
        You are an intelligent parser. Extract all possible information from the given input and return a JSON object exactly matching the following schema. 

        If any field is missing or not found, set it to `null` for strings or empty lists `[]` for arrays. Do not include extra fields. Maintain the key names and structure strictly as shown. Format the output as valid, neatly indented JSON.

        Schema:
        {{
        "firstName": "",
        "lastName": "",
        "email": "",
        "phone": "",

        "experience": [
            {{
            "company": "",
            "position": "",
            "duration": "",
            "description": ""
            }}
        ],

        "education": [
            {{
            "institution": "",
            "degree": "",
            "fieldOfStudy": "",
            "year": ""
            }}
        ],

        "projects": [
            {{
            "title": "",
            "description": "",
            "techStack": [],
            "githubLink": "",
            "deployedLink": "",
            "timePeriod": ""
            }}
        ],

        "certifications": [],
        "achievements": [],

        "portfolio": "",
        "linkedIn": "",
        "github": "",

        "skills": []
        }}

        Return only the JSON. Do not include any explanation or comments. Do not add markdown formatting. If something is unclear or missing in the input, assume it is not present and return the appropriate null or empty value.

        Resume Text:
        {cv_text}
    """


    try:
        client = Together(api_key=Config.TOGETHER_AI_API_KEY)
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"