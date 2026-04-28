# FitTrack Pro - Fitness Tracker Application

A comprehensive fitness tracking and community platform built with Vue 3 and Express, where users can log their daily workouts, track their progress, manage fitness goals, and connect with friends to share their fitness journey.

## 🌐 Live Site

**[FitTrack Pro - Live Application](https://fittrack-pro-oyxf.onrender.com)**

Visit the live site to experience the full fitness tracking application!

---

## 📋 About the App

FitTrack Pro is a modern full-stack fitness tracking application that enables users to:

- **Track Activities**: Log various types of exercises (Running, Cycling, Swimming, Walking, Gym, Yoga) with duration and calories burned
- **Monitor Progress**: View comprehensive statistics including total activities, duration, calories, and favorite activity type
- **Visual Analytics**: Interactive activity breakdown charts to analyze workout patterns
- **Friend Network**: Connect with other fitness enthusiasts and view their activity feeds
- **User Profiles**: Manage personal fitness information including age, height, weight, and role
- **Secure Authentication**: JWT-based authentication with secure password verification
- **Responsive Design**: Fully responsive interface optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Instant feedback on login, activity creation, and friend connections

---

## 🛠 Tech Stack

### Frontend
- **Vue 3.5.29** - Progressive JavaScript framework for building UI
- **Vite 7.3.1** - Next-generation build tool and dev server
- **TypeScript 5.9.3** - Type-safe JavaScript development
- **Pinia 3.0.4** - State management for Vue applications
- **Bulma 1.0.4** - Modern CSS framework for styling
- **Font Awesome 7.2.0** - Icon library for UI elements
- **Vue Router** - Client-side routing

### Backend
- **Express 5.2.1** - Node.js web application framework
- **TypeScript** - Type-safe backend development
- **jsonwebtoken** - JWT authentication implementation
- **tsx** - TypeScript execution for Node.js

### Database
- **Supabase** - PostgreSQL database hosting and management
- **PostgreSQL** - Relational database for data persistence

---

## 📁 Project Structure

```
fitness-tracker-application/
├── client/                           # Frontend Vue application
│   ├── src/
│   │   ├── components/              # Reusable Vue components
│   │   │   ├── StatCard.vue        # Statistics display card
│   │   │   ├── ActivityBreakdown.vue # Chart visualization
│   │   │   ├── ActivityForm.vue    # Form to add activities
│   │   │   ├── RecentStatsTable.vue # Activity table
│   │   │   ├── FriendList.vue      # Friends list component
│   │   │   ├── FriendActivityFeed.vue # Friend activities display
│   │   │   └── NavBar.vue          # Navigation bar
│   │   ├── stores/                  # Pinia state management
│   │   │   └── auth.ts             # Authentication store
│   │   ├── services/
│   │   │   └── myFetch.ts          # API client with JWT injection
│   │   ├── views/                   # Page components
│   │   │   ├── LoginView.vue       # Login page
│   │   │   ├── DashboardView.vue   # Main dashboard
│   │   │   ├── ActivitiesView.vue  # Activities management
│   │   │   ├── FriendsView.vue     # Friends page
│   │   │   └── StatsView.vue       # Statistics page
│   │   ├── App.vue                 # Root component
│   │   ├── main.ts                 # Application entry point
│   │   ├── types/                  # TypeScript type definitions
│   │   └── assets/
│   │       ├── main.css            # Global and component styles
│   │       └── base.css            # CSS reset and base styles
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vite.config.ts               # Vite build configuration
│   └── env.d.ts                     # Environment variable types
│
├── server/                          # Express backend
│   ├── controllers/
│   │   ├── auth.ts                 # Authentication endpoints + JWT utilities
│   │   ├── users.ts                # User management endpoints
│   │   ├── activities.ts           # Activity CRUD endpoints
│   │   └── friends.ts              # Friend connection endpoints
│   ├── models/
│   │   ├── users.ts                # User database operations
│   │   ├── activities.ts           # Activity database operations
│   │   ├── friends.ts              # Friendship database operations
│   │   ├── supabase.ts             # Database connection & utilities
│   │   └── seed_data.ts            # Demo data seeding script
│   ├── middleware/
│   │   └── auth.ts                 # JWT authentication middleware
│   ├── types/
│   │   └── index.ts                # Shared TypeScript type definitions
│   ├── tools/
│   │   └── scratch.http            # API testing endpoints
│   ├── index.ts                     # Express app setup and routing
│   └── tsconfig.json                # Backend TypeScript config
│
├── .env                             # Environment variables (server)
├── .env.local                       # Environment variables (client)
├── package.json                     # Root workspace configuration
├── tsconfig.server.json             # Backend TypeScript configuration
└── README.md                        # This file
```


## 📚 Key Learning Outcomes

Through building FitTrack Pro, we learned:

1. **Full-Stack Development**: Building complete applications with frontend and backend
2. **Vue 3 Composition API**: Modern Vue development patterns and state management
3. **TypeScript**: Type-safe JavaScript for large applications
4. **REST API Design**: Proper HTTP methods, status codes, and response formats
5. **JWT Authentication**: Secure token-based authentication mechanisms
6. **Database Design**: Relational database schema and SQL queries
7. **CSS Frameworks**: Using Bulma for rapid UI development
8. **Monorepo Structure**: Managing multiple workspaces in a single repository

---

## 🔄 Development Workflow

1. **Start servers**: `npm run dev:all`
2. **Make changes** to frontend or backend code
3. **Test in browser** or with API client (REST Client extension)
4. **Use scratch.http** for testing API endpoints with JWT tokens
5. **Check console** for error messages and debugging information

---

