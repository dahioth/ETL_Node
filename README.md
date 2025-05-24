# University ETL Node.js Project

This project implements an ETL (Extract, Transform, Load) process for university data. It fetches data from a universities API, stores it in a database, and provides an API endpoint to download the data as a CSV file.

## Features

- Extracts data from http://universities.hipolabs.com/search?country=united+states
- Transforms and normalizes the data
- Stores data in a SQLite database with proper relationships
- Provides API endpoints to access data and download as CSV
- Automatically refreshes data daily at midnight UTC

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

## Usage

### Start the application:

```
npm start
```

For development with auto-reload:

```
npm run dev
```

### API Endpoints

- `GET /`: Home route with API information
- `GET /api/universities`: Get all universities data
- `GET /api/universities/download`: Download universities data as CSV

## Project Structure

```
├── src/
│   ├── config/         # Configuration files (Database)
│   ├── controllers/    # API controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   └── app.js          # Main application file
├── documentation.md    # Project documentation
├── package.json
└── README.md
```

## Documentation

See [documentation.md](./documentation.md) for detailed information about:

- Project architecture
- Database design
- ETL process
- Assumptions and design decisions
- Future improvements