# Use Python 3.11 to avoid ForwardRef issues
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY backend/requirements-render.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ /app/

# Set environment variables
ENV PYTHONPATH=/app
ENV PORT=8000

# Expose the port
EXPOSE $PORT

# Start the server (database initialization happens in FastAPI startup event)
CMD uvicorn main:app --host 0.0.0.0 --port $PORT 