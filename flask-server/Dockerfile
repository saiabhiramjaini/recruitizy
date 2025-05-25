# Use base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN pip install -r requirements.txt

# Run app
CMD ["python", "app.py"]