# PieceJob Deployment Guide

## Overview

This guide covers the deployment process for the PieceJob application across different platforms and environments.

## Prerequisites

### Development Environment
- Node.js 18+ 
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- Git for version control

### Platform Requirements
- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **iOS**: iOS 13+ (for future mobile deployment)
- **Android**: Android 6+ (for future mobile deployment)

## Environment Configuration

### Environment Variables

Create environment files for different deployment stages:

#### `.env` (Development)
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_ENV=development
EXPO_PUBLIC_ENABLE_LOGGING=true
```

#### `.env.staging` (Staging)
```bash
EXPO_PUBLIC_API_URL=https://api-staging.piecejob.co.za
EXPO_PUBLIC_APP_ENV=staging
EXPO_PUBLIC_ENABLE_LOGGING=false
```

#### `.env.production` (Production)
```bash
EXPO_PUBLIC_API_URL=https://api.piecejob.co.za
EXPO_PUBLIC_APP_ENV=production
EXPO_PUBLIC_ENABLE_LOGGING=false
EXPO_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## Web Deployment

### Build Process

1. **Install Dependencies**
```bash
npm install
```

2. **Build for Web**
```bash
npx expo export --platform web
```

3. **Output Location**
The build artifacts will be generated in the `dist/` directory.

### Netlify Deployment

#### Automatic Deployment (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Configure build settings:
     - Build command: `npx expo export --platform web`
     - Publish directory: `dist`

2. **Environment Variables**
   Configure in Netlify dashboard under Site Settings > Environment Variables

3. **Deploy Settings**
```toml
# netlify.toml
[build]
  command = "npx expo export --platform web"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Manual Deployment

1. **Build the Project**
```bash
npm run build:web
```

2. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Custom Domain Setup

1. **Purchase Domain** (e.g., through IONOS)
2. **Configure DNS**
   - Add CNAME record pointing to Netlify
   - Configure SSL certificate
3. **Update Netlify Settings**
   - Add custom domain in site settings
   - Enable HTTPS redirect

## Mobile Deployment (Future)

### iOS App Store

1. **Development Build**
```bash
eas build --platform ios --profile development
```

2. **Production Build**
```bash
eas build --platform ios --profile production
```

3. **Submit to App Store**
```bash
eas submit --platform ios
```

### Google Play Store

1. **Development Build**
```bash
eas build --platform android --profile development
```

2. **Production Build**
```bash
eas build --platform android --profile production
```

3. **Submit to Play Store**
```bash
eas submit --platform android
```

## Database Deployment

### Supabase Setup

1. **Create Project**
   - Sign up at supabase.com
   - Create new project
   - Note project URL and API keys

2. **Database Schema**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  coordinates POINT,
  is_provider BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates POINT,
  budget TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[],
  urgency TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'posted',
  customer_id UUID REFERENCES users(id),
  provider_id UUID REFERENCES users(id),
  estimated_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
```

3. **Environment Configuration**
```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Monitoring & Analytics

### Error Tracking

1. **Sentry Integration**
```bash
npm install @sentry/react-native
```

2. **Configuration**
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
});
```

### Performance Monitoring

1. **Analytics Setup**
```typescript
// Analytics configuration
import { Analytics } from '@segment/analytics-react-native';

const analytics = new Analytics({
  writeKey: process.env.EXPO_PUBLIC_SEGMENT_KEY,
});
```

2. **Key Metrics to Track**
   - User registration/login
   - Job posting completion
   - Bid submission rates
   - Message response times
   - App crashes and errors

## Security Considerations

### API Security

1. **Rate Limiting**
   - Implement request throttling
   - Monitor for abuse patterns

2. **Data Validation**
   - Server-side input validation
   - SQL injection prevention
   - XSS protection

3. **Authentication**
   - JWT token management
   - Secure session handling
   - Password encryption

### Privacy Compliance

1. **GDPR/POPIA Compliance**
   - Data minimization
   - User consent management
   - Right to deletion

2. **Data Encryption**
   - HTTPS everywhere
   - Database encryption at rest
   - Secure file storage

## Performance Optimization

### Web Performance

1. **Bundle Optimization**
```javascript
// webpack.config.js optimizations
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

2. **Image Optimization**
   - WebP format support
   - Lazy loading implementation
   - CDN integration

3. **Caching Strategy**
   - Service worker implementation
   - API response caching
   - Static asset caching

### Mobile Performance

1. **Bundle Size Reduction**
   - Tree shaking
   - Code splitting
   - Unused dependency removal

2. **Memory Management**
   - Image memory optimization
   - Component unmounting
   - Memory leak prevention

## Backup & Recovery

### Database Backups

1. **Automated Backups**
   - Daily database snapshots
   - Point-in-time recovery
   - Cross-region replication

2. **File Storage Backups**
   - Image and document backups
   - Version control for assets
   - Disaster recovery procedures

### Deployment Rollback

1. **Version Control**
   - Git tag releases
   - Deployment history tracking
   - Quick rollback procedures

2. **Blue-Green Deployment**
   - Zero-downtime deployments
   - Traffic switching capability
   - Health check monitoring

## Maintenance

### Regular Updates

1. **Dependency Updates**
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update
```

2. **Security Patches**
   - Regular security audits
   - Vulnerability scanning
   - Patch management process

### Monitoring

1. **Health Checks**
   - API endpoint monitoring
   - Database connection checks
   - Third-party service status

2. **Alerting**
   - Error rate thresholds
   - Performance degradation alerts
   - Service downtime notifications

This deployment guide ensures a robust, scalable, and secure deployment of the PieceJob application across all target platforms.