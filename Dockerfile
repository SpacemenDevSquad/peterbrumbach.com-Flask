FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install dependencies first so code changes don't re-run pip
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Run as an unprivileged user
RUN useradd --system --uid 10001 --no-create-home app
USER app

EXPOSE 8000

# The app only answers to its real domains (TRUSTED_HOSTS), so the check sends one as the Host
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import http.client,sys; c=http.client.HTTPConnection('127.0.0.1',8000,timeout=4); c.request('GET','/robots.txt',headers={'Host':'peterbrumbach.com'}); sys.exit(0 if c.getresponse().status==200 else 1)"

CMD ["gunicorn", "wsgi:app"]
