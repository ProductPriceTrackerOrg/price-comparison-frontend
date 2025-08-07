# Admin Dashboard API

## Overview

Administrative APIs for platform management, data pipeline monitoring, user administration, and system analytics.

## Database Tables Used

- `UserDatabase.*` (all user tables)
- `OperationalDatabase.*` (all operational tables)
- `DataWarehouse.*` (all warehouse tables)
- `UserActivityLog`
- `APIUsageLog`
- `DataPipelineStatus`
- `SystemMetrics`

## API Endpoints

### 1. Admin Dashboard Overview

```http
GET /api/admin/dashboard
```

**Auth Required:** Admin Role

**Response:**

```json
{
  "system_overview": {
    "total_users": 125000,
    "active_users_24h": 8500,
    "total_products": 2500000,
    "total_retailers": 500,
    "data_pipeline_status": "healthy",
    "system_uptime": "99.95%",
    "api_requests_24h": 1500000
  },
  "data_quality": {
    "data_freshness": {
      "price_data": "2 minutes ago",
      "product_catalog": "1 hour ago",
      "anomaly_detection": "5 minutes ago"
    },
    "quality_score": 96.5,
    "failed_extractions": 45,
    "data_completeness": 98.8
  },
  "performance_metrics": {
    "avg_response_time": 245,
    "cache_hit_rate": 89.5,
    "database_connections": 45,
    "memory_usage": 72.3,
    "cpu_usage": 35.8
  },
  "alerts": [
    {
      "severity": "warning",
      "message": "High API usage detected for TechMart scraper",
      "timestamp": "2025-08-06T10:30:00Z"
    }
  ]
}
```

**Implementation:**

```sql
-- Admin dashboard metrics
WITH UserMetrics AS (
    SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN last_login >= DATEADD(day, -1, GETDATE()) THEN 1 END) as active_24h,
        COUNT(CASE WHEN is_premium = 1 THEN 1 END) as premium_users
    FROM Users
),
ProductMetrics AS (
    SELECT
        COUNT(DISTINCT canonical_product_id) as total_products,
        COUNT(DISTINCT v.shop_id) as total_retailers
    FROM DimCanonicalProduct cp
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
),
SystemMetrics AS (
    SELECT
        COUNT(*) as api_requests_24h,
        AVG(response_time_ms) as avg_response_time
    FROM APIUsageLog
    WHERE created_at >= DATEADD(day, -1, GETDATE())
),
PipelineStatus AS (
    SELECT
        AVG(CASE WHEN status = 'SUCCESS' THEN 100.0 ELSE 0.0 END) as success_rate,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_jobs
    FROM DataPipelineStatus
    WHERE created_at >= DATEADD(day, -1, GETDATE())
)
SELECT
    um.*,
    pm.*,
    sm.*,
    ps.*
FROM UserMetrics um
CROSS JOIN ProductMetrics pm
CROSS JOIN SystemMetrics sm
CROSS JOIN PipelineStatus ps;
```

### 2. User Management

```http
GET /api/admin/users
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `search` (optional): Search by email/name
- `status` (optional): "active", "suspended", "pending"
- `plan` (optional): "free", "premium", "enterprise"

**Response:**

```json
{
  "users": [
    {
      "user_id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "plan": "premium",
      "status": "active",
      "created_at": "2025-01-15T10:30:00Z",
      "last_login": "2025-08-06T09:15:00Z",
      "total_searches": 450,
      "favorites_count": 25,
      "api_usage_30d": 15000,
      "subscription_expires": "2025-12-15T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 125000,
    "page": 1,
    "limit": 50,
    "total_pages": 2500
  },
  "summary": {
    "active_users": 118500,
    "suspended_users": 1200,
    "premium_users": 25000,
    "enterprise_users": 500
  }
}
```

### User Actions

```http
PUT /api/admin/users/{user_id}/status
```

**Request Body:**

```json
{
  "status": "suspended",
  "reason": "Terms of service violation",
  "notify_user": true
}
```

```http
PUT /api/admin/users/{user_id}/plan
```

**Request Body:**

```json
{
  "plan": "enterprise",
  "billing_cycle": "annual",
  "effective_date": "2025-08-15T00:00:00Z"
}
```

### 3. Data Pipeline Management

```http
GET /api/admin/pipelines
```

**Response:**

```json
{
  "pipelines": [
    {
      "pipeline_id": "price_extraction",
      "name": "Price Data Extraction",
      "status": "running",
      "last_run": "2025-08-06T10:00:00Z",
      "next_run": "2025-08-06T11:00:00Z",
      "success_rate": 98.5,
      "avg_duration": 450,
      "last_error": null,
      "monitored_sources": 500
    },
    {
      "pipeline_id": "anomaly_detection",
      "name": "Price Anomaly Detection",
      "status": "completed",
      "last_run": "2025-08-06T10:30:00Z",
      "next_run": "2025-08-06T10:35:00Z",
      "success_rate": 99.2,
      "avg_duration": 120,
      "anomalies_detected": 45,
      "confidence_threshold": 0.8
    }
  ],
  "overall_health": {
    "healthy_pipelines": 8,
    "warning_pipelines": 1,
    "failed_pipelines": 0,
    "system_status": "operational"
  }
}
```

### Pipeline Control

```http
POST /api/admin/pipelines/{pipeline_id}/trigger
```

```http
PUT /api/admin/pipelines/{pipeline_id}/pause
```

```http
PUT /api/admin/pipelines/{pipeline_id}/resume
```

### 4. Retailer Management

```http
GET /api/admin/retailers
```

**Response:**

```json
{
  "retailers": [
    {
      "retailer_id": 1,
      "name": "TechMart",
      "domain": "techmart.com",
      "status": "active",
      "extraction_health": {
        "success_rate": 96.5,
        "last_successful_extraction": "2025-08-06T10:45:00Z",
        "avg_products_extracted": 15000,
        "extraction_frequency": "hourly"
      },
      "data_quality": {
        "price_accuracy": 98.2,
        "product_match_rate": 94.5,
        "image_availability": 89.3
      },
      "monitoring": {
        "rate_limit_status": "normal",
        "blocked_requests": 0,
        "captcha_encounters": 2
      }
    }
  ],
  "summary": {
    "total_retailers": 500,
    "active_extractions": 485,
    "paused_retailers": 10,
    "failed_retailers": 5
  }
}
```

### Retailer Actions

```http
PUT /api/admin/retailers/{retailer_id}/status
```

```http
POST /api/admin/retailers/{retailer_id}/test-extraction
```

```http
PUT /api/admin/retailers/{retailer_id}/config
```

### 5. Content Moderation

```http
GET /api/admin/content/reviews
```

**Query Parameters:**

- `status` (optional): "pending", "approved", "rejected"
- `flagged` (optional): true/false
- `days` (optional): Review period

**Response:**

```json
{
  "pending_reviews": [
    {
      "content_id": 1,
      "content_type": "product_review",
      "product_id": 123,
      "user_id": 456,
      "content": "This product is amazing...",
      "submitted_at": "2025-08-06T08:30:00Z",
      "flags": ["spam_detection"],
      "confidence_score": 0.75,
      "requires_review": true
    }
  ],
  "moderation_stats": {
    "pending_count": 45,
    "approved_today": 120,
    "rejected_today": 15,
    "auto_approved": 890
  }
}
```

### Content Actions

```http
PUT /api/admin/content/{content_id}/moderate
```

**Request Body:**

```json
{
  "action": "approve",
  "moderator_notes": "Content is appropriate",
  "update_policy": false
}
```

### 6. Analytics & Reports

```http
GET /api/admin/analytics/usage
```

**Query Parameters:**

- `period` (optional): "day", "week", "month"
- `breakdown` (optional): "endpoint", "user_type", "retailer"

**Response:**

```json
{
  "api_usage": {
    "total_requests": 1500000,
    "unique_users": 8500,
    "top_endpoints": [
      {
        "endpoint": "/api/products/search",
        "requests": 450000,
        "percentage": 30.0,
        "avg_response_time": 245
      }
    ],
    "usage_by_plan": [
      {
        "plan": "free",
        "requests": 900000,
        "users": 7000
      },
      {
        "plan": "premium",
        "requests": 500000,
        "users": 1200
      }
    ]
  },
  "performance_metrics": {
    "p50_response_time": 180,
    "p95_response_time": 450,
    "p99_response_time": 800,
    "error_rate": 0.5,
    "cache_hit_rate": 89.5
  }
}
```

### 7. System Configuration

```http
GET /api/admin/config
```

**Response:**

```json
{
  "system_config": {
    "api_rate_limits": {
      "free_tier": 1000,
      "premium_tier": 10000,
      "enterprise_tier": 100000
    },
    "cache_settings": {
      "default_ttl": 3600,
      "search_ttl": 300,
      "product_ttl": 1800
    },
    "extraction_settings": {
      "max_concurrent_jobs": 50,
      "retry_attempts": 3,
      "timeout_seconds": 30
    },
    "anomaly_detection": {
      "confidence_threshold": 0.8,
      "check_frequency": 300,
      "notification_channels": ["email", "slack"]
    }
  }
}
```

### Update Configuration

```http
PUT /api/admin/config
```

**Request Body:**

```json
{
  "section": "api_rate_limits",
  "updates": {
    "premium_tier": 15000
  }
}
```

### 8. Audit Logs

```http
GET /api/admin/audit-logs
```

**Query Parameters:**

- `user_id` (optional): Filter by user
- `action_type` (optional): Filter by action
- `start_date` (optional): Date range start
- `end_date` (optional): Date range end

**Response:**

```json
{
  "audit_logs": [
    {
      "log_id": 1,
      "user_id": 123,
      "user_email": "admin@priceplus.com",
      "action": "user_status_change",
      "resource_type": "user",
      "resource_id": 456,
      "details": {
        "old_status": "active",
        "new_status": "suspended",
        "reason": "Terms violation"
      },
      "timestamp": "2025-08-06T10:30:00Z",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0..."
    }
  ],
  "summary": {
    "total_logs": 15000,
    "actions_today": 150,
    "unique_admins": 5
  }
}
```

### 9. Backup & Recovery

```http
GET /api/admin/backups
```

**Response:**

```json
{
  "backups": [
    {
      "backup_id": "backup_20250806_100000",
      "type": "full",
      "status": "completed",
      "created_at": "2025-08-06T10:00:00Z",
      "size_gb": 45.6,
      "retention_until": "2025-09-06T10:00:00Z",
      "databases": ["user_db", "warehouse", "operational"]
    }
  ],
  "backup_config": {
    "full_backup_frequency": "daily",
    "incremental_frequency": "hourly",
    "retention_days": 30,
    "auto_cleanup": true
  }
}
```

### Trigger Backup

```http
POST /api/admin/backups/create
```

**Request Body:**

```json
{
  "type": "full",
  "databases": ["user_db", "warehouse"],
  "description": "Pre-maintenance backup"
}
```

### 10. System Health Monitoring

```http
GET /api/admin/health
```

**Response:**

```json
{
  "system_health": {
    "overall_status": "healthy",
    "components": [
      {
        "name": "Database",
        "status": "healthy",
        "response_time": 15,
        "last_check": "2025-08-06T10:45:00Z"
      },
      {
        "name": "Redis Cache",
        "status": "healthy",
        "memory_usage": 68.5,
        "hit_rate": 89.2
      },
      {
        "name": "Data Pipeline",
        "status": "warning",
        "active_jobs": 8,
        "failed_jobs": 1
      }
    ]
  },
  "resource_usage": {
    "cpu_usage": 45.8,
    "memory_usage": 72.3,
    "disk_usage": 68.9,
    "network_io": 156.7
  },
  "uptime": {
    "system_uptime": "15 days, 4 hours",
    "application_uptime": "7 days, 12 hours",
    "last_restart": "2025-07-30T08:00:00Z"
  }
}
```

## Database Queries

### User Analytics Query

```sql
-- Comprehensive user analytics
SELECT
    u.user_id,
    u.email,
    u.name,
    u.plan,
    u.status,
    u.created_at,
    u.last_login,
    COUNT(DISTINCT ua.activity_id) as total_activities,
    COUNT(DISTINCT uf.favorite_id) as favorites_count,
    COUNT(DISTINCT ual.log_id) as api_calls_30d,
    s.subscription_status,
    s.expires_at as subscription_expires
FROM Users u
LEFT JOIN UserActivity ua ON u.user_id = ua.user_id
LEFT JOIN UserFavorites uf ON u.user_id = uf.user_id
LEFT JOIN APIUsageLog ual ON u.user_id = ual.user_id
    AND ual.created_at >= DATEADD(day, -30, GETDATE())
LEFT JOIN Subscriptions s ON u.user_id = s.user_id
WHERE (? IS NULL OR u.email LIKE ?)
    AND (? IS NULL OR u.status = ?)
    AND (? IS NULL OR u.plan = ?)
GROUP BY u.user_id, u.email, u.name, u.plan, u.status,
         u.created_at, u.last_login, s.subscription_status, s.expires_at
ORDER BY u.created_at DESC
OFFSET ? ROWS FETCH NEXT ? ROWS ONLY;
```

### Pipeline Health Query

```sql
-- Data pipeline monitoring
SELECT
    dp.pipeline_id,
    dp.pipeline_name,
    dp.current_status,
    dp.last_run_time,
    dp.next_scheduled_run,
    dp.last_error_message,
    AVG(CASE WHEN dps.status = 'SUCCESS' THEN 1.0 ELSE 0.0 END) as success_rate,
    AVG(dps.duration_seconds) as avg_duration,
    COUNT(*) as total_runs
FROM DataPipeline dp
LEFT JOIN DataPipelineStatus dps ON dp.pipeline_id = dps.pipeline_id
    AND dps.created_at >= DATEADD(day, -7, GETDATE())
GROUP BY dp.pipeline_id, dp.pipeline_name, dp.current_status,
         dp.last_run_time, dp.next_scheduled_run, dp.last_error_message
ORDER BY dp.pipeline_name;
```

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX IX_Users_Status_Plan ON Users(status, plan);
CREATE INDEX IX_UserActivity_User_Date ON UserActivity(user_id, created_at);
CREATE INDEX IX_APIUsage_User_Date ON APIUsageLog(user_id, created_at);
CREATE INDEX IX_Pipeline_Status_Date ON DataPipelineStatus(pipeline_id, status, created_at);
```

### Caching Strategy

- `admin:dashboard` - TTL: 5 minutes
- `admin:users:{page}` - TTL: 2 minutes
- `admin:pipelines` - TTL: 1 minute
- `admin:config` - TTL: 1 hour
- `admin:health` - TTL: 30 seconds

## Security Considerations

### Role-Based Access

- `SUPER_ADMIN`: Full system access
- `ADMIN`: User management, content moderation
- `DATA_ADMIN`: Pipeline management, data quality
- `SUPPORT`: Read-only access to user data

### Audit Trail

All admin actions are logged with:

- User identification
- Action performed
- Resource affected
- Timestamp
- IP address
- Request details

## Error Handling

### Insufficient Permissions

```json
{
  "detail": "Insufficient permissions for this operation",
  "error_code": "ADMIN_001",
  "required_role": "SUPER_ADMIN"
}
```

### Resource Not Found

```json
{
  "detail": "Pipeline not found",
  "error_code": "ADMIN_002",
  "pipeline_id": "invalid_pipeline"
}
```

## Frontend Integration

Admin dashboard expects:

- Real-time system monitoring
- Interactive data tables with sorting/filtering
- Bulk actions for user management
- Pipeline control interfaces
- Configuration management forms
- Audit log viewers
- Health monitoring dashboards
