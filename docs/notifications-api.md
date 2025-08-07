# Notifications & Alerts API

## Overview

Handles user notifications, email alerts, price drop notifications, weekly reports, and push notifications.

## Database Tables Used

- `UserNotifications`
- `NotificationPreferences`
- `EmailQueue`
- `PushNotificationTokens`
- `UserAlerts`
- `Users`
- `DimCanonicalProduct`
- `FactProductPrice`
- `UserFavorites`

## API Endpoints

### 1. Get User Notifications

```http
GET /api/notifications
```

**Auth Required:** User authentication

**Query Parameters:**

- `unread_only` (optional): Filter for unread notifications
- `type` (optional): "price_drop", "price_alert", "system", "marketing"
- `limit` (optional): Number of notifications (default: 20)
- `offset` (optional): Pagination offset

**Response:**

```json
{
  "notifications": [
    {
      "notification_id": 1,
      "type": "price_drop",
      "title": "Price Drop Alert: iPhone 15 Pro Max",
      "message": "The price dropped from $1,299.99 to $1,199.99 (7.7% off) at TechMart",
      "data": {
        "product_id": 123,
        "product_name": "iPhone 15 Pro Max",
        "old_price": 1299.99,
        "new_price": 1199.99,
        "discount_percentage": 7.7,
        "retailer": "TechMart",
        "product_image": "https://example.com/image.jpg"
      },
      "is_read": false,
      "created_at": "2025-08-06T10:30:00Z",
      "expires_at": "2025-08-13T10:30:00Z"
    },
    {
      "notification_id": 2,
      "type": "weekly_report",
      "title": "Your Weekly Price Report",
      "message": "3 price drops on your favorites, 5 new deals in Electronics",
      "data": {
        "price_drops_count": 3,
        "new_deals_count": 5,
        "category": "Electronics",
        "report_url": "/reports/weekly/2025-week-32"
      },
      "is_read": true,
      "created_at": "2025-08-05T09:00:00Z"
    }
  ],
  "unread_count": 12,
  "total_count": 156
}
```

**Implementation:**

```sql
-- Get user notifications with details
SELECT
    un.notification_id,
    un.type,
    un.title,
    un.message,
    un.data_json as data,
    un.is_read,
    un.created_at,
    un.expires_at
FROM UserNotifications un
WHERE un.user_id = ?
    AND (? IS NULL OR un.is_read = 0)
    AND (? IS NULL OR un.type = ?)
    AND (un.expires_at IS NULL OR un.expires_at > GETDATE())
ORDER BY un.created_at DESC
OFFSET ? ROWS FETCH NEXT ? ROWS ONLY;
```

### 2. Mark Notifications as Read

```http
PUT /api/notifications/mark-read
```

**Request Body:**

```json
{
  "notification_ids": [1, 2, 3],
  "mark_all": false
}
```

**Response:**

```json
{
  "success": true,
  "updated_count": 3
}
```

### 3. Notification Preferences

```http
GET /api/notifications/preferences
```

**Response:**

```json
{
  "preferences": {
    "email_notifications": {
      "price_drops": true,
      "weekly_reports": true,
      "deal_alerts": false,
      "system_updates": true,
      "marketing": false
    },
    "push_notifications": {
      "price_drops": true,
      "instant_alerts": true,
      "deal_alerts": false
    },
    "frequency_settings": {
      "price_drop_threshold": 10.0,
      "max_daily_notifications": 5,
      "quiet_hours": {
        "enabled": true,
        "start": "22:00",
        "end": "08:00",
        "timezone": "America/New_York"
      }
    },
    "categories": [
      {
        "category": "Electronics",
        "enabled": true,
        "min_discount": 15.0
      },
      {
        "category": "Fashion",
        "enabled": false
      }
    ]
  }
}
```

### Update Preferences

```http
PUT /api/notifications/preferences
```

**Request Body:**

```json
{
  "email_notifications": {
    "price_drops": false,
    "weekly_reports": true
  },
  "frequency_settings": {
    "price_drop_threshold": 15.0
  }
}
```

### 4. Price Alerts Management

```http
GET /api/notifications/alerts
```

**Response:**

```json
{
  "alerts": [
    {
      "alert_id": 1,
      "product_id": 123,
      "product_name": "Samsung Galaxy S24",
      "current_price": 799.99,
      "target_price": 699.99,
      "alert_type": "price_below",
      "is_active": true,
      "created_at": "2025-08-01T10:00:00Z",
      "triggered_count": 0,
      "last_triggered": null
    }
  ]
}
```

### Create Price Alert

```http
POST /api/notifications/alerts
```

**Request Body:**

```json
{
  "product_id": 123,
  "alert_type": "price_below",
  "target_price": 699.99,
  "notification_methods": ["email", "push"]
}
```

### 5. Weekly Reports

```http
GET /api/notifications/reports/weekly
```

**Query Parameters:**

- `week` (optional): Specific week (format: 2025-W32)

**Response:**

```json
{
  "report": {
    "week": "2025-W32",
    "period": {
      "start": "2025-08-04T00:00:00Z",
      "end": "2025-08-10T23:59:59Z"
    },
    "summary": {
      "favorites_tracked": 25,
      "price_drops": 8,
      "new_deals": 12,
      "savings_opportunities": 145.5,
      "most_saved_category": "Electronics"
    },
    "highlights": [
      {
        "product_id": 123,
        "product_name": "MacBook Pro 16-inch",
        "price_change": -199.99,
        "percentage_change": -8.3,
        "retailer": "TechStore",
        "recommendation": "Consider buying now - near historic low"
      }
    ],
    "category_insights": [
      {
        "category": "Electronics",
        "products_tracked": 15,
        "avg_price_change": -3.2,
        "best_deals_count": 5
      }
    ],
    "market_trends": [
      "Technology prices trending down this week",
      "Back-to-school deals now available",
      "New iPhone announcement may affect current model prices"
    ]
  }
}
```

### 6. Push Notification Management

```http
POST /api/notifications/push/register
```

**Request Body:**

```json
{
  "token": "fcm_device_token_here",
  "platform": "android",
  "device_info": {
    "model": "Samsung Galaxy S24",
    "os_version": "14.0",
    "app_version": "1.2.0"
  }
}
```

### Send Test Notification

```http
POST /api/notifications/push/test
```

**Request Body:**

```json
{
  "title": "Test Notification",
  "message": "This is a test push notification",
  "data": {
    "test": true
  }
}
```

### 7. Notification History

```http
GET /api/notifications/history
```

**Query Parameters:**

- `start_date` (optional): Filter from date
- `end_date` (optional): Filter to date
- `type` (optional): Notification type filter

**Response:**

```json
{
  "history": [
    {
      "date": "2025-08-06",
      "notifications_sent": 45,
      "notifications_read": 38,
      "click_through_rate": 22.5,
      "types": {
        "price_drop": 25,
        "weekly_report": 1,
        "deal_alert": 19
      }
    }
  ],
  "analytics": {
    "total_sent": 1250,
    "total_read": 980,
    "avg_read_rate": 78.4,
    "most_effective_type": "price_drop",
    "best_send_time": "09:00"
  }
}
```

### 8. Bulk Notification Actions

```http
DELETE /api/notifications/bulk-delete
```

**Request Body:**

```json
{
  "notification_ids": [1, 2, 3],
  "delete_all_read": false,
  "older_than_days": 30
}
```

### 9. Email Notification Templates

```http
GET /api/notifications/templates
```

**Response:**

```json
{
  "templates": [
    {
      "template_id": "price_drop",
      "name": "Price Drop Alert",
      "subject": "🔥 Price Drop Alert: {{product_name}}",
      "html_content": "<html>...</html>",
      "variables": [
        "product_name",
        "old_price",
        "new_price",
        "discount_percentage"
      ]
    }
  ]
}
```

### 10. Admin Notification Broadcasting

```http
POST /api/admin/notifications/broadcast
```

**Auth Required:** Admin Role

**Request Body:**

```json
{
  "title": "System Maintenance Notice",
  "message": "Scheduled maintenance on August 10th from 2-4 AM EST",
  "type": "system",
  "target_audience": {
    "user_plans": ["premium", "enterprise"],
    "user_ids": null,
    "all_users": false
  },
  "delivery_methods": ["in_app", "email"],
  "schedule": {
    "send_immediately": false,
    "send_at": "2025-08-08T12:00:00Z"
  }
}
```

## Database Schema

### UserNotifications Table

```sql
CREATE TABLE UserNotifications (
    notification_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(1000) NOT NULL,
    data_json NVARCHAR(MAX),
    is_read BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    expires_at DATETIME2,
    read_at DATETIME2,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE INDEX IX_UserNotifications_User_Type_Created ON UserNotifications(user_id, type, created_at);
CREATE INDEX IX_UserNotifications_IsRead_Created ON UserNotifications(is_read, created_at);
```

### NotificationPreferences Table

```sql
CREATE TABLE NotificationPreferences (
    preference_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    email_notifications_json NVARCHAR(MAX),
    push_notifications_json NVARCHAR(MAX),
    frequency_settings_json NVARCHAR(MAX),
    updated_at DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE(user_id)
);
```

### EmailQueue Table

```sql
CREATE TABLE EmailQueue (
    queue_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    email_address VARCHAR(255) NOT NULL,
    subject NVARCHAR(500) NOT NULL,
    html_content NVARCHAR(MAX),
    template_id VARCHAR(100),
    template_data_json NVARCHAR(MAX),
    status VARCHAR(50) DEFAULT 'PENDING',
    priority INT DEFAULT 5,
    scheduled_for DATETIME2 DEFAULT GETDATE(),
    sent_at DATETIME2,
    error_message NVARCHAR(1000),
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_EmailQueue_Status_Priority_Scheduled ON EmailQueue(status, priority, scheduled_for);
```

## Background Processing

### Price Drop Detection Job

```python
async def detect_price_drops():
    """Background job to detect price drops and create notifications"""
    query = """
    WITH PriceChanges AS (
        SELECT
            v.canonical_product_id,
            cp.product_title,
            fpp.current_price,
            LAG(fpp.current_price) OVER (
                PARTITION BY fpp.variant_id
                ORDER BY fpp.date_id
            ) as previous_price,
            s.shop_name,
            v.variant_id
        FROM FactProductPrice fpp
        JOIN DimVariant v ON fpp.variant_id = v.variant_id
        JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
        JOIN DimShop s ON v.shop_id = s.shop_id
        WHERE fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    ),
    PriceDrops AS (
        SELECT *,
            ((previous_price - current_price) / previous_price) * 100 as discount_percentage
        FROM PriceChanges
        WHERE previous_price > current_price
            AND ((previous_price - current_price) / previous_price) * 100 >= 5.0
    )
    SELECT
        pd.*,
        uf.user_id
    FROM PriceDrops pd
    JOIN UserFavorites uf ON pd.canonical_product_id = uf.product_id
    JOIN NotificationPreferences np ON uf.user_id = np.user_id
    WHERE JSON_VALUE(np.email_notifications_json, '$.price_drops') = 'true'
        AND pd.discount_percentage >= CAST(JSON_VALUE(np.frequency_settings_json, '$.price_drop_threshold') AS FLOAT)
    """

    # Execute query and create notifications
    for row in results:
        await create_notification(
            user_id=row.user_id,
            type="price_drop",
            title=f"Price Drop Alert: {row.product_title}",
            message=f"Price dropped from ${row.previous_price:.2f} to ${row.current_price:.2f} ({row.discount_percentage:.1f}% off) at {row.shop_name}",
            data={
                "product_id": row.canonical_product_id,
                "old_price": row.previous_price,
                "new_price": row.current_price,
                "discount_percentage": row.discount_percentage,
                "retailer": row.shop_name
            }
        )
```

### Weekly Report Generation

```python
async def generate_weekly_reports():
    """Generate weekly reports for all users"""
    week_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    week_start -= timedelta(days=week_start.weekday())
    week_end = week_start + timedelta(days=6, hours=23, minutes=59, seconds=59)

    for user in get_users_with_weekly_reports_enabled():
        report_data = generate_user_weekly_report(user.user_id, week_start, week_end)

        await create_notification(
            user_id=user.user_id,
            type="weekly_report",
            title="Your Weekly Price Report",
            message=f"{report_data['price_drops_count']} price drops on your favorites",
            data=report_data
        )
```

## Real-time Notifications

### WebSocket Implementation

```python
# WebSocket endpoint for real-time notifications
@app.websocket("/ws/notifications")
async def websocket_notifications(websocket: WebSocket, user_id: int):
    await websocket.accept()

    # Subscribe to user notification channel
    await redis.subscribe(f"notifications:{user_id}")

    try:
        while True:
            # Listen for new notifications
            message = await redis.get_message()
            if message:
                await websocket.send_json(message['data'])

            # Also listen for websocket messages
            try:
                data = await asyncio.wait_for(websocket.receive_json(), timeout=1.0)
                if data.get('type') == 'mark_read':
                    await mark_notifications_read(data['notification_ids'])
            except asyncio.TimeoutError:
                continue

    except WebSocketDisconnect:
        await redis.unsubscribe(f"notifications:{user_id}")
```

## Performance Optimization

### Caching Strategy

- `notifications:{user_id}` - TTL: 5 minutes
- `notification_count:{user_id}` - TTL: 10 minutes
- `user_preferences:{user_id}` - TTL: 1 hour
- `weekly_report:{user_id}:{week}` - TTL: 7 days

### Database Indexes

```sql
CREATE INDEX IX_UserNotifications_User_Unread ON UserNotifications(user_id, is_read, created_at);
CREATE INDEX IX_UserAlerts_User_Active ON UserAlerts(user_id, is_active);
CREATE INDEX IX_EmailQueue_Priority_Status ON EmailQueue(priority DESC, status, scheduled_for);
CREATE INDEX IX_PushTokens_User_Platform ON PushNotificationTokens(user_id, platform);
```

## Error Handling

### Notification Delivery Failure

```json
{
  "detail": "Failed to send notification",
  "error_code": "NOTIFICATION_001",
  "retry_scheduled": "2025-08-06T11:00:00Z"
}
```

### Invalid Preference Update

```json
{
  "detail": "Invalid notification preference",
  "error_code": "NOTIFICATION_002",
  "field": "price_drop_threshold",
  "valid_range": "1.0 - 50.0"
}
```

## Frontend Integration

The notification system expects:

- Real-time WebSocket connection for instant notifications
- Notification badge with unread count
- Notification center/dropdown with actions
- Settings page for preferences management
- Toast notifications for immediate alerts
- Weekly report email templates
