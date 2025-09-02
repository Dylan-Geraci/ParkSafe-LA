# ParkSafe-LA React Frontend

This is the React.js frontend for the ParkSafe-LA risk predictor application.

## Features

- Modern React.js with hooks
- Tailwind CSS for styling
- Responsive design
- Form validation
- Loading states
- Beautiful UI with glassmorphism effects

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Development

- The app is configured to proxy API requests to `http://localhost:5000` (Flask backend)
- Make sure your Flask backend is running on port 5000
- The frontend will automatically reload when you make changes

## Technologies Used

- React 18
- Tailwind CSS 3
- Axios for HTTP requests
- Modern JavaScript (ES6+)
