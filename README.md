# URL Shortener App
A simple and elegant URL shortener built with Django for the backend and React (Vite + TailwindCSS) for the frontend.
You can shorten long URLs, copy the shortened link with one click, and quickly redirect to the original website.

## Project Structure

```
.
├── client/                   # Frontend (React + Vite + TailwindCSS)
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                   # Backend (Django)
│   ├── urlshortenerApp/      # Main application (views, models, urls)
│   ├── urlshortenerProject/  # Django project config
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## Features

- Shorten long URLs into compact links
- Copy shortened link to clipboard
- Redirect to original URL with one click
- Fully responsive design with TailwindCSS
- API built with Django REST Framework
  
## Tech Stack

### Frontend:
- React (Vite)
- TailwindCSS

### Backend:
- Django
- Django REST Framework

## Installation

### Clone the repository

```sh
git clone https://github.com/your-username/urlshortener.git
cd urlshortener
```

### Backend Setup (Django)

```sh
cd server
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at:
```
http://127.0.0.1:8000
```

### Frontend Setup (React + Vite + Tailwind)
```sh
cd ../client
npm install
npm run dev
```
The frontend runs at:
```
http://localhost:5173
```

### API Endpoints
POST /api/shorten/
Shorten a given URL.
Request body:
```json
{
  "original_url": "https://example.com/very/long/link"
}
```
Response:
```json
{
  "short_url": "http://127.0.0.1:8000/abc123"
}
```
GET /<short_code>/
Redirects to the original URL.