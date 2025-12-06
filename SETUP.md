# AI Vocabulary Learning Assistant - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- OpenAI API key
- Git

## Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd vocab-voice-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

#### Backend Environment (.env)
```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vocab-voice-app
JWT_SECRET=your-super-secret-jwt-key-here
OPENAI_API_KEY=your-openai-api-key-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment
```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

### 3. Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Create database (automatic on first connection)
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://mongodb.com/atlas
2. Create cluster and get connection string
3. Update MONGODB_URI in backend/.env

### 4. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 5. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## Production Deployment

### Option 1: Render + Netlify (Recommended)

#### Backend on Render
1. Create account at https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment Variables:
     ```
     NODE_ENV=production
     MONGODB_URI=<your-mongodb-connection-string>
     JWT_SECRET=<generate-secure-secret>
     OPENAI_API_KEY=<your-openai-key>
     CORS_ORIGIN=https://your-frontend-domain.netlify.app
     ```

#### Frontend on Netlify
1. Create account at https://netlify.com
2. Connect GitHub repository
3. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. Environment Variables:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Railway Deployment

#### Backend
1. Create account at https://railway.app
2. Create new project from GitHub
3. Add MongoDB plugin
4. Configure environment variables
5. Deploy

#### Frontend
1. Build locally: `cd frontend && npm run build`
2. Deploy dist folder to Netlify/Vercel

## API Keys Setup

### OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create new API key
3. Add to environment variables
4. Ensure billing is set up for Whisper API usage

### MongoDB Connection
1. Local: `mongodb://localhost:27017/vocab-voice-app`
2. Atlas: Get connection string from MongoDB Atlas dashboard
3. Ensure IP whitelist includes your deployment servers

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Image upload and OCR extraction
- [ ] Audio recording and playback
- [ ] Speech recognition and evaluation
- [ ] Quiz flow and progress tracking
- [ ] Results display and statistics

## Troubleshooting

### Common Issues

#### OCR Not Working
- Check image format (JPEG/PNG only)
- Ensure image has clear, readable text
- Verify file size < 5MB

#### Audio Recording Issues
- Check browser permissions for microphone
- Use HTTPS in production (required for audio)
- Test with different browsers

#### API Connection Errors
- Verify CORS settings
- Check API URL configuration
- Ensure backend is running and accessible

#### Database Connection Issues
- Verify MongoDB connection string
- Check network connectivity
- Ensure database user has proper permissions

### Performance Optimization

#### Backend
- Enable MongoDB indexes
- Implement request caching
- Use CDN for static files
- Monitor API response times

#### Frontend
- Enable service worker caching
- Optimize image sizes
- Use lazy loading for components
- Minimize bundle size

## Security Considerations

### Production Checklist
- [ ] Use HTTPS everywhere
- [ ] Secure JWT secret (32+ characters)
- [ ] Enable CORS only for trusted domains
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Regular security updates

### API Security
- JWT token expiration (7 days default)
- Request rate limiting (100 req/15min)
- File upload restrictions (5MB, specific types)
- Input validation and sanitization

## Monitoring and Maintenance

### Health Checks
- Backend: `/health` endpoint
- Database connectivity
- External API availability (OpenAI)

### Logging
- Application logs in production
- Error tracking (consider Sentry)
- Performance monitoring

### Backup Strategy
- Regular database backups
- User data export functionality
- Disaster recovery plan

## Support

For issues and questions:
1. Check this documentation
2. Review error logs
3. Test with minimal example
4. Check API status pages (OpenAI, MongoDB)

## Version Updates

### Backend Updates
```bash
cd backend
npm update
npm audit fix
```

### Frontend Updates
```bash
cd frontend
npm update
npm audit fix
```

### Database Migrations
- Schema changes require careful planning
- Test migrations on staging first
- Backup before major updates