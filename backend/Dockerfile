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

# 2. Install dependencies from requirements.txt (includes opencv-python-headless)
RUN pip install --no-cache-dir -r requirements.txt

# 3. Install Ultralytics WITHOUT dependencies to prevent it from pulling in opencv-python (GUI)
# We have already installed its necessary deps (matplotlib, tqdm, etc.) in requirements.txt
RUN pip install --no-cache-dir "ultralytics>=8.0.0" --no-deps

# 4. Verify OpenCV installation immediately during build
RUN python -c "import cv2; print(f'OpenCV Version: {cv2.__version__}')"

# Copy the rest of the application code
COPY . .

# Expose port (Railway controls this, but good practice)
EXPOSE 10000

# Start command
CMD ["gunicorn", "app:app", "-c", "gunicorn.conf.py"]
