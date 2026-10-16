"""
Gunicorn settings (picked up automatically when gunicorn starts in this folder).
The container always listens on 8000; choose the outside port with PORT in .env.
"""
import os

bind = "0.0.0.0:8000"
workers = int(os.environ.get("WEB_CONCURRENCY", "2"))
worker_tmp_dir = "/dev/shm"   # keeps worker heartbeats in memory (works with a read-only container)
timeout = 30
graceful_timeout = 20

# Log requests and errors to the container's output (docker compose logs)
accesslog = "-"
errorlog = "-"
loglevel = os.environ.get("LOG_LEVEL", "info")
