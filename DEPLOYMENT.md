# Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

1. **Create account** at https://railway.app

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

4. **Add start script** to package.json:
   ```json
   "scripts": {
     "start": "node server/index.js",
     "build": "vite build"
   }
   ```

5. **Set environment variables** in Railway dashboard:
   - `NODE_ENV=production`
   - `PORT=3001`

### Option 2: Vercel (Frontend) + Railway (Backend)

**Frontend on Vercel:**
```bash
npm install -g vercel
vercel
```

**Backend on Railway:**
Follow Option 1 for backend only

**Update API URL:**
- Edit `src/services/api.js`
- Change `API_BASE` to your Railway URL

### Option 3: DigitalOcean App Platform

1. Push code to GitHub
2. Go to https://cloud.digitalocean.com/apps
3. Click "Create App"
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
6. Deploy

### Option 4: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Create Heroku app**
   ```bash
   heroku create enrollflow-app
   ```

3. **Add Procfile**
   ```
   web: node server/index.js
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## Production Checklist

- [ ] Update WebSocket URL in production
- [ ] Set up proper database (PostgreSQL/MongoDB)
- [ ] Add environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Test on real mobile devices
- [ ] Create backup strategy

## Environment Variables

Create `.env` file:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=your_database_url
CORS_ORIGIN=https://your-frontend-url.com
```

## Database Migration

For production, replace JSON file with real database:

**PostgreSQL:**
```bash
npm install pg
```

**MongoDB:**
```bash
npm install mongodb
```

Update `server/index.js` to use proper database connection.

## Performance Optimization

1. **Enable compression**
   ```bash
   npm install compression
   ```

2. **Add to server/index.js:**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

3. **Set up CDN** for static assets

4. **Enable caching headers**

## Security Hardening

1. **Add helmet**
   ```bash
   npm install helmet
   ```

2. **Add rate limiting**
   ```bash
   npm install express-rate-limit
   ```

3. **Implement authentication**
   - JWT tokens
   - Session management
   - Password hashing

## Monitoring

**Add error tracking:**
```bash
npm install @sentry/node
```

**Add logging:**
```bash
npm install winston
```

## Custom Domain

1. Purchase domain (Namecheap, Google Domains)
2. Add DNS records:
   - A record pointing to server IP
   - CNAME for www subdomain
3. Configure SSL certificate (Let's Encrypt)

## Scaling Considerations

- Use Redis for session storage
- Implement load balancing
- Set up database replication
- Use message queue for background jobs
- Consider serverless functions for API

---

**Need help?** Check platform-specific documentation or reach out for support.
