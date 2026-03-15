# CivicTrack Backend

A full-stack civic complaint management system built with Node.js, Express, Prisma ORM, and PostgreSQL. Handles user authentication, ticket management with role-based access, and real-time updates via Server-Sent Events (SSE).

![Node.js](https://img.shields.io/badge/Node.js-22.x-green)
![Express](https://img.shields.io/badge/Express-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.x-teal)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![JWT](https://img.shields.io/badge/JWT-Auth-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Features

- **Authentication**: JWT-based register/login with secure httpOnly cookies
- **Role-based Access**: CITIZEN and ADMIN roles with protected routes
- **Ticket Management**: Create, read, update ticket status and priority
- **Real-time Updates**: Server-Sent Events (SSE) for live ticket status changes
- **RESTful API**: Clean API design with Express routes

## Tech Stack

- **Runtime**: Node.js 22.x
- **Framework**: Express.js 5.x
- **ORM**: Prisma 7.x
- **Database**: PostgreSQL
- **Auth**: JWT (jsonwebtoken)
- **Language**: TypeScript

## Folder Structure

```
civictrack-backend/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma       # Prisma schema
├── src/
│   ├── controllers/         # Route handlers
│   │   ├── auth.controller.ts
│   │   └── ticket.controller.ts
│   ├── middleware/          # Express middleware
│   │   └── auth.middleware.ts
│   ├── routes/             # API routes
│   │   ├── auth.routes.ts
│   │   ├── ticket.routes.ts
│   │   └── sse.routes.ts
│   ├── services/            # Business logic
│   │   ├── prisma.ts
│   │   └── sseClients.ts
│   └── server.ts            # Entry point
├── .env                     # Environment variables
├── Dockerfile               # Docker configuration
├── package.json
└── tsconfig.json
```

## Local Setup

```bash
# Clone the repository
git clone https://github.com/beingRonit/civictrack-backend.git
cd civictrack-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your values

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/civictrack?schema=public"

# JWT secret for token signing (generate a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Frontend URL for CORS (optional for local development)
FRONTEND_URL="http://localhost:3000"

# Server port (default: 5000)
PORT=5000
```

## API Routes

### Authentication

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/logout` | Yes | Logout user |
| GET | `/api/auth/me` | Yes | Get current user |

### Tickets

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| GET | `/api/tickets` | Yes | Get all tickets |
| GET | `/api/tickets/:id` | Yes | Get single ticket |
| POST | `/api/tickets` | Yes | Create new ticket |
| PATCH | `/api/tickets/:id/status` | Yes | Update ticket status |
| PATCH | `/api/tickets/:id/priority` | Yes | Update ticket priority |
| PATCH | `/api/tickets/:id/approval` | Yes | Update approval status |

### Server-Sent Events

| Method | Route | Auth Required | Description |
|--------|-------|---------------|-------------|
| GET | `/api/sse` | Yes | Real-time ticket updates stream |

## SSE Endpoint

The SSE endpoint provides real-time updates when ticket status changes. Clients connect to receive live notifications.

```javascript
// Example client connection
const eventSource = new EventSource('https://your-api.com/api/sse');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Ticket update:', data);
};
```

## Deployment (Railway)

1. **Create a Railway project** and add a PostgreSQL database
2. **Connect your GitHub repository** to Railway
3. **Add environment variables** in Railway dashboard:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `JWT_SECRET` (generate a secure string)
   - `FRONTEND_URL` (your Vercel frontend URL)
4. **Deploy** - Railway will automatically build and deploy

### Using Dockerfile

The included Dockerfile handles the build process:
- Installs dependencies
- Compiles TypeScript
- Starts the Node.js server

## License

MIT License - feel free to use this project for learning or portfolio purposes.

---

Built with ❤️ for civic engagement
