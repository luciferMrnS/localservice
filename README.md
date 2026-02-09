# Local Service App

A comprehensive web application for connecting clients with home service providers. Built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

### Core Functionality
- **Dynamic Service Selection**: Multi-step form with categorized service grid
- **Smart Request Form**: Collects client information with validation
- **Real-time Logistics**: Google Maps integration for distance and travel time calculations
- **Admin Dashboard**: Private view for managing service requests

### User Experience
- **Mobile Responsive**: Optimized for smartphones and tablets
- **Accessibility First**: ARIA labels, keyboard navigation, high contrast
- **Google Maps Autocomplete**: Prevents address typos with smart suggestions

### Professional Features
- **Photo Upload**: Clients can upload up to 3 photos (5MB max each)
- **Booking Scheduler**: Choose specific date/time or "ASAP"
- **Service Tiers**: Emergency vs Standard service levels
- **Real-time Updates**: Firebase backend for instant data synchronization

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Firestore, Storage)
- **Maps**: Google Maps API (Places, Distance Matrix)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- Google Maps API key
- Firebase project configuration

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd local-service-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ServiceSelection.tsx
│   ├── ServiceRequestForm.tsx
│   ├── AddressAutocomplete.tsx
│   └── AdminDashboard.tsx
├── lib/                   # Utility libraries
│   ├── firebase.ts        # Firebase configuration
│   ├── firestore.ts       # Database operations
│   ├── storage.ts         # File upload operations
│   ├── maps.ts            # Google Maps utilities
│   └── utils.ts           # General utilities
└── types/                 # TypeScript type definitions
    └── index.ts
```

## Key Features Explained

### Service Categories
The app supports 7 main service categories:
- Plumbing (pipe repair, drain cleaning, faucet installation)
- Cleaning (deep cleaning, window cleaning, carpet cleaning)
- Electrical (outlet repair, lighting installation, circuit repair)
- Pool Maintenance (cleaning, chemical balance, equipment repair)
- House Sitting (vacation sitting, pet care, plant care)
- Errands (grocery shopping, prescription pickup, package delivery)
- Delivery (local delivery, furniture delivery, document delivery)

### Distance & Time Calculation
Using Google Maps Distance Matrix API, the app calculates:
- Distance from base location to client address
- Estimated travel time based on current traffic
- Turn-by-turn routing for service providers

### Photo Upload System
- Maximum 3 photos per request
- 5MB file size limit
- Support for JPEG, PNG, WebP formats
- Automatic validation and error handling
- Firebase Storage integration

### Admin Dashboard Features
- Real-time request management
- Status updates (pending → accepted → in progress → completed)
- Distance and travel time display
- Map integration for route visualization
- Emergency request prioritization

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Platform
- DigitalOcean App Platform

## Environment Variables

Required environment variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## API Keys Setup

### Firebase
1. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Enable Firebase Storage
4. Copy your web app configuration

### Google Maps
1. Create a project at [https://console.cloud.google.com](https://console.cloud.google.com)
2. Enable the following APIs:
   - Places API
   - Geocoding API
   - Distance Matrix API
3. Create an API key with appropriate restrictions
4. Add the key to your environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.
