# Authentication & User Management API

## Overview

Handles user registration, login, role-based access control, and session management for the PricePulse platform.

## Database Tables Used

- `Users`
- `Roles`
- `UserRoleMapping`
- `UserNotificationSettings`

## API Endpoints

### 1. User Registration

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "confirm_password": "securePassword123"
}
```

**Response:**

```json
{
  "user_id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "message": "User registered successfully"
}
```

**Implementation Notes:**

- Hash password using bcrypt
- Validate email format and uniqueness
- Set default role as 'User'
- Create default notification settings
- Send welcome email

### 2. User Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 604800,
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "roles": ["User"],
    "is_active": true
  }
}
```

**Implementation Notes:**

- JWT token expires in 7 days
- Include user roles in token payload
- Log login activity in UserActivityLog

### 3. Google OAuth Login

```http
POST /api/auth/google
```

**Request Body:**

```json
{
  "google_token": "google_oauth_token_here"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 604800,
  "user": {
    "user_id": 1,
    "email": "user@gmail.com",
    "full_name": "John Doe",
    "roles": ["User"],
    "is_active": true
  }
}
```

**Implementation Notes:**

- Verify Google token with Google API
- Create user if doesn't exist
- Link existing account if email matches

### 4. Token Refresh

```http
POST /api/auth/refresh
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "access_token": "new_jwt_token_here",
  "token_type": "bearer",
  "expires_in": 604800
}
```

### 5. User Profile

```http
GET /api/auth/profile
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "user_id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "roles": ["User"],
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "notification_settings": {
    "notify_on_price_drop": true,
    "notify_on_anomaly": false,
    "price_drop_threshold_percent": 10,
    "receive_weekly_report": true,
    "weekly_report_day": "SUNDAY"
  }
}
```

### 6. Update Profile

```http
PUT /api/auth/profile
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "full_name": "John Smith",
  "notification_settings": {
    "notify_on_price_drop": true,
    "notify_on_anomaly": true,
    "price_drop_threshold_percent": 15,
    "receive_weekly_report": false
  }
}
```

**Response:**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Smith",
    "roles": ["User"],
    "is_active": true
  }
}
```

### 7. Change Password

```http
POST /api/auth/change-password
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "current_password": "oldPassword123",
  "new_password": "newPassword456",
  "confirm_password": "newPassword456"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

### 8. Logout

```http
POST /api/auth/logout
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

**Implementation Notes:**

- Add token to blacklist/revocation list
- Log logout activity

## Security Implementation

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Special characters recommended

### JWT Token Structure

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "roles": ["User"],
  "exp": 1640995200,
  "iat": 1640390400
}
```

### Rate Limiting

- Login attempts: 5 per minute per IP
- Registration: 3 per hour per IP
- Password reset: 2 per hour per email

## Database Queries

### User Registration

```sql
-- Insert new user
INSERT INTO Users (email, password_hash, full_name, is_active)
VALUES (?, ?, ?, 1);

-- Assign default role
INSERT INTO UserRoleMapping (user_id, role_id)
SELECT ?, role_id FROM Roles WHERE role_name = 'User';

-- Create notification settings
INSERT INTO UserNotificationSettings (user_id)
VALUES (?);
```

### User Login

```sql
-- Get user with roles
SELECT u.user_id, u.email, u.password_hash, u.full_name, u.is_active,
       STRING_AGG(r.role_name, ',') as roles
FROM Users u
LEFT JOIN UserRoleMapping urm ON u.user_id = urm.user_id
LEFT JOIN Roles r ON urm.role_id = r.role_id
WHERE u.email = ? AND u.is_active = 1
GROUP BY u.user_id, u.email, u.password_hash, u.full_name, u.is_active;
```

## Error Responses

### Validation Errors

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Authentication Errors

```json
{
  "detail": "Invalid credentials",
  "error_code": "AUTH_001"
}
```

### Authorization Errors

```json
{
  "detail": "Insufficient permissions",
  "error_code": "AUTH_002"
}
```

## Frontend Integration Points

### Auth Context Provider

The frontend maintains authentication state using React Context that expects:

- `user` object with id, email, name, roles
- `token` string for API requests
- `login()` function
- `logout()` function
- `isAuthenticated` boolean

### Protected Routes

Some frontend routes require authentication:

- `/settings` - User settings page
- `/admin/*` - Admin dashboard (Admin role required)
- Product tracking features require login

### Session Management

- 7-day token expiration
- Automatic token refresh before expiration
- Redirect to login on token expiration
- Remember user preference handling
