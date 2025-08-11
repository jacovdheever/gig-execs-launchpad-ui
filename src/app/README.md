# Functional App Structure

This directory contains the functional business logic for GigExecs, separate from the marketing site.

## 📁 Directory Structure

```
src/app/
├── auth/                    # Authentication pages
│   ├── login.tsx          # Login form
│   └── register.tsx       # Registration form
├── dashboard/              # Protected dashboard area
│   ├── layout.tsx         # Dashboard layout with sidebar
│   └── index.tsx          # Main dashboard page
└── README.md              # This file
```

## 🔐 Authentication Flow

### Login (`/auth/login`)
- Clean, simple login form
- Email/password authentication
- Form validation and error handling
- Links to registration and password reset

### Registration (`/auth/register`)
- User type selection (Consultant/Client)
- Comprehensive form validation
- Conditional fields based on user type
- Terms and conditions acceptance

## 🎯 Dashboard System

### Layout (`/dashboard/layout.tsx`)
- Responsive sidebar navigation
- Mobile-friendly hamburger menu
- User type-specific navigation items
- Logout functionality

### Main Dashboard (`/dashboard/index.tsx`)
- Welcome section with user type
- Key metrics and statistics
- Quick action buttons
- Recent projects overview
- Profile completeness indicator

## 🎨 Design System

### Brand Colors
- **Primary**: `#012E46` (Dark blue)
- **Secondary**: `#4885AA` (Light blue)
- **Accent**: `#CC9B0A` (Gold)

### Components Used
- **shadcn/ui**: Card, Button, Input, Label, Badge, Alert
- **Lucide Icons**: Consistent iconography
- **Tailwind CSS**: Utility-first styling

## 🚀 Integration Points

### With Marketing Site
- Seamless navigation between marketing and app
- Consistent branding and design language
- Shared header/footer components

### With Supabase (TODO)
- Authentication system
- User management
- Database integration
- Real-time features

## 📱 Responsive Design

- **Mobile-first** approach
- **Sidebar collapse** on mobile
- **Touch-friendly** interactions
- **Consistent spacing** across devices

## 🔧 Development Notes

### Current Status
- ✅ UI components created
- ✅ Routing structure implemented
- ✅ Mock authentication state
- 🚧 Supabase integration pending
- 🚧 Real data integration pending

### Next Steps
1. **Implement Supabase Auth**
2. **Connect to real database**
3. **Add more dashboard pages**
4. **Implement file uploads**
5. **Add real-time messaging**

### Testing
- Test responsive behavior on mobile/desktop
- Verify form validation
- Check navigation flows
- Test protected route access

## 🎯 Key Features

- **Role-based access** (Consultant vs Client)
- **Clean, professional UI** matching brand
- **Responsive design** for all devices
- **Form validation** and error handling
- **Consistent navigation** experience
- **Scalable architecture** for future features

