# AI Companion Platform

A powerful AI companion platform built with Next.js 14, featuring real-time conversations, voice interactions, and comprehensive admin capabilities.

## 🌟 Features

### User Features
- 🤖 AI Companions with unique personalities
- 💬 Real-time chat with context awareness
- 🎙️ Voice interactions and speech synthesis
- 📸 Image analysis and visual understanding
- 🌓 Dark/Light theme support
- 🔒 Secure authentication

### Admin Features
- 👥 User management
- 📊 Analytics dashboard
- 🛡️ Role-based access control
- 📝 Audit logging
- ⚙️ System configuration
- 🔍 Content moderation

### Technical Features
- 🔐 GDPR compliance
- 📈 Rate limiting
- 🚀 Performance optimization
- 🛡️ Security best practices
- 📱 Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Auth**: NextAuth.js
- **Database**: PostgreSQL with Prisma
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **AI**: Google Vertex AI
- **Charts**: Recharts
- **Animation**: Framer Motion

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL
- Google Cloud Project (for AI features)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-companion
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables:
   - Database connection
   - NextAuth configuration
   - Google AI API credentials
   - Admin credentials

4. **Initialize the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Create admin user**
   ```bash
   npm run admin:init
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
├── app/
│   ├── (admin)/        # Admin routes
│   ├── (auth)/         # Authentication routes
│   ├── (dashboard)/    # User dashboard routes
│   ├── api/            # API routes
│   └── page.tsx        # Landing page
├── components/
│   ├── admin/          # Admin components
│   ├── chat/           # Chat components
│   ├── dashboard/      # Dashboard components
│   └── ui/             # UI components
├── lib/
│   ├── ai/             # AI service implementations
│   ├── middleware/     # Custom middleware
│   └── services/       # Business logic
├── prisma/
│   └── schema.prisma   # Database schema
└── scripts/
    └── admin-init.ts   # Admin initialization
```

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Secure password hashing
- CSRF protection
- XSS prevention

## 🌐 API Documentation

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/logout`

### User Management
- GET `/api/users`
- POST `/api/users`
- PATCH `/api/users/:id`
- DELETE `/api/users/:id`

### Admin Routes
- GET `/api/admin/users`
- GET `/api/admin/analytics`
- GET `/api/admin/audit-logs`
- POST `/api/admin/settings`

## 🔐 GDPR Compliance

- User data export
- Right to be forgotten
- Consent management
- Data retention policies
- Audit logging
- Privacy by design

## 📈 Performance

- Image optimization
- Code splitting
- Lazy loading
- Caching strategies
- Database indexing
- Rate limiting

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@example.com or join our Discord channel.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Vertex AI](https://cloud.google.com/vertex-ai)