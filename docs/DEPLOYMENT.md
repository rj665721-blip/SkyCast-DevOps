# SkyCast Deployment Guide

## 1. Overview

SkyCast is a Flask-based weather application deployed
on Render using GitHub integration.

## 2. Technologies

- Python
- Flask
- Git and GitHub
- GitHub Actions
- Pytest
- Gunicorn
- Render

## 3. CI/CD Workflow

Developer creates a feature branch.

Changes are committed and pushed to GitHub.

A Pull Request is created for code review.

GitHub Actions automatically performs:

1. Repository checkout
2. Python environment setup
3. Dependency installation
4. Python syntax validation
5. Automated Pytest execution

After successful checks and review,
the Pull Request is merged into main.

Render detects new commits on main and
automatically deploys the updated application.

## 4. Render Configuration

Service Type: Web Service

Language: Python

Deployment Branch: main

Build Command:

```bash
pip install -r requirements.txt
```

Start Command:

```bash
gunicorn app:app
```

## 5. Environment Variables

Required environment variable:

```text
OPENWEATHER_API_KEY
```

The API key is configured securely in the
Render Environment settings.

Never commit actual API keys to GitHub.

## 6. Local Testing

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Run automated tests:

```bash
python -m pytest -v
```

Run the application:

```bash
python app.py
```

## 7. Live Application

https://skycast-devops.onrender.com

## 8. Deployment Verification

Verify the following:

- GitHub Actions checks pass.
- Pull Request is reviewed.
- Code is merged into main.
- Render starts a new deployment.
- Deployment status becomes Live.
- Weather search works on the live website.

## 9. Conclusion

SkyCast demonstrates source code management,
automated testing, continuous integration,
and cloud deployment using beginner-friendly
DevOps tools.