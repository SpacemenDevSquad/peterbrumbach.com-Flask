# peterbrumbach.com

This is my personal portfolio site. I am **Peter Brumbach**, a Computer Science student at Grove City College. It collects games, graphics experiments and apps I've built in one place, and most of them can be tried right in the browser:

- **Unity games playable in the browser:** *Pointless Wars* (placed 3rd in the state Technology Student Association video game design competition), *Drop Thee Ball* (co-created with John Bauer) and a *Deal or No Deal* arcade fangame, embedded through a reusable WebGL player with click-to-load and fullscreen.
- **Graphics programming:** a raytracer and a raymarcher written from scratch in JavaScript that render in the browser.
- **iOS:** *Christmas Crash*, my first app, later remastered in SwiftUI and published on the App Store.

**Live site:** [peterbrumbach.dev](https://peterbrumbach.dev) · [GitHub](https://github.com/SpacemenDevSquad) · [LinkedIn](https://www.linkedin.com/in/peterbrumbach/)

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Python, [Flask](https://flask.palletsprojects.com/) (blueprints, Jinja templates and macros) |
| Frontend | [Bootstrap 5.3](https://getbootstrap.com/), semantic HTML, vanilla JavaScript (ES modules) |
| Server | [Gunicorn](https://gunicorn.org/) |
| Deployment | Docker and Docker Compose |

## Project structure

```
.
├── wsgi.py               # Flask app factory and entry point
├── gunicorn.conf.py      # Production server settings
├── routes/               # Blueprints: homepage, projects, documents, robots.txt / security.txt
├── templates/            # Jinja templates (base layout, pages, reusable partials)
│   └── partials/         # Unity WebGL player and "More projects" strip macros
├── assets/               # Static files served at /assets (CSS, JS, images, fonts, game builds)
│   └── json/             # projects.json (project list) and verses.json (footer verses)
├── public/               # robots.txt and .well-known/security.txt
├── Dockerfile
├── compose.yaml
└── .env.example          # Deployment settings; copy to .env
```

## Deployment

The site runs as a single Docker container that serves plain HTTP on a port you choose.

### Requirements

- A Linux server with [Docker Engine](https://docs.docker.com/engine/install/) and the Docker Compose plugin

### Steps

1. **Get the code** onto the server:

   ```bash
   git clone https://github.com/SpacemenDevSquad/peterbrumbach.com-Flask.git peterbrumbach.com
   cd peterbrumbach.com
   ```

2. **Create your settings file** and adjust it (see [Configuration](#configuration)):

   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Build and start the container:**

   ```bash
   docker compose up -d --build
   ```

4. **Check that it's running.** Within about 30 seconds the status should change from `starting` to `healthy`:

   ```bash
   docker compose ps
   curl -I http://localhost:8000/      # use your PORT if you changed it
   ```

5. **Route your domain to the site** by forwarding traffic for `peterbrumbach.com` and `www.peterbrumbach.com` to `http://<server IP>:<PORT>`.

### Updating

```bash
git pull
docker compose up -d --build
```

### Useful commands

| Task | Command |
|---|---|
| Follow the logs | `docker compose logs -f` |
| Restart | `docker compose restart` |
| Stop and remove | `docker compose down` |
| Rebuild from scratch | `docker compose build --no-cache && docker compose up -d` |

## Configuration

All settings live in `.env`, next to `compose.yaml`. Every setting is optional; the defaults below apply when it's missing.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8000` | Port on the host that the site is published on. The app inside the container always listens on `8000`. |
| `BIND_ADDRESS` | `0.0.0.0` | Host network interface to publish on. `0.0.0.0` accepts connections on every interface. `127.0.0.1` accepts only connections from the same machine. |
| `WEB_CONCURRENCY` | `2` | Number of Gunicorn worker processes. A common starting point is 2 × CPU cores. |
| `LOG_LEVEL` | `info` | Gunicorn log level: `debug`, `info`, `warning` or `error`. |

Example `.env`:

```dotenv
PORT=8080
BIND_ADDRESS=0.0.0.0
WEB_CONCURRENCY=2
LOG_LEVEL=info
```

### What `compose.yaml` sets

| Key | Purpose |
|---|---|
| `build: .` | Builds the image from the `Dockerfile` in this folder (Python 3.13 slim, Gunicorn, non-root user, built-in health check). |
| `restart: unless-stopped` | Starts the site again after a crash or server reboot. |
| `ports` | Publishes container port `8000` on `BIND_ADDRESS:PORT`. |
| `environment` | Passes the `.env` settings into the container. |
| `read_only` and `tmpfs` | The site never writes to disk, so the container filesystem is read-only, with a small in-memory `/tmp`. |
| `security_opt: no-new-privileges` and `cap_drop: ALL` | Removes Linux privileges the web server doesn't need. |

### Example `compose.yaml`

This is the `compose.yaml` included in the repository:

```yaml
services:
  web:
    build: .
    image: peterbrumbach-site:latest
    container_name: peterbrumbach-site
    restart: unless-stopped

    # Outside port is set in .env (default 8000); the app inside always uses 8000.
    ports:
      - "${BIND_ADDRESS:-0.0.0.0}:${PORT:-8000}:8000"

    environment:
      WEB_CONCURRENCY: ${WEB_CONCURRENCY:-2}
      LOG_LEVEL: ${LOG_LEVEL:-info}

    # Hardening: the site never writes to disk, so the container's filesystem is read-only
    read_only: true
    tmpfs:
      - /tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
```

## Local development

Requires Python 3.9 or newer.

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python wsgi.py
```

The site then runs at <http://127.0.0.1:5000> with automatic reloading.

## Security

To report a security issue, see [`/.well-known/security.txt`](https://peterbrumbach.com/.well-known/security.txt).

---

© Peter Brumbach. All rights reserved.
