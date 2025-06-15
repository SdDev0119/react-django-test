# Django React Notes Application

A full-stack web application for managing personal notes, built with Django REST Framework backend and React frontend. Features JWT authentication, CRUD operations, and a modern responsive UI.

## 🚀 Features

### Backend (Django REST Framework)
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **User Management**: Registration and login functionality
- **Notes CRUD API**: Complete Create, Read, Update, Delete operations for notes
- **User Isolation**: Users can only access their own notes
- **RESTful Design**: Clean API endpoints following REST principles

### Frontend (React)
- **Modern React**: Built with React 18 and functional components with hooks
- **Responsive Design**: Beautiful, mobile-first UI with CSS Grid and Flexbox
- **Protected Routes**: Authentication-based route protection
- **State Management**: Zustand for efficient state management
- **Real-time Updates**: Optimistic UI updates for better user experience

### Note Features
- Create, edit, and delete personal notes
- Rich text content with line break preservation
- Automatic timestamps for note creation
- Preview truncation for long notes
- Search and filter capabilities (coming soon)

## 🛠 Technology Stack

### Backend
- **Django 5.1.4**: Python web framework
- **Django REST Framework**: API development
- **Simple JWT**: JWT authentication
- **SQLite**: Database (easily configurable for PostgreSQL/MySQL)
- **CORS Headers**: Cross-origin resource sharing

### Frontend
- **React 18.3**: Modern React with hooks
- **React Router 6**: Client-side routing
- **Axios**: HTTP client for API calls
- **Zustand**: Lightweight state management
- **Vite**: Fast build tool and development server
- **CSS3**: Modern styling with Grid and Flexbox

## 📋 Requirements

- **Python 3.9+**
- **Node.js 18+**
- **npm** or **yarn**
- **git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/aseedev/django-react-test.git
cd django-react-test
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Run database migrations:
```bash
python manage.py migrate
```

Create a superuser (optional):
```bash
python manage.py createsuperuser
```

Start the Django development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173/`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register a new user |
| POST | `/api/token/` | Login and obtain JWT tokens |
| POST | `/api/token/refresh/` | Refresh access token |

### Notes Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/api/notes/` | List all user's notes | Required |
| POST | `/api/notes/` | Create a new note | Required |
| GET | `/api/notes/{id}/` | Retrieve specific note | Required |
| PUT | `/api/notes/{id}/` | Update specific note | Required |
| DELETE | `/api/notes/{id}/` | Delete specific note | Required |

### Example API Usage

#### Register a new user:
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123", "password2": "testpass123"}'
```

#### Login:
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "testpass123"}'
```

#### Create a note:
```bash
curl -X POST http://localhost:8000/api/notes/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"title": "My First Note", "content": "This is the content of my note."}'
```

## 🏗 Project Structure

```
django-react-test/
├── backend/                    # Django backend
│   ├── api/                   # Main API app
│   │   ├── models.py         # Note model definition
│   │   ├── serializer.py     # DRF serializers
│   │   ├── views.py          # API views and viewsets
│   │   ├── urls.py           # API URL routing
│   │   └── migrations/       # Database migrations
│   ├── backend/              # Django project settings
│   │   ├── settings.py       # Django configuration
│   │   ├── urls.py           # Main URL routing
│   │   └── wsgi.py           # WSGI configuration
│   ├── requirements.txt      # Python dependencies
│   └── manage.py             # Django management script
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── views/            # Page components
│   │   │   ├── notes/        # Notes-related components
│   │   │   │   ├── NotesList.jsx
│   │   │   │   ├── NoteDetail.jsx
│   │   │   │   └── Notes.css
│   │   │   ├── home.jsx      # Home page
│   │   │   ├── login.jsx     # Login page
│   │   │   └── register.jsx  # Registration page
│   │   ├── layouts/          # Layout components
│   │   │   ├── MainWrapper.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── store/            # State management
│   │   │   └── auth.js       # Authentication store
│   │   ├── utils/            # Utility functions
│   │   │   ├── auth.js       # Authentication helpers
│   │   │   ├── axios.js      # Axios configuration
│   │   │   └── useAxios.js   # Custom axios hook
│   │   └── App.jsx           # Main app component
│   ├── package.json          # Node.js dependencies
│   └── vite.config.js        # Vite configuration
└── README.md                 # Project documentation
```

## 🔧 Configuration

### Backend Configuration

Key settings in `backend/settings.py`:

```python
# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=50),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}

# CORS Configuration
CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

### Frontend Configuration

API base URL in `frontend/src/utils/constants.js`:
```javascript
export const API_BASE_URL = 'http://localhost:8000/api/';
```

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Token Refresh**: Automatic token refresh for seamless user experience
- **User Isolation**: Users can only access their own notes
- **Password Validation**: Django's built-in password validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: Django ORM prevents SQL injection attacks

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Aesthetics**: Clean, professional interface with gradient backgrounds
- **Smooth Animations**: Hover effects and transitions for better user experience
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages and validation
- **Optimistic Updates**: Immediate UI updates for better perceived performance

## 🧪 Testing

### Backend Testing
```bash
cd backend
python manage.py test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Backend Deployment
1. Set `DEBUG = False` in settings.py
2. Configure allowed hosts
3. Set up a production database (PostgreSQL recommended)
4. Configure static files serving
5. Use a WSGI server like Gunicorn

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder using a web server like Nginx

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS settings allow your frontend domain
2. **Authentication Issues**: Check that JWT tokens are being sent in request headers
3. **Database Errors**: Run migrations if you encounter database-related errors
4. **Port Conflicts**: Change ports in configuration if default ports are occupied

### Getting Help

- Check the Django and React documentation
- Review the API endpoints using Django REST Framework's browsable API at `http://localhost:8000/api/`
- Enable debug mode for detailed error messages during development

## 🔄 Development Workflow

1. **Backend Changes**: 
   - Modify models → Create migrations → Apply migrations
   - Update serializers and views as needed
   - Test API endpoints using tools like Postman or curl

2. **Frontend Changes**:
   - Update components and state management
   - Test user interactions and API integration
   - Ensure responsive design across devices

3. **Full-Stack Testing**:
   - Test authentication flow
   - Verify CRUD operations work correctly
   - Check error handling and edge cases

---

**Happy Coding! 🎉**

For questions or support, please open an issue on the GitHub repository.