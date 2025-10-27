# HealthPool

HealthPool is a community-driven funding platform for healthy restaurant meals. Restaurant owners can create funding deals with discounted prices, and users can participate when target goals are met. The platform also includes community features for sharing health-related information.

## Features

### Funding Deals
- **Browse Deals**: View all available funding deals with real-time progress tracking
- **Deal Details**: See detailed information about each funding deal including restaurant info, menu items, and participation status
- **Subscribe to Deals**: Participate in funding deals and track your subscriptions
- **Smart Filtering**: Automatically filters active deals with remaining time
- **Progress Indicators**: Visual progress bars and urgency badges (expiring soon, almost full)

### Community
- **Post List**: Browse community posts with pagination
- **Post Detail**: Read full posts with view counts and comment sections
- **Comments**: Write and view comments on posts
- **Rich UI**: Beautiful card-based layout with responsive design

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Deployment**: Vercel-ready

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (local or hosted)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/health-pool.git
cd health-pool
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# App
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Set up the database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
health-pool/
├── app/
│   ├── api/                    # API routes
│   │   ├── deals/              # Funding deal endpoints
│   │   │   ├── route.ts        # GET /api/deals (list), POST /api/deals (create)
│   │   │   └── [dealId]/
│   │   │       ├── route.ts    # GET /api/deals/[dealId] (detail)
│   │   │       └── subscribe/
│   │   │           └── route.ts # POST /api/deals/[dealId]/subscribe
│   │   └── posts/              # Community post endpoints
│   │       ├── route.ts        # GET /api/posts (list), POST /api/posts (create)
│   │       └── [postId]/
│   │           ├── route.ts    # GET /api/posts/[postId], PUT, DELETE
│   │           └── comments/
│   │               └── route.ts # POST /api/posts/[postId]/comments, GET
│   ├── deals/                  # Deals pages
│   │   ├── page.tsx            # Deals list page
│   │   └── [dealId]/
│   │       └── page.tsx        # Deal detail page
│   ├── community/              # Community pages
│   │   ├── page.tsx            # Post list page
│   │   └── [postId]/
│   │       └── page.tsx        # Post detail page
│   ├── layout.tsx              # Root layout with Header/Footer
│   └── page.tsx                # Homepage
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Site footer
│   ├── deals/
│   │   ├── DealCard.tsx        # Deal card component
│   │   └── SubscribeButton.tsx # Subscribe button with toast
│   └── community/
│       └── CommentForm.tsx     # Comment submission form
├── lib/
│   └── prisma.ts               # Prisma client singleton
├── prisma/
│   └── schema.prisma           # Database schema
├── types/
│   └── api.ts                  # TypeScript type definitions
└── public/                     # Static assets
```

## Database Schema

The application uses 7 main models:

- **User**: User accounts with authentication
- **Restaurant**: Restaurant information
- **MenuItem**: Menu items from restaurants
- **FundingDeal**: Funding deals with target goals
- **Subscription**: User participation in funding deals
- **Post**: Community posts
- **Comment**: Comments on posts

See `prisma/schema.prisma` for the complete schema definition.

## API Endpoints

### Funding Deals

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/deals` | List all funding deals (with `?available=true` filter) |
| `POST` | `/api/deals` | Create a new funding deal (owner only) |
| `GET` | `/api/deals/[dealId]` | Get funding deal details |
| `POST` | `/api/deals/[dealId]/subscribe` | Subscribe to a funding deal |
| `GET` | `/api/deals/[dealId]/subscribe` | Check subscription status |

### Community Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/posts` | List all posts (with pagination) |
| `POST` | `/api/posts` | Create a new post |
| `GET` | `/api/posts/[postId]` | Get post details (auto-increments views) |
| `PUT` | `/api/posts/[postId]` | Update a post |
| `DELETE` | `/api/posts/[postId]` | Delete a post |
| `GET` | `/api/posts/[postId]/comments` | Get comments for a post |
| `POST` | `/api/posts/[postId]/comments` | Add a comment to a post |

## Key Features

### Atomic Transactions
All critical operations (subscriptions, view counts) use Prisma transactions to ensure data consistency.

### Server-Side Rendering
Pages are rendered on the server for optimal SEO and performance with `cache: 'no-store'` for real-time data.

### Type Safety
Comprehensive TypeScript types in `types/api.ts` ensure type safety across the entire application.

### Responsive Design
Mobile-first design using Tailwind CSS breakpoints (`sm`, `md`, `lg`).

### Real-time Updates
Client components use `router.refresh()` to show updated data after mutations.

### Smart Status Management
Funding deals automatically update status to `SUCCESS` when target goals are reached.

## Development

### Database Management

```bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database
npx prisma migrate reset

# Create a new migration
npx prisma migrate dev --name your_migration_name
```

### Build for Production

```bash
npm run build
npm run start
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/healthpool` |
| `NEXT_PUBLIC_API_URL` | Base URL for API calls | `http://localhost:3000` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@healthpool.com or open an issue on GitHub.
