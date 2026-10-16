# 🌤️ SKYCAST — Weather Information Web Application

## Project Overview

SkyCast is a weather information web application
developed using Python Flask.

It provides real-time weather information for
different cities using the OpenWeatherMap API.

The project demonstrates DevOps practices such as
Git, GitHub, automated testing, CI/CD and deployment.

## Team Members

| Name | Role |
|------|------|
| Ritesh | Developer + CI/CD |
| Shashwat | Developer + Testing |
| Hirdeypal Singh | Developer + SCM |

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- OpenWeatherMap API
- Git and GitHub
- Pytest
- GitHub Actions
- Render

## Features

- Search weather by city name
- Real-time temperature
- Humidity and wind speed
- Weather conditions and icons
- Feels-like temperature
- Sunrise and sunset timings
- Weather-based advice
- Recent search history
- Dark and light mode
- Responsive design
- Error handling

## Installation

Clone the repository:

```bash
git clone https://github.com/rj665721-blip/SkyCast-DevOps.git
```

Open the project folder:

```bash
cd SkyCast-DevOps
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENWEATHER_API_KEY=your_api_key_here
```

Run the application:

```bash
python app.py
```

Open in browser:

http://127.0.0.1:5000

## Automated Testing

Run tests using:

```bash
python -m pytest -v
```

## CI/CD Pipeline

GitHub Actions automatically runs tests when
code is pushed or a Pull Request is created.

Pipeline:

Code Push → GitHub Actions → Install Dependencies
→ Pytest → Pass/Fail

## Deployment

Platform: Render

Build Command:

```bash
pip install -r requirements.txt
```

Start Command:

```bash
gunicorn app:app
```

## Project Status

Under Development