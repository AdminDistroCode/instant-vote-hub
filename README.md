# 🗳️ FlashPoll - Real-time Polling Application

## Overview
FlashPoll is a modern, responsive web application that enables users to create, manage, and participate in real-time polls. Built with React and Supabase, it provides a seamless polling experience with instant vote tracking and user authentication.

**Live Demo**: [https://instant-vote-hub.lovable.app/]

---

## ✨ Features

### Core Functionality
- **Create Polls**: Design custom polls with multiple options
- **Real-time Voting**: Instant vote counting and result updates
- **Poll Management**: View, manage, and close your own polls
- **Public Poll Discovery**: Browse all active polls from other users
- **User Authentication**: Secure login/logout with Supabase Auth

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live vote counts without page refresh
- **Modern UI**: Clean interface built with shadcn/ui components
- **Toast Notifications**: User feedback for all actions
- **Protected Routes**: Secure poll management for authenticated users

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI component library

### Backend & Database
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database with real-time subscriptions
- **Row Level Security** - Database-level security policies

### State Management & Routing
- **TanStack Query** - Server state management
- **React Router** - Client-side routing
- **React Context** - Authentication state management

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdminDistroCode/instant-vote-hub.git
   cd instant-vote-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   The project includes a `.env` file with the Supabase configuration. For local development, you can:
   
   - **Use existing config**: The current `.env` file works out of the box
   - **Use your own Supabase project**: Replace the values in `.env` with your own:
   
   ```bash
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   
   See `.env.example` for the required environment variables.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📱 Usage Guide

### For Visitors (No Account Required)
- Browse public polls on the home page
- Vote on any active poll
- View real-time results after voting

### For Registered Users
1. **Sign Up/Login** - Click "Login" to create an account
2. **Create Polls** - Use "Create Poll" to design custom polls
3. **Manage Polls** - Access "My Polls" to view and close your polls
4. **Track Performance** - Monitor vote counts and engagement

---

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation bar
│   ├── PollCard.tsx    # Poll display component
│   └── ...
├── pages/              # Route components
│   ├── Home.tsx        # Landing page with public polls
│   ├── CreatePoll.tsx  # Poll creation form
│   ├── MyPolls.tsx     # User's poll management
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication context
│   └── use-toast.ts    # Toast notifications
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── lib/                # Utility functions
```

---

## 🔒 Security Features

### Authentication
- **Supabase Auth** - Industry-standard authentication
- **Protected Routes** - Secure poll management
- **Session Management** - Automatic token refresh

### Database Security
- **Row Level Security (RLS)** - Users can only manage their own polls
- **Secure APIs** - All database queries use Supabase's secure client
- **Input Validation** - Form validation with Zod schemas

---

## 🎨 Design System

### Color Palette
- **Primary**: Brand gradient (blue to purple)
- **Secondary**: Muted tones for backgrounds
- **Accent**: Highlight colors for interactive elements

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

### Typography
- **Headings**: Bold, gradient text for emphasis
- **Body**: Clean, readable fonts with proper contrast

---

## 📊 Database Schema

### Core Tables
- **polls** - Poll metadata and configuration
- **poll_options** - Individual poll choices
- **votes** - User voting records
- **profiles** - Extended user information

### Key Features
- **Automatic timestamps** - Created/updated tracking
- **UUID primary keys** - Secure, unique identifiers
- **Foreign key constraints** - Data integrity

---

## 🚢 Deployment

### Lovable Platform (Recommended)
1. Open your [Lovable Project](https://lovable.dev/projects/0853b0d7-1bd5-4527-98ba-07490c14da57)
2. Click "Share" → "Publish"
3. Your app will be live instantly

### Custom Domain
- Navigate to Project → Settings → Domains
- Connect your custom domain (requires paid plan)
- Follow the DNS configuration guide

---

## 🛠️ Bug Fixes Documentation – FlashPoll (v1.0.0)

### Overview
This document outlines the major bugs that were discovered and resolved in the FlashPoll application during initial development and user feedback iterations.

---

### Critical Fixes Implemented

#### 1. Overlapping UI Elements in My Polls Page
**File**: `src/pages/MyPolls.tsx`, `src/components/PollCard.tsx`
**Severity**: High
**Status**: ✅ Fixed

##### Problem
Poll status badges and action buttons were overlapping in the My Polls page, making it impossible for users to:
- Read poll status clearly
- Access the close poll functionality
- Properly manage their polls on mobile devices

##### Root Cause
Insufficient spacing and z-index conflicts between the default poll card layout and the poll management controls overlay.

##### Fix
Restructured the poll card layout to conditionally hide default status badges when management controls are displayed:
```typescript
// Added hideStatus prop to PollCard component
const PollCard = ({ poll, hideStatus = false, children }: PollCardProps) => {
  // Conditional rendering of status badge
  {!hideStatus && (
    <Badge variant={poll.is_active ? "default" : "secondary"}>
      {poll.is_active ? "Active" : "Closed"}
    </Badge>
  )}
}
```

##### Impact
- ✅ Clear visibility of poll management controls
- ✅ Improved user experience on mobile devices
- ✅ Proper separation of status display and action buttons

---

#### 2. Duplicate Active Status Buttons
**File**: `src/pages/MyPolls.tsx`
**Severity**: Medium
**Status**: ✅ Fixed

##### Problem
Users were seeing duplicate "Active" status indicators when viewing their polls:
- One from the default PollCard component
- Another from the poll management section
This created visual confusion and poor UX.

##### Root Cause
The MyPolls component was rendering both the default PollCard status badge and custom management controls without hiding the original status display.

##### Fix
Implemented the `hideStatus` prop system to control badge visibility:
```typescript
// In MyPolls.tsx
<PollCard key={poll.id} poll={poll} hideStatus>
  <div className="flex items-center justify-between gap-2">
    <Badge variant={poll.is_active ? "default" : "secondary"}>
      {poll.is_active ? "Active" : "Closed"}
    </Badge>
    {poll.is_active && (
      <Button onClick={() => handleClosePoll(poll.id)}>
        Close Poll
      </Button>
    )}
  </div>
</PollCard>
```

##### Impact
- ✅ Single, clear status indicator per poll
- ✅ Cleaner visual hierarchy
- ✅ Reduced user confusion

---

#### 3. Mobile Responsiveness Issues
**File**: `src/components/Navigation.tsx`, `src/pages/MyPolls.tsx`
**Severity**: Medium
**Status**: ✅ Fixed

##### Problem
The application was not properly responsive across different device sizes, causing:
- Navigation elements to overflow on small screens
- Poor layout on tablets and mobile devices
- Inconsistent spacing and button sizes

##### Root Cause
Missing responsive Tailwind CSS classes and inconsistent breakpoint usage across components.

##### Fix
Implemented comprehensive responsive design patterns:
```typescript
// Navigation responsive improvements
<Button variant="outline" size="sm">
  <List className="w-4 h-4" />
  <span className="hidden md:inline ml-2">My Polls</span>
</Button>

// MyPolls page responsive grid
<div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
```

##### Impact
- ✅ Consistent experience across all device sizes
- ✅ Proper text and button scaling on mobile
- ✅ Optimized layout for tablet and desktop viewing

---

## 🤝 Contributing

This project is built with Lovable's AI-powered development platform. To contribute:

1. **Use Lovable** - Make changes through the [Lovable interface](https://lovable.dev/projects/0853b0d7-1bd5-4527-98ba-07490c14da57)
2. **Local Development** - Clone and edit locally, then push changes
3. **GitHub Integration** - Connect your GitHub account for version control

---

## 📋 License

This project is created with Lovable and follows their terms of service.

---

## 🆘 Support

- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- **Community**: [Discord Server](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Video Tutorials**: [YouTube Playlist](https://www.youtube.com/watch?v=9KHLTZaJcR8&list=PLbVHz4urQBZkJiAWdG8HWoJTdgEysigIO)

---

*Built with ❤️ using Lovable AI Platform*
