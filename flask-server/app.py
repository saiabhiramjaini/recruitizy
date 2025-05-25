from flask import Flask
from flask_cors import CORS

from routes.jd_summarize_route import jd_summarize_route
from routes.analyzing_route import analyzing_candidate_route
from routes.resume_parsing_route import parse_resume_route

# Initialize Flask app and database
app = Flask(__name__)

# Initialize CORS
CORS(app, 
     resources={r"/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
 
# Register routes
## Route for summarizing JD
jd_summarize_route(app)

## Route for analyzing the candidate
analyzing_candidate_route(app)

## Route for parsing resumes
parse_resume_route(app)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    