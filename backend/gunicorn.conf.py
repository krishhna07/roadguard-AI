import multiprocessing

# Gunicorn configuration for low-memory environments (Render Free Tier)

# Critical: Keep workers at 1 to avoid OOM kills (512MB RAM limit)
workers = 1

# Use threads to handle concurrent requests within the single worker
threads = 2

# Timeout for worker processes (default is 30s, bumping to 120s for video analysis)
timeout = 120

# Log level
loglevel = 'info'

# Bind address (Render sets PORT env var, but this is a fallback)
bind = "0.0.0.0:10000"
