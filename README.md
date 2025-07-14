# 🚀 Fund Me - Crowdfunding Platform

A modern, full-stack crowdfunding platform built with Django REST Framework and React. This application allows users to create campaigns, make donations, and track funding progress in real-time.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **User Authentication & Authorization**: JWT-based authentication with custom user model
- **Campaign Management**: Create, edit, and manage crowdfunding campaigns
- **Donation System**: Secure donation processing with anonymous options
- **Real-time Progress Tracking**: Live updates on campaign funding progress
- **Responsive Design**: Modern UI with dark/light theme support
- **Social Authentication**: OAuth integration with Google and other providers

### User Features
- User registration and login
- Profile management
- Campaign creation and editing
- Donation history
- Campaign browsing and search
- Real-time notifications

### Admin Features
- User management
- Campaign moderation
- Donation tracking
- Analytics dashboard

## 🛠️ Tech Stack

### Backend (Django)
- **Framework**: Django 5.2.4
- **API**: Django REST Framework 3.16.0
- **Authentication**: JWT (djangorestframework-simplejwt 5.5.0)
- **User Management**: Djoser 2.3.1
- **Social Auth**: social-auth-app-django 5.5.1
- **Database**: PostgreSQL (psycopg2-binary 2.9.10)
- **CORS**: django-cors-headers 4.7.0
- **Environment**: python-dotenv 1.1.1

### Frontend (React)
- **Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.0
- **Routing**: React Router DOM 7.6.3
- **State Management**: Redux Toolkit 2.8.2
- **UI Framework**: Bootstrap 5.3.7 + React Bootstrap 2.10.10
- **HTTP Client**: Axios 1.10.0
- **Form Handling**: Formik 2.4.6 + Yup 1.6.1
- **Date Handling**: Day.js 1.11.13
- **Material UI**: @mui/material 7.2.0

### Development Tools
- **Linting**: ESLint 9.29.0
- **Package Manager**: npm
- **Version Control**: Git

## 📁 Project Structure

```
Django-React/
├── backend/                 # Django backend application
│   ├── app/                # Custom user app
│   │   ├── models.py       # Custom User model
│   │   ├── serializers.py  # User serializers
│   │   ├── views.py        # User views
│   │   └── urls.py         # User URLs
│   ├── project/            # Campaign and donation app
│   │   ├── models.py       # Campaign and Donation models
│   │   ├── serializers.py  # Project serializers
│   │   ├── views.py        # Project views
│   │   ├── permissions.py  # Custom permissions
│   │   └── urls.py         # Project URLs
│   ├── core/               # Django project settings
│   │   ├── settings.py     # Django settings
│   │   ├── urls.py         # Main URL configuration
│   │   └── wsgi.py         # WSGI configuration
│   ├── manage.py           # Django management script
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── Layout.jsx  # Main layout component
│   │   │   └── Navbar.jsx  # Navigation component
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx    # Home page
│   │   │   ├── Login.jsx   # Login page
│   │   │   ├── Register.jsx # Registration page
│   │   │   ├── CreateProject.jsx # Campaign creation
│   │   │   ├── EditProject.jsx   # Campaign editing
│   │   │   └── MyProjects.jsx    # User's projects
│   │   ├── context/        # React context providers
│   │   │   └── ThemeContext.jsx  # Theme management
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Application entry point
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   └── index.html          # HTML template
├── venv/                   # Python virtual environment
└── README.md              # Project documentation
```

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 16+**
- **npm** (comes with Node.js)
- **PostgreSQL** (for production) or **SQLite** (for development)
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Django-React
```

### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Database Setup

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/fundme_db

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Social Authentication (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the Django Backend**:
   ```bash
   cd backend
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000`

2. **Start the React Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

### Production Mode

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Configure Django for Production**:
   - Set `DEBUG=False`
   - Configure static files
   - Set up a production database
   - Use a production WSGI server (Gunicorn)

## 📚 API Documentation

### Authentication Endpoints

- `POST /auth/users/` - User registration
- `POST /auth/jwt/create/` - Login (get JWT tokens)
- `POST /auth/jwt/refresh/` - Refresh JWT token
- `POST /auth/jwt/verify/` - Verify JWT token
- `GET /auth/users/me/` - Get current user profile

### Campaign Endpoints

- `GET /api/campaigns/` - List all campaigns
- `POST /api/campaigns/` - Create a new campaign
- `GET /api/campaigns/{id}/` - Get campaign details
- `PUT /api/campaigns/{id}/` - Update campaign
- `DELETE /api/campaigns/{id}/` - Delete campaign

### Donation Endpoints

- `GET /api/campaigns/{id}/donations/` - Get campaign donations
- `POST /api/campaigns/{id}/donations/` - Make a donation
- `GET /api/users/me/donations/` - Get user's donation history

## 🗄️ Database Schema

### User Model
- `username` - Unique username
- `email` - Unique email address
- `phone` - Egyptian phone number (10 digits starting with 01)
- `password` - Hashed password
- `date_joined` - Account creation date

### Campaign Model
- `owner` - Foreign key to User
- `title` - Campaign title
- `description` - Campaign description
- `target_amount` - Funding goal
- `start_date` - Campaign start date
- `end_date` - Campaign end date
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Donation Model
- `campaign` - Foreign key to Campaign
- `donor` - Foreign key to User (nullable for anonymous)
- `amount` - Donation amount
- `donation_date` - Donation timestamp
- `message` - Optional donor message

## 🛠️ Development

### Code Style

- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **React**: Use functional components with hooks

### Testing

```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests (if configured)
cd frontend
npm test
```

### Database Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

## 🚀 Deployment

### Backend Deployment (Django)

1. **Set up a production server** (e.g., Ubuntu with Nginx)
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   pip install gunicorn
   ```

3. **Configure environment variables**
4. **Set up PostgreSQL database**
5. **Configure Nginx as reverse proxy**
6. **Use Gunicorn as WSGI server**

### Frontend Deployment (React)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to a static hosting service**:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - GitHub Pages

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]
```

## 🙏 Acknowledgments

- Django REST Framework for the robust API framework
- React team for the amazing frontend library
- Bootstrap for the responsive UI components
- All contributors and supporters


**Made with ❤️ by the Crowd Spark Team** 