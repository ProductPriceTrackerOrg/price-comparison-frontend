# Static Pages API

## Overview

API endpoints for static content pages including Help, About, Contact, Privacy Policy, Terms of Service, and FAQ.

## Database Tables Used

- `StaticPages`
- `ContactSubmissions`
- `FAQCategories`
- `FAQItems`
- `PageViews`
- `SupportTickets`

## API Endpoints

### 1. Help Center

```http
GET /api/static/help
```

**Response:**

```json
{
  "help_sections": [
    {
      "section_id": "getting-started",
      "title": "Getting Started",
      "description": "Learn the basics of using PricePulse",
      "articles": [
        {
          "article_id": 1,
          "title": "How to Search for Products",
          "slug": "how-to-search-products",
          "summary": "Learn how to effectively search and filter products",
          "content": "To search for products...",
          "last_updated": "2025-08-01T10:00:00Z",
          "views": 1250,
          "helpful_votes": 89
        }
      ]
    },
    {
      "section_id": "price-tracking",
      "title": "Price Tracking",
      "description": "Understanding price alerts and tracking",
      "articles": [
        {
          "article_id": 2,
          "title": "Setting Up Price Alerts",
          "slug": "setting-price-alerts",
          "summary": "Get notified when prices drop on your favorite products",
          "content": "Price alerts help you...",
          "last_updated": "2025-07-28T14:30:00Z",
          "views": 892,
          "helpful_votes": 76
        }
      ]
    }
  ],
  "popular_articles": [
    {
      "article_id": 1,
      "title": "How to Search for Products",
      "views": 1250
    }
  ],
  "recent_updates": [
    {
      "article_id": 3,
      "title": "New Features Update",
      "updated_at": "2025-08-05T09:00:00Z"
    }
  ]
}
```

### Get Specific Help Article

```http
GET /api/static/help/{article_id}
```

**Response:**

```json
{
  "article": {
    "article_id": 1,
    "title": "How to Search for Products",
    "slug": "how-to-search-products",
    "content": "# How to Search for Products\n\nPricePulse offers powerful search capabilities...",
    "content_html": "<h1>How to Search for Products</h1><p>PricePulse offers powerful search capabilities...</p>",
    "author": "PricePulse Team",
    "created_at": "2025-06-15T10:00:00Z",
    "last_updated": "2025-08-01T10:00:00Z",
    "tags": ["search", "basics", "tutorial"],
    "views": 1250,
    "helpful_votes": 89,
    "not_helpful_votes": 12
  },
  "related_articles": [
    {
      "article_id": 5,
      "title": "Advanced Search Filters",
      "summary": "Use advanced filters to narrow down your search results"
    }
  ],
  "breadcrumb": [
    { "title": "Help Center", "url": "/help" },
    { "title": "Getting Started", "url": "/help/getting-started" },
    {
      "title": "How to Search for Products",
      "url": "/help/how-to-search-products"
    }
  ]
}
```

### 2. FAQ System

```http
GET /api/static/faq
```

**Query Parameters:**

- `category` (optional): Filter by category
- `search` (optional): Search FAQ content

**Response:**

```json
{
  "categories": [
    {
      "category_id": 1,
      "name": "General",
      "description": "General questions about PricePulse",
      "icon": "help-circle",
      "sort_order": 1,
      "item_count": 8
    },
    {
      "category_id": 2,
      "name": "Pricing & Plans",
      "description": "Questions about subscription plans and pricing",
      "icon": "credit-card",
      "sort_order": 2,
      "item_count": 6
    }
  ],
  "faqs": [
    {
      "faq_id": 1,
      "category_id": 1,
      "question": "What is PricePulse?",
      "answer": "PricePulse is a comprehensive price tracking platform that helps you monitor product prices across multiple retailers...",
      "answer_html": "<p>PricePulse is a comprehensive price tracking platform...</p>",
      "sort_order": 1,
      "views": 2500,
      "helpful_votes": 156,
      "last_updated": "2025-07-15T12:00:00Z"
    },
    {
      "faq_id": 2,
      "category_id": 1,
      "question": "How accurate are the prices?",
      "answer": "Our prices are updated regularly and are typically accurate within 15 minutes of retailer updates...",
      "sort_order": 2,
      "views": 1890,
      "helpful_votes": 134
    }
  ],
  "popular_faqs": [
    {
      "faq_id": 1,
      "question": "What is PricePulse?",
      "views": 2500
    }
  ]
}
```

### Vote on FAQ Helpfulness

```http
POST /api/static/faq/{faq_id}/vote
```

**Request Body:**

```json
{
  "vote": "helpful"
}
```

### 3. Contact Page

```http
GET /api/static/contact
```

**Response:**

```json
{
  "contact_info": {
    "support_email": "support@priceplus.com",
    "business_email": "business@priceplus.com",
    "phone": "+1-555-PRICE-01",
    "address": {
      "street": "123 Tech Street",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94105",
      "country": "United States"
    },
    "business_hours": {
      "timezone": "PST",
      "monday_friday": "9:00 AM - 6:00 PM",
      "weekend": "Closed"
    }
  },
  "support_categories": [
    {
      "category": "technical_support",
      "title": "Technical Support",
      "description": "Issues with the platform, bugs, or feature questions",
      "estimated_response": "4-6 hours"
    },
    {
      "category": "billing",
      "title": "Billing & Subscriptions",
      "description": "Questions about your subscription, billing, or account",
      "estimated_response": "2-4 hours"
    },
    {
      "category": "partnerships",
      "title": "Business Partnerships",
      "description": "Retailer partnerships, API access, or business inquiries",
      "estimated_response": "1-2 business days"
    }
  ],
  "social_media": {
    "twitter": "@priceplus",
    "facebook": "PricePlusOfficial",
    "linkedin": "company/priceplus"
  }
}
```

### Submit Contact Form

```http
POST /api/static/contact/submit
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "category": "technical_support",
  "subject": "Issue with price alerts",
  "message": "I'm not receiving price alert notifications...",
  "user_id": 123,
  "priority": "normal"
}
```

**Response:**

```json
{
  "success": true,
  "ticket_id": "TICKET-2025-001234",
  "estimated_response": "4-6 hours",
  "confirmation_sent": true
}
```

### 4. Privacy Policy

```http
GET /api/static/privacy-policy
```

**Response:**

```json
{
  "privacy_policy": {
    "title": "Privacy Policy",
    "effective_date": "2025-06-01T00:00:00Z",
    "last_updated": "2025-07-15T00:00:00Z",
    "version": "2.1",
    "content": "# Privacy Policy\n\n## Information We Collect\n\nWe collect information you provide directly...",
    "content_html": "<h1>Privacy Policy</h1><h2>Information We Collect</h2><p>We collect information you provide directly...</p>",
    "sections": [
      {
        "section_id": "information-collection",
        "title": "Information We Collect",
        "content": "We collect several types of information..."
      },
      {
        "section_id": "data-usage",
        "title": "How We Use Your Data",
        "content": "We use the information we collect to..."
      },
      {
        "section_id": "data-sharing",
        "title": "Information Sharing",
        "content": "We do not sell, trade, or rent your personal information..."
      }
    ],
    "contact_info": {
      "privacy_email": "privacy@priceplus.com",
      "data_protection_officer": "dpo@priceplus.com"
    }
  },
  "related_policies": [
    {
      "title": "Terms of Service",
      "url": "/terms",
      "last_updated": "2025-07-15T00:00:00Z"
    },
    {
      "title": "Cookie Policy",
      "url": "/cookies",
      "last_updated": "2025-06-01T00:00:00Z"
    }
  ]
}
```

### 5. Terms of Service

```http
GET /api/static/terms
```

**Response:**

```json
{
  "terms_of_service": {
    "title": "Terms of Service",
    "effective_date": "2025-06-01T00:00:00Z",
    "last_updated": "2025-07-15T00:00:00Z",
    "version": "2.1",
    "content": "# Terms of Service\n\n## Acceptance of Terms\n\nBy accessing and using PricePulse...",
    "content_html": "<h1>Terms of Service</h1><h2>Acceptance of Terms</h2><p>By accessing and using PricePulse...</p>",
    "sections": [
      {
        "section_id": "acceptance",
        "title": "Acceptance of Terms",
        "content": "By accessing and using PricePulse..."
      },
      {
        "section_id": "user-accounts",
        "title": "User Accounts",
        "content": "When you create an account with us..."
      },
      {
        "section_id": "prohibited-uses",
        "title": "Prohibited Uses",
        "content": "You may not use our Service..."
      },
      {
        "section_id": "termination",
        "title": "Termination",
        "content": "We may terminate or suspend your access..."
      }
    ]
  },
  "agreement_tracking": {
    "current_version": "2.1",
    "user_agreed_version": "2.0",
    "requires_new_agreement": true,
    "changes_summary": "Updated data retention policies and user rights section"
  }
}
```

### Accept Terms Agreement

```http
POST /api/static/terms/accept
```

**Request Body:**

```json
{
  "version": "2.1",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0..."
}
```

### 6. About Page

```http
GET /api/static/about
```

**Response:**

```json
{
  "about": {
    "company_info": {
      "name": "PricePulse Technologies Inc.",
      "founded": "2023",
      "headquarters": "San Francisco, CA",
      "mission": "To democratize price transparency and help consumers make informed purchasing decisions",
      "vision": "A world where everyone has access to fair and transparent pricing information"
    },
    "content": "# About PricePulse\n\nPricePulse was founded with a simple mission...",
    "content_html": "<h1>About PricePulse</h1><p>PricePulse was founded with a simple mission...</p>",
    "team": [
      {
        "name": "Sarah Johnson",
        "position": "CEO & Co-Founder",
        "bio": "Former VP of Product at a major e-commerce platform...",
        "image": "/images/team/sarah.jpg",
        "linkedin": "https://linkedin.com/in/sarahjohnson"
      },
      {
        "name": "Michael Chen",
        "position": "CTO & Co-Founder",
        "bio": "Ex-Google engineer with 10+ years in data systems...",
        "image": "/images/team/michael.jpg",
        "linkedin": "https://linkedin.com/in/michaelchen"
      }
    ],
    "company_stats": {
      "products_tracked": "2.5M+",
      "retailers_monitored": "500+",
      "registered_users": "125K+",
      "countries_served": 5
    },
    "investors": [
      {
        "name": "Sequoia Capital",
        "round": "Series A",
        "logo": "/images/investors/sequoia.png"
      }
    ]
  },
  "milestones": [
    {
      "date": "2023-03-01",
      "title": "Company Founded",
      "description": "PricePulse was officially founded in San Francisco"
    },
    {
      "date": "2023-09-15",
      "title": "Beta Launch",
      "description": "Launched beta version with 50K products from 25 retailers"
    },
    {
      "date": "2024-02-01",
      "title": "Series A Funding",
      "description": "Raised $15M Series A led by Sequoia Capital"
    }
  ]
}
```

### 7. Cookie Policy

```http
GET /api/static/cookies
```

**Response:**

```json
{
  "cookie_policy": {
    "title": "Cookie Policy",
    "effective_date": "2025-06-01T00:00:00Z",
    "last_updated": "2025-06-01T00:00:00Z",
    "content": "# Cookie Policy\n\nThis Cookie Policy explains how PricePulse uses cookies...",
    "cookie_categories": [
      {
        "category": "essential",
        "title": "Essential Cookies",
        "description": "These cookies are necessary for the website to function",
        "always_active": true,
        "cookies": [
          {
            "name": "session_id",
            "purpose": "Maintains user session",
            "duration": "Session",
            "type": "First-party"
          }
        ]
      },
      {
        "category": "analytics",
        "title": "Analytics Cookies",
        "description": "Help us understand how visitors interact with our website",
        "user_controllable": true,
        "cookies": [
          {
            "name": "_ga",
            "purpose": "Google Analytics tracking",
            "duration": "2 years",
            "type": "Third-party"
          }
        ]
      }
    ]
  },
  "user_preferences": {
    "essential": true,
    "analytics": false,
    "marketing": false,
    "preferences": true
  }
}
```

### Update Cookie Preferences

```http
PUT /api/static/cookies/preferences
```

**Request Body:**

```json
{
  "analytics": true,
  "marketing": false,
  "preferences": true
}
```

### 8. Site Statistics

```http
GET /api/static/stats
```

**Response:**

```json
{
  "site_statistics": {
    "page_views": {
      "help": 15420,
      "faq": 8950,
      "contact": 3420,
      "privacy": 2100,
      "terms": 1890,
      "about": 5600
    },
    "popular_help_topics": [
      {
        "article_id": 1,
        "title": "How to Search for Products",
        "views": 1250
      },
      {
        "article_id": 2,
        "title": "Setting Up Price Alerts",
        "views": 892
      }
    ],
    "contact_submissions": {
      "total_this_month": 156,
      "avg_response_time_hours": 4.2,
      "satisfaction_rating": 4.7
    },
    "faq_effectiveness": {
      "total_votes": 2890,
      "helpful_percentage": 87.5,
      "most_helpful_faq": "What is PricePulse?"
    }
  }
}
```

## Database Schema

### StaticPages Table

```sql
CREATE TABLE StaticPages (
    page_id INT IDENTITY(1,1) PRIMARY KEY,
    page_slug VARCHAR(100) UNIQUE NOT NULL,
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    content_html NVARCHAR(MAX),
    meta_description NVARCHAR(500),
    meta_keywords NVARCHAR(200),
    version VARCHAR(10),
    effective_date DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    updated_by INT,
    is_published BIT DEFAULT 1
);
```

### ContactSubmissions Table

```sql
CREATE TABLE ContactSubmissions (
    submission_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    name NVARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject NVARCHAR(200) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    user_id INT,
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(50) DEFAULT 'open',
    assigned_to INT,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    resolved_at DATETIME2,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

### FAQ Tables

```sql
CREATE TABLE FAQCategories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    icon VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BIT DEFAULT 1
);

CREATE TABLE FAQItems (
    faq_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NOT NULL,
    question NVARCHAR(500) NOT NULL,
    answer NVARCHAR(MAX) NOT NULL,
    answer_html NVARCHAR(MAX),
    sort_order INT DEFAULT 0,
    views INT DEFAULT 0,
    helpful_votes INT DEFAULT 0,
    not_helpful_votes INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    is_published BIT DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES FAQCategories(category_id)
);
```

## Performance Optimization

### Caching Strategy

- `static:page:{slug}` - TTL: 24 hours
- `static:faq` - TTL: 4 hours
- `static:help` - TTL: 2 hours
- `static:contact:info` - TTL: 12 hours
- `static:stats` - TTL: 1 hour

### Database Indexes

```sql
CREATE INDEX IX_StaticPages_Slug_Published ON StaticPages(page_slug, is_published);
CREATE INDEX IX_ContactSubmissions_Status_Created ON ContactSubmissions(status, created_at);
CREATE INDEX IX_FAQItems_Category_Order ON FAQItems(category_id, sort_order);
CREATE INDEX IX_PageViews_Page_Date ON PageViews(page_slug, view_date);
```

## Admin Management

### Content Management

```http
PUT /api/admin/static/{page_slug}
```

**Request Body:**

```json
{
  "title": "Updated Privacy Policy",
  "content": "# Updated Privacy Policy\n\nNew content...",
  "version": "2.2",
  "effective_date": "2025-09-01T00:00:00Z"
}
```

### FAQ Management

```http
POST /api/admin/faq
```

**Request Body:**

```json
{
  "category_id": 1,
  "question": "How often are prices updated?",
  "answer": "Prices are updated every 15 minutes...",
  "sort_order": 5
}
```

## Error Handling

### Page Not Found

```json
{
  "detail": "Static page not found",
  "error_code": "STATIC_001",
  "page_slug": "invalid-page"
}
```

### Contact Submission Failed

```json
{
  "detail": "Failed to submit contact form",
  "error_code": "STATIC_002",
  "field_errors": {
    "email": "Invalid email format"
  }
}
```

## Frontend Integration

Static pages expect:

- Server-side rendering for SEO
- Breadcrumb navigation
- Table of contents for long pages
- Search functionality for help content
- Contact form with validation
- Cookie consent banners
- Terms acceptance tracking
