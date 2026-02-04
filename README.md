# Enterprise Technician Portal

A production-grade Next.js application for external technicians to access jobs via QR login.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** - Full type safety
- **shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **TanStack Query** - API state management (ready to integrate)
- **Zustand** - Global state management
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **Cloudinary** - Image uploads

## Features

### Implemented
- QR Code Login with JWT authentication
- Session management with Zustand
- Jobs listing page
- Job detail page
- MongoDB integration for sessions and feedback
- Professional enterprise UI design

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env.local` and fill in your values:

```bash
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
  layout.tsx              # Root layout
  page.tsx                # Home (redirects to login)
  login/
    page.tsx              # QR Login page
  jobs/
    page.tsx              # Jobs listing
    [jobId]/
      page.tsx            # Job details

components/
  ui/                     # shadcn components
  qr/
    QrScanner.tsx         # QR scanner UI
  layout/
    AppHeader.tsx         # Application header

lib/
  api.ts                  # API client wrapper
  auth.ts                 # JWT helpers
  db.ts                   # MongoDB connection
  cloudinary.ts           # Cloudinary config

store/
  session.store.ts        # Zustand session store

server/
  models/
    Session.ts            # Session model
    Feedback.ts           # Feedback model
  services/
    auth.service.ts       # Authentication service
```

## API Routes

### POST /api/auth/qr-login
Authenticates a technician via QR code token.

**Request:**
```json
{
  "token": "jwt_token_from_qr_code"
}
```

**Response:**
```json
{
  "accessToken": "session_access_token",
  "vendorId": "vendor_123",
  "plantId": "plant_456"
}
```

## Usage

### QR Login Flow

1. Technician scans QR code at reception
2. QR code contains JWT token with vendorId and plantId
3. App extracts token from URL parameter `?token=...`
4. Token is validated and new session is created
5. User is redirected to jobs page

### Session Management

Sessions are stored in:
- **MongoDB** - Server-side session tracking
- **Zustand** - Client-side state management (persisted to localStorage)

Sessions expire after 8 hours.

## Extending the Application

### Adding TanStack Query

The `lib/api.ts` wrapper is ready for TanStack Query integration:

```tsx
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => apiClient.get('/jobs'),
  });
}
```

### Adding New Pages

Follow the established pattern in the `app/` directory with proper authentication checks.

### Adding New Models

Create new Mongoose models in `server/models/` following the Session and Feedback examples.

## Security Features

- JWT token validation
- Session expiration (8 hours)
- MongoDB auto-cleanup of expired sessions
- Environment variable protection
- Secure authentication flow

## Production Deployment

This application is ready for production deployment on Vercel:

1. Connect your MongoDB instance
2. Add environment variables in Vercel dashboard
3. Deploy

## License

Enterprise use only.
