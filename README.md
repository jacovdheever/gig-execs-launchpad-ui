# GigExecs - Executive Talent Platform

## Project Overview

GigExecs is a premier freelancing platform designed for experienced professionals and businesses. The platform connects senior talent with high-quality global projects through a secure and trusted environment.

**Live URL**: [Netlify Deployment](https://your-netlify-url.netlify.app)  
**GitHub**: [Repository](https://github.com/jacovdheever/gig-execs-launchpad-ui)

## 🚀 Quick Start

### Prerequisites
- Node.js & npm (install with [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

### Development Setup
```sh
# Clone the repository
git clone https://github.com/jacovdheever/gig-execs-launchpad-ui.git

# Navigate to project directory
cd gig-execs-launchpad-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

## How can I edit this code?

### Development Guidelines

**Keep code as simple as possible** - prioritize readability and maintainability over complexity. Use clear, descriptive names and avoid over-engineering solutions.

### Development Setup

Clone the repository and work locally using your preferred IDE (we recommend Cursor):

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Edit a file directly in GitHub

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

### Use GitHub Codespaces

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🎨 Design System & Brand Guidelines

### Color Palette
- **Primary Blue**: `#012E46` (Dark blue for backgrounds)
- **Accent Gold**: `#CC9B0A` (Gold for CTAs and highlights)
- **Secondary Blue**: `#4885AA` (Light blue for secondary buttons)
- **White**: `#FFFFFF` (Text and backgrounds)

### Typography
- **Primary Font**: Montserrat (Bold for headings)
- **Secondary Font**: Open Sans (Regular for body text)
- **Font Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)

### Mobile-First Design Principles
- **Breakpoints**: Mobile-first with responsive design
- **Touch Targets**: Minimum 44px for mobile interactions
- **Typography**: Responsive text sizing (text-sm, text-base, text-lg, text-xl, etc.)

## 📱 Mobile Responsiveness Guidelines

### Key Implementation Notes

#### Header Component
- **Hamburger Menu**: Custom icon with shorter middle bar (3 bars: top/bottom full width, middle half width)
- **Mobile Layout**: Hamburger on left, logo centered, no buttons visible
- **Desktop Layout**: Full navigation with CTA buttons on right
- **Responsive Classes**: `lg:hidden`, `hidden lg:flex`, `flex-1 lg:flex-none`

#### Footer Component
- **Circular Image**: Must be perfect circle (w-64 h-64 mobile, w-80 h-80 desktop)
- **Image Cropping**: Use `object-cover object-center` with `aspectRatio: '1 / 1'`
- **Spacing**: Add `mb-8 lg:mb-0` to prevent overlap with text
- **Layout**: Stacked on mobile, side-by-side on desktop

#### Hero Sections
- **Text Colors**: Mixed dark blue (`#012E46`) and white for visual hierarchy
- **Button Colors**: Dark blue (`#012E46`) for primary CTAs
- **Responsive Heights**: `h-[400px] sm:h-[500px] md:h-[600px] lg:h-[760px]`

### Common Mobile Issues to Avoid
1. **Fixed Widths**: Never use `width: 1440px` - use responsive units
2. **Absolute Positioning**: Avoid `position: absolute` with fixed coordinates
3. **Large Padding**: Don't use `padding: 120px` on mobile
4. **Non-Circular Images**: Ensure images use `rounded-full` with equal width/height

### Responsive Best Practices
```css
/* ✅ Good - Responsive */
className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl"
className="px-4 sm:px-8 md:px-16 lg:px-32"
className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px]"

/* ❌ Bad - Fixed */
style={{ width: 1440, height: 760 }}
style={{ paddingLeft: 120, paddingRight: 120 }}
```

## 🔧 Technical Architecture

### Tech Stack
This project is built with:
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React

### Project Structure
```
src/
├── components/     # Reusable UI components
│   ├── Header.tsx # Navigation with mobile menu
│   ├── Footer.tsx # Footer with circular image
│   ├── Hero.tsx   # Hero sections
│   └── ui/        # shadcn/ui components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
└── assets/        # Static assets
```

### Key Components

#### Header.tsx
- **Mobile Menu**: Custom hamburger icon with state management
- **Responsive Navigation**: Hidden on mobile, visible on desktop
- **Active States**: Dynamic link highlighting based on current route

#### Footer.tsx
- **Circular Image**: Perfect circle with proper aspect ratio
- **Responsive Layout**: Stacked on mobile, grid on desktop
- **CTA Buttons**: Primary and secondary button styles

## 🚀 Deployment

### Netlify Configuration
- **Build Command**: `bun run build` (or `npm run build`)
- **Publish Directory**: `dist`
- **Node Version**: 18
- **Auto-deploy**: Connected to GitHub main branch

### Environment Variables
- Currently no environment variables required
- All configuration is in `netlify.toml`

### Custom Domain
To connect a custom domain to your Netlify deployment, navigate to your Netlify dashboard > Site settings > Domain management.

## 📋 Development Workflow

### Git Workflow
1. **Feature Branches**: Create `feature/description` for new work
2. **Conventional Commits**: Use `feat:`, `fix:`, `docs:` prefixes
3. **Pull Requests**: Review before merging to main
4. **Mobile Testing**: Always test on mobile devices

### Code Quality
- **Simplicity**: Keep code as simple and readable as possible
- **TypeScript**: Strict typing for all components
- **Tailwind**: Use utility classes for styling
- **Responsive**: Mobile-first approach
- **Accessibility**: Proper ARIA labels and semantic HTML

## 🎯 Key Features Implemented

### Mobile Responsiveness
- ✅ Custom hamburger menu with proper icon
- ✅ Responsive header with centered logo
- ✅ Perfect circular footer image
- ✅ Mobile-friendly navigation
- ✅ Responsive typography and spacing

### Design Consistency
- ✅ Brand color implementation
- ✅ Typography hierarchy
- ✅ Button styling consistency
- ✅ Spacing and layout standards

## 🔍 Important Notes

### Image Assets
- **Footer Image**: Must be circular (`/images/Footer.png`)
- **Hero Images**: Responsive background images
- **Favicon**: Multiple sizes for different devices

### Performance Considerations
- **Image Optimization**: Use `object-cover` for proper cropping
- **Lazy Loading**: Implement for large images
- **Bundle Size**: Monitor with Vite build analysis

### Browser Compatibility
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Desktop**: Chrome, Firefox, Safari, Edge
- **Testing**: Test on actual devices, not just dev tools

## 📞 Support & Maintenance

### Common Issues
1. **Circular Image Not Rendering**: Check `aspectRatio` and `object-cover`
2. **Mobile Menu Not Working**: Verify state management and event handlers
3. **Responsive Breakpoints**: Use Tailwind's responsive prefixes
4. **Build Errors**: Check TypeScript types and import statements

### Future Enhancements
- [ ] Add more mobile-responsive pages
- [ ] Implement dark mode
- [ ] Add animations and transitions
- [ ] Optimize for Core Web Vitals
- [ ] Add PWA capabilities

---

**Last Updated**: December 2024  
**Maintained By**: GigExecs Development Team
# Trigger deployment
