# Real Estate App

## Project Overview

The Real Estate App is a modern full-stack web application designed to showcase property listings with an intuitive search and filtering system. The application features a responsive React/Next.js frontend with Tailwind CSS styling, consuming data from a robust .NET backend API with MongoDB integration.

This project has recently undergone a comprehensive redesign and refactoring to enhance user experience, improve code organization, and implement custom hooks for better state management.

## 🚀 Features

### Frontend

- **🏠 Property Listing Page**: Clean, modern grid layout displaying available properties
- **🔍 Advanced Search & Filtering**:
  - **Main Search Bar**: Filter by property name, address, price range, property type, and bedrooms
  - **Sidebar Filters**: Additional filters for house type, rooms, size range, and price range
- **📋 Property Cards**: Display essential info (image, title, address, price, bedrooms, bathrooms, square meters)
- **💖 Favorites System**: Mark properties as favorites with localStorage persistence
- **📱 Responsive Design**: Optimized for all screen sizes using Tailwind CSS
- **🖼️ Optimized Images**: Automatic image optimization with Next.js Image component
- **🎯 Custom Hooks**: Clean state management with reusable hooks
- **📞 Contact Functionality**: Simulated contact system for property owners

### Backend

- **🏗️ Property Management API**: RESTful endpoints for property data
- **🗄️ MongoDB Integration**: NoSQL database for flexible property storage
- **⚙️ Environment Configuration**: Secure environment variable management
- **🔄 API Structure**: Clean, maintainable API architecture

## 🛠️ Technologies Used

### Frontend Technologies

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **UI Components**: Radix UI, Shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

### Backend Technologies

- **Framework**: .NET 8
- **Database**: MongoDB
- **Environment**: DotNetEnv

## 📁 Project Structure

```
real-estate-app/
├── backend/                     # .NET Backend API
│   ├── RealEstate.API/         # Main API project
│   ├── RealEstate.Core/        # Core business logic
│   ├── RealEstate.Infrastructure/ # Data access layer
│   └── RealEstate.Tests/       # Unit and integration tests
├── frontend/                    # Next.js Frontend Application
│   ├── public/                 # Static assets
│   └── src/
│       ├── app/                # Next.js App Router
│       │   ├── globals.css     # Global styles
│       │   ├── layout.tsx      # Root layout
│       │   └── page.tsx        # Main property listing page
│       ├── components/         # Reusable UI components
│       │   ├── header.tsx      # Application header
│       │   ├── filter-sidebar.tsx # Left sidebar filters
│       │   ├── property-card.tsx # Property display card
│       │   ├── property-detail-modal.tsx # Property detail modal
│       │   ├── property-filters-form.tsx # Main search form
│       │   ├── property-grid.tsx # Properties grid layout
│       │   └── ui/             # Base UI components
│       ├── hooks/              # Custom React hooks
│       │   ├── use-contact.ts  # Contact functionality
│       │   ├── use-favorites.ts # Favorites management
│       │   ├── use-property-modal.ts # Modal state management
│       │   ├── use-scroll-lock.ts # Scroll lock utility
│       │   └── use-sidebar-filters.ts # Sidebar filters state
│       ├── providers/          # Context providers
│       ├── services/           # API service layer
│       ├── types/              # TypeScript definitions
│       └── utils/              # Utility functions
└── docs/                       # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version)
- .NET 8 SDK
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/real-estate-app.git
cd real-estate-app
```

### 2. Backend Setup

```bash
cd backend/RealEstate.API

# Restore dependencies
dotnet restore

# Create .env file with MongoDB connection
echo "MONGODB_CONNECTION_STRING=mongodb://localhost:27017/realestate" > .env

# Run the API
dotnet run
```

The API will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📖 Usage

1. **Browse Properties**: View the main property listing page with all available properties
2. **Search & Filter**: Use the search bar and sidebar filters to find specific properties
3. **View Details**: Click on any property card to see detailed information in a modal
4. **Add to Favorites**: Click the heart icon to save properties to your favorites
5. **Contact Owners**: Use the contact button in property details to reach out to property owners

## 🎯 Custom Hooks

The application uses several custom hooks for clean state management:

- **`usePropertyModal`**: Manages property detail modal state
- **`useSidebarFilters`**: Handles sidebar filter state and updates
- **`useFavorites`**: Manages favorite properties with localStorage persistence
- **`useScrollLock`**: Locks body scroll when modals are open
- **`useContact`**: Handles contact form functionality

## 🧪 Testing

### Backend Tests

```bash
cd backend
dotnet test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 API Endpoints

### Properties

- `GET /api/properties` - Get paginated property list
- `GET /api/properties/{id}` - Get property by ID

### Health Check

- `GET /api/health` - API health status

## 🎨 Design System

The application uses a consistent design system with:

- **Colors**: Primary blue (#2563eb), muted grays, and accent colors
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Tailwind CSS spacing scale
- **Components**: Shadcn/ui component library

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/realestate
```

**Frontend**

- API base URL is configured in `src/services/api-service.ts`
- Default: `http://localhost:5000/`
