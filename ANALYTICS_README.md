# Advanced Analytics System

This project includes a comprehensive, privacy-compliant analytics system built with Supabase and React.

## Features

### 🔍 **Comprehensive Tracking**
- **Page Views**: Tracks every page view, including SPA navigation and reloads
- **User Identification**: Records IP (hashed), browser, device type, country, and referrer
- **Session Management**: Groups page views by visitor sessions
- **Bot Detection**: Automatically filters out bots and crawlers

### 📊 **Event Tracking**
- **Click Events**: Track user interactions with buttons, links, etc.
- **Download Events**: Monitor file downloads
- **Error Events**: Capture JavaScript errors and form validation issues
- **Custom Events**: Track any custom user actions
- **Time on Page**: Automatically tracks how long users spend on each page

### 🛡️ **Privacy & Compliance**
- **IP Hashing**: IPs are hashed using SHA-256 for privacy
- **GDPR Compliant**: No personal identifiable information stored
- **Data Anonymization**: Geographic data is generalized
- **Secure Storage**: All data stored securely in Supabase with RLS policies

### 📈 **Advanced Dashboard**
- **Real-time Metrics**: Live visitor counts and activity
- **Interactive Charts**: Pie charts, bar charts, and area charts using Recharts
- **Geographic Insights**: Top countries and regions
- **Device Analytics**: Breakdown by desktop, mobile, tablet
- **Browser Statistics**: Popular browsers and versions
- **Visitor Paths**: Most common navigation paths
- **Top Pages & Referrers**: Most visited pages and traffic sources

### 🔍 **IP Address History**
- **IP History Dashboard**: View all visitor IPs with their session details
- **Detailed IP View**: Click on any IP to see complete activity history
- **Session Tracking**: Device, browser, location, session duration for each IP
- **Page View History**: See exactly which pages each IP visited and in what order
- **Event Tracking**: View all user interactions for each IP
- **Bot Detection**: Clear identification of automated traffic
- **Privacy Compliant**: IPs are hashed using SHA-256 for privacy protection

## IP Address History

The analytics system includes comprehensive IP tracking and history viewing capabilities.

### Features

- **IP History Dashboard** (`/admin/analytics/ip`): View all visitor IPs with their session details
- **Detailed IP View** (`/admin/analytics/ip/:ipHash`): Click on any IP to see complete activity history
- **Session Tracking**: View device, browser, location, and session duration for each IP
- **Page View History**: See exactly which pages each IP visited and in what order
- **Event Tracking**: View all user interactions (clicks, downloads, errors) for each IP
- **Bot Detection**: Clearly identify and filter bot traffic
- **Privacy Compliant**: IPs are hashed using SHA-256 for privacy protection

### IP History Dashboard

The IP History page shows:
- **Hashed IP Address**: Privacy-compliant IP representation
- **Device & Browser**: What device and browser each visitor used
- **Location**: Geographic location (country, region, city)
- **Session Stats**: Page views, session duration, last visit time
- **Bot/Human Classification**: Automatic bot detection
- **Referrer Information**: Where visitors came from

### Detailed IP View

Clicking on any IP shows:
- **Complete Session Overview**: Device, location, browser, session duration
- **Page View Timeline**: Chronological list of all pages visited
- **Event History**: All user interactions with timestamps
- **User Agent Details**: Full browser user agent string
- **Visit Patterns**: Understand user behavior and navigation paths

### Privacy & Security

- **IP Hashing**: All IPs are hashed using SHA-256 with salt
- **No Personal Data**: No names, emails, or other PII stored
- **Admin Only Access**: Only administrators can view IP history
- **GDPR Compliant**: Data handling respects privacy regulations
- **Data Retention**: Configurable data cleanup policies

### Usage

1. **Access IP History**: Navigate to `/admin/analytics/ip` from the admin panel
2. **Browse IPs**: View the list of all visitor IPs with summary information
3. **View Details**: Click on any IP hash to see complete activity history
4. **Analyze Patterns**: Use the detailed view to understand user behavior

### Test Data

To populate test data for demonstration:

```bash
node populate-test-data.js
```

This will create sample visitor sessions with realistic data for testing the IP history functionality.

## Architecture

### Database Schema
- `visitor_sessions`: Stores session data with hashed IPs and device info
- `page_views`: Records each page view with timestamps
- `analytics_events`: Captures all user events
- `daily_stats`: Cached aggregated statistics (for performance)

### Components
- **AnalyticsTracker**: React component that tracks route changes
- **analytics.ts**: Client-side tracking utility
- **track-analytics**: Supabase Edge Function for server-side processing
- **AdminAnalytics**: Dashboard with advanced visualizations
- **IPHistory**: List of all visitor IPs
- **IPDetail**: Detailed view of individual IP activity
- **AnalyticsTest**: Comprehensive testing suite

## Setup

1. **Database Migration**:
   ```bash
   npx supabase db push
   ```

2. **Deploy Edge Function**:
   ```bash
   npx supabase functions deploy track-analytics
   ```

3. **Environment Variables**:
   - Set `IP_SALT` in your Supabase Edge Function secrets for IP hashing

## Usage

### Tracking Page Views
The system automatically tracks page views on route changes. No additional code needed.

### Tracking Custom Events
```typescript
import { analytics } from '@/lib/analytics';

// Track a button click
await analytics.trackEvent('click', 'hero_cta', { section: 'hero' });

// Track a download
await analytics.trackEvent('download', 'whitepaper.pdf', { size: '2MB' });

// Track an error
await analytics.trackEvent('error', 'form_submit_failed', { error: 'validation_error' });
```

### Testing
Visit `/admin/analytics/test` to run comprehensive tests including:
- Page view tracking
- Event tracking
- Device detection
- Performance testing
- Privacy compliance checks
- Bot detection simulation

## Privacy Considerations

- **IP Addresses**: Hashed using SHA-256 with a salt
- **Data Retention**: Implement automatic cleanup policies
- **Cookie Consent**: Consider adding cookie consent banners
- **Data Export**: Provide users with data export/deletion options
- **Anonymization**: All personal data is anonymized before storage

## Performance

- **Edge Function**: Server-side processing for accurate geolocation
- **Async Tracking**: Non-blocking client-side tracking
- **Data Aggregation**: Cached daily stats for fast dashboard loading
- **Indexed Queries**: Optimized database queries with proper indexing

## Security

- **Row Level Security**: Supabase RLS policies restrict data access
- **Admin Only**: Analytics data only accessible to admin users
- **Input Validation**: Server-side validation of all tracking data
- **Rate Limiting**: Consider implementing rate limiting for tracking endpoints

## Testing Across Devices

To verify analytics accuracy across different devices and locations:

1. Use browser developer tools to simulate different devices
2. Test with VPNs to simulate different geographic locations
3. Use the AnalyticsTest page for comprehensive validation
4. Monitor server logs for any tracking failures
5. Verify bot detection with various user agents

## Future Enhancements

- **A/B Testing**: Track conversion rates for different variants
- **Heatmaps**: Visual click tracking
- **Custom Dashboards**: User-configurable analytics views
- **API Integration**: Export data to external analytics platforms
- **Real-time Alerts**: Notifications for traffic anomalies
- **Advanced Segmentation**: Cohort analysis and user segmentation