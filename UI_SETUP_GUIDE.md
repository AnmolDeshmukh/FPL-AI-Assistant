# UI Setup Guide

## 1) Project Overview and Technology Stack
This project is built using React.js, a JavaScript library for building user interfaces. It leverages modern tools such as Webpack for module bundling, Babel for transpiling, and uses hooks and functional components for development.

## 2) Installation and Setup Instructions with Prerequisites
Before you start, ensure you have the following installed:
- Node.js (14.x or higher)
- npm (6.x or higher)

To install the project, run the following commands:
```bash
git clone https://github.com/AnmolDeshmukh/FPL-AI-Assistant.git
cd FPL-AI-Assistant
npm install
```

## 3) Component Structure and Architecture
The project's architecture follows a component-based structure, where each component is encapsulated with its stylesheet and test files. Components are organized in directories based on their functionality.

## 4) File Organization within `ui/src` Directory
- **components/**: Contains reusable UI components.
- **pages/**: Contains page-level components.
- **hooks/**: Contains custom React hooks.
- **context/**: Stores global state management solutions.

## 5) Running the Development Server
To start the development server, execute:
```bash
npm start
```
Visit `http://localhost:3000` in your browser to see your application.

## 6) Building for Production
To create a production build, run:
```bash
npm run build
```
The build files will be generated in the `build/` directory.

## 7) API Integration with Backend
Make sure to configure your API endpoints in the environment file (`.env`). Use axios or fetch to make requests from the frontend to the backend services.

## 8) Environment Configuration
Copy `.env.example` to `.env` and update the necessary environment variables to match your settings.

## 9) Troubleshooting Common Issues
- **Issue**: Application does not start.
  **Solution**: Ensure all prerequisites are installed and check the console for errors.

## 10) Deployment Options for Production
You can deploy your application using services like Vercel, Netlify, or any cloud provider of your choice. Ensure that you push your production build to the chosen hosting service.