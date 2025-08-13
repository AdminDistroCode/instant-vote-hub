# 🗳️ FlashPoll - Real-time Polling Application

## Overview
FlashPoll is a modern, responsive web application that enables users to create, manage, and participate in real-time polls. Built with React and Supabase, it provides a seamless polling experience with instant vote tracking and user authentication.

**Live Demo**: [https://lovable.dev/projects/0853b0d7-1bd5-4527-98ba-07490c14da57](https://lovable.dev/projects/0853b0d7-1bd5-4527-98ba-07490c14da57)

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

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
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