# 🪑 Blu Reserve - Seat Booking System

## Frontend Module Documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation Steps](#installation-steps)
4. [Project Structure](#project-structure)
5. [Running the Application](#running-the-application)
6. [Backend Integration Guide](#backend-integration-guide)
7. [Features Implemented](#features-implemented)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)
10. [Next Steps](#next-steps)

---

## 🎯 Project Overview

**Blu Reserve** is a seat booking web application with a manager-employee hierarchy system. Employees can book seats, and each booking deducts one token from their assigned manager's balance.

### Technology Stack
- **HTML5** - Structure
- **CSS3** - Styling (Custom CSS with modern design)
- **Vanilla JavaScript** - Interactivity & API integration
- **Backend** - Django + Django REST Framework (separate repository)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Visual Studio Code** (Latest version)
   - Download: https://code.visualstudio.com/

2. **Modern Web Browser**
   - Chrome (Recommended)
   - Firefox
   - Edge

3. **Python 3.8+** (for backend)
   ```bash
   python --version
   ```

4. **Django & Django REST Framework** (for backend)
   ```bash
   pip install django djangorestframework
   ```

### Recommended VS Code Extensions

Install these for better development experience:

```
1. Live Server (by Ritwick Dey)
2. HTML CSS Support
3. JavaScript (ES6) code snippets
4. Prettier - Code formatter
5. Path Intellisense
```

**How to install:**
- Press `Ctrl + Shift + X`
- Search for each extension
- Click "Install"

---

## 🚀 Installation Steps

### Step 1: Create Project Directory

```bash
# Open terminal in VS Code (Ctrl + `)
mkdir blu-reserve-frontend
cd blu-reserve-frontend
```

### Step 2: Create Folder Structure

```bash
# Create folders
mkdir css js

# Create files
touch index.html README.md
touch css/style.css
touch js/script.js
```

Your structure should look like this:

```
blu-reserve-frontend/
│
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── script.js
```

### Step 3: Copy Code Files

1. **index.html** - Copy the HTML artifact code
2. **css/style.css** - Copy the CSS artifact code
3. **js/script.js** - Copy the JavaScript artifact code

### Step 4: Verify Setup

Check all files are in place:

```bash
ls -R
```

Expected output:
```
.:
css  index.html  js  README.md

./css:
style.css

./js:
script.js
```

---

## 🎮 Running the Application

### Method 1: Using Live Server (Recommended)

1. Open `index.html` in VS Code
2. Right-click anywhere in the file
3. Select "Open with Live Server"
4. Browser will open automatically at `http://127.0.0.1:5500`

### Method 2: Direct Browser Open

1. Navigate to project folder
2. Double-click `index.html`
3. Opens in default browser

### Method 3: Python HTTP Server

```bash
# In project root directory
python -m http.server 8080

# Open browser to: http://localhost:8080
```

---

## 🔌 Backend Integration Guide

Currently, the frontend uses **MOCK DATA** for development. Follow these steps to connect to your Django backend:

### Step 1: Update API Configuration

Open `js/script.js` and find the `API_CONFIG` object (around line 10):

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000',  // ✅ Change this to your Django URL
    
    ENDPOINTS: {
        GET_SEATS: '/api/seats/',
        BOOK_SEAT: '/api/book-seat/',
        MANAGER_TOKENS: '/api/manager-tokens/',
    },
    
    getHeaders: () => {
        return {
            'Content-Type': 'application/json',
            // Uncomment below for JWT authentication:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
            
            // Uncomment below for Django CSRF:
            // 'X-CSRFToken': getCookie('csrftoken'),
        };
    }
};
```

### Step 2: Enable Real API Calls

Find and **UNCOMMENT** the following sections in `script.js`:

#### In `fetchSeats()` function (around line 95):
```javascript
// Uncomment this block:
const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_SEATS}`, {
    method: 'GET',
    headers: API_CONFIG.getHeaders()
});

if (!response.ok) {
    throw new Error('Failed to fetch seats');
}

const data = await response.json();
appState.seats = data;

// Comment out or remove MOCK_SEATS usage
```

#### In `fetchManagerTokens()` function (around line 130):
```javascript
// Uncomment this block:
const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MANAGER_TOKENS}${managerId}/`,
    {
        method: 'GET',
        headers: API_CONFIG.getHeaders()
    }
);

if (!response.ok) {
    throw new Error('Failed to fetch manager tokens');
}

const data = await response.json();
appState.managerTokens = data.tokens;
```

#### In `bookSeat()` function (around line 165):
```javascript
// Uncomment this block:
const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOOK_SEAT}`, {
    method: 'POST',
    headers: API_CONFIG.getHeaders(),
    body: JSON.stringify(requestBody)
});

const data = await response.json();

if (!response.ok || !data.success) {
    throw new Error(data.message || 'Booking failed');
}
```

### Step 3: Authentication Setup

#### For JWT Authentication:

1. Store token after login:
```javascript
localStorage.setItem('token', 'your-jwt-token');
```

2. Uncomment in `getHeaders()`:
```javascript
'Authorization': `Bearer ${localStorage.getItem('token')}`
```

#### For Django Session + CSRF:

1. Uncomment `getCookie()` function at the bottom of `script.js`
2. Uncomment in `getHeaders()`:
```javascript
'X-CSRFToken': getCookie('csrftoken')
```

### Step 4: CORS Configuration (Django Backend)

Ensure your Django backend allows frontend origin:

```python
# settings.py

INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

# Allow frontend origin
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5500",  # Live Server
    "http://127.0.0.1:5500",
    "http://localhost:8080",  # Python HTTP Server
]

# Or for development only:
CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ Not for production!
```

---

## 🎨 Features Implemented

### ✅ Core Features

- [x] Seat grid layout (BookMyShow style)
- [x] Color-coded seats (Available, Booked, Selected, My Booking)
- [x] Employee selection dropdown
- [x] Manager token display
- [x] Single seat selection at a time
- [x] Seat booking confirmation
- [x] Reset selection functionality
- [x] Responsive design (mobile-friendly)

### ✅ Extra Features

- [x] Hover tooltips showing seat status
- [x] Loading indicators during API calls
- [x] Toast notification system (success/error/info/warning)
- [x] Disabled state for booked seats
- [x] Confirmation dialog before booking
- [x] Real-time UI updates
- [x] Professional gradient design
- [x] Smooth animations and transitions

### ✅ Backend Integration

- [x] REST API ready with `fetch` API
- [x] JWT authentication support (commented)
- [x] Django CSRF token support (commented)
- [x] Error handling for all API calls
- [x] Mock data for development
- [x] Clear integration comments

---

## 📡 API Documentation

### 1. Get All Seats

**Endpoint:** `GET /api/seats/`

**Response:**
```json
[
  {
    "id": "A1",
    "row": "A",
    "number": 1,
    "status": "available",
    "booked_by": null
  },
  {
    "id": "A2",
    "row": "A",
    "number": 2,
    "status": "booked",
    "booked_by": "EMP102"
  }
]
```

### 2. Get Manager Tokens

**Endpoint:** `GET /api/manager-tokens/{manager_id}/`

**Example:** `GET /api/manager-tokens/MGR001/`

**Response:**
```json
{
  "manager_id": "MGR001",
  "manager_name": "Manager A",
  "tokens": 5
}
```

### 3. Book a Seat

**Endpoint:** `POST /api/book-seat/`

**Request Body:**
```json
{
  "seat_id": "A3",
  "employee_id": "EMP101"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Seat booked successfully",
  "seat": {
    "id": "A3",
    "row": "A",
    "number": 3,
    "status": "booked",
    "booked_by": "EMP101"
  },
  "remaining_tokens": 4
}
```

**Error Response (Insufficient Tokens):**
```json
{
  "success": false,
  "message": "Insufficient tokens. Manager has 0 tokens remaining."
}
```

**Error Response (Seat Already Booked):**
```json
{
  "success": false,
  "message": "Seat A3 is already booked."
}
```

---

## 🐛 Troubleshooting

### Issue 1: CORS Error

**Error:** `Access to fetch at 'http://localhost:8000/api/seats/' from origin 'http://localhost:5500' has been blocked by CORS policy`

**Solution:**
- Install django-cors-headers in backend
- Configure CORS_ALLOWED_ORIGINS in Django settings.py
- See [Backend Integration Guide](#backend-integration-guide)

### Issue 2: 404 Not Found

**Error:** `GET http://localhost:8000/api/seats/ 404 (Not Found)`

**Solution:**
- Verify Django server is running: `python manage.py runserver`
- Check API endpoint URLs match exactly
- Verify URL patterns in Django urls.py

### Issue 3: Styles Not Loading

**Symptoms:** Page looks unstyled

**Solution:**
- Check file paths in index.html:
  ```html
  <link rel="stylesheet" href="css/style.css">
  <script src="js/script.js"></script>
  ```
- Ensure folder structure matches exactly
- Clear browser cache (Ctrl + Shift + R)

### Issue 4: JavaScript Not Working

**Symptoms:** No interactivity, console errors

**Solution:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify script.js is loading (Network tab)
- Ensure JavaScript is enabled in browser

### Issue 5: Live Server Not Working

**Solution:**
- Reinstall "Live Server" extension
- Right-click index.html → "Open with Live Server"
- Check port 5500 is not in use
- Try restarting VS Code

---

## 🔄 Next Steps

### Phase 1: Testing ✅ (Current)
- [x] Test UI with mock data
- [x] Verify all interactions work
- [x] Check responsive design on mobile

### Phase 2: Backend Integration
- [ ] Connect to Django backend
- [ ] Test all API endpoints
- [ ] Implement authentication
- [ ] Handle all error cases

### Phase 3: Enhancements
- [ ] Add seat filtering/search
- [ ] Implement booking history
- [ ] Add admin panel features
- [ ] Real-time updates with WebSockets

### Phase 4: Production
- [ ] Environment configuration
- [ ] Production build optimization
- [ ] Security hardening
- [ ] Deployment

---

## 📝 Quick Reference

### Employee-Manager Mapping (Mock Data)
```
EMP101 → Manager A (MGR001) - 5 tokens
EMP102 → Manager A (MGR001) - 5 tokens
EMP103 → Manager B (MGR002) - 3 tokens
EMP104 → Manager B (MGR002) - 3 tokens
EMP105 → Manager C (MGR003) - 0 tokens
```

### Keyboard Shortcuts (VS Code)
```
Ctrl + `        : Open terminal
Ctrl + Shift + P : Command palette
Ctrl + B        : Toggle sidebar
F12             : Browser DevTools
Ctrl + S        : Save file
```

### File Locations
```
HTML  : index.html
CSS   : css/style.css
JS    : js/script.js
Config: js/script.js (API_CONFIG object)
```

---

## 📞 Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review browser console for errors (F12)
3. Verify backend is running properly
4. Check API endpoint configurations

---

## 📄 License

This project is part of the Blu Reserve system.

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Development (Mock Data Mode)

---

## 🎉 Happy Coding!

Your frontend is ready! Follow the backend integration steps when your Django API is ready.
