# Use Python 3.10 Slim image (Small & Fast)
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for OpenCV
RUN apt-get update && apt-get install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --no-cache-dir --upgrade pip

# Copy requirements file first (for caching)
COPY requirements.txt .

# 1. Install CPU-only PyTorch (Crucial to avoid 3GB+ GPU libs)
RUN pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# 2. Install remaining dependencies
# We use --no-deps for ultralytics to prevent it from reinstalling full PyTorch
RUN pip install --no-cache-dir -r requirements.txt

# 3. FIX: Ultralytics installs 'opencv-python' (GUI version) which overrides our pinned headless version.
# We must uninstall it to force usage of 'opencv-python-headless'
RUN pip uninstall -y opencv-python || true
# Re-ensure headless is there
RUN pip install opencv-python-headless==4.9.0.80

# Copy the rest of the application code
COPY . .

# Expose port (Railway controls this, but good practice)
EXPOSE 10000

# Start command
CMD ["gunicorn", "app:app", "-c", "gunicorn.conf.py"]
