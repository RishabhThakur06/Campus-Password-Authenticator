# Campus Password Analyzer

A specialized, privacy-focused password strength analyzer and generator designed for secure campus and university accounts. This application runs entirely in your web browser, ensuring your passwords never leave your device.

## Features

- **Real-Time Analysis**: Instant feedback on password complexity and entropy.
- **Heuristic Filtering**: Detects common weak patterns and dictionary words.
- **Secure Generation**: Entropy-driven random password generation.
- **Privacy-First**: No external API calls or AI processing; all logic is local.
- **Campus-Ready**: Tailored security tips for institutional account safety.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js**: Version 18.0.0 or higher.
- **npm**: Usually comes bundled with Node.js.

## Getting Started

### 1. Clone or Download the Project
If you exported this project, extract the ZIP file to a folder on your computer.

### 2. Install Dependencies
Open your terminal, navigate to the project directory, and run:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and copy the contents from `.env.example`:
```bash
cp .env.example .env
```

### 4. Run the Development Server
Start the application locally:
```bash
npm run dev
```
Once the server starts, open your browser and navigate to the URL shown in your terminal (typically `http://localhost:3000`).

## Production Build

To create an optimized production build of the application:

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Preview the build**:
   ```bash
   npm run preview
   ```

## Technical Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Build Tool**: Vite

## License

This project is licensed under the Apache-2.0 License.
