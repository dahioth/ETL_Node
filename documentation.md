# University ETL Project Documentation

## Project Overview

This project implements an ETL (Extract, Transform, Load) process for university data from the API endpoint `http://universities.hipolabs.com/search?country=united+states`. It stores the data in a relational database and provides an API endpoint to download the data as a CSV file.

## Architecture

The application follows a layered architecture:

- **Data Access Layer**: Sequelize ORM with SQLite database
- **Service Layer**: ETL services, CSV generation, and scheduling
- **API Layer**: Express.js routes and controllers

## Database Design

The database consists of three related tables:

1. **Universities**: Main entity storing university information
   - id (PK)
   - name
   - alpha_two_code
   - country
   - state_province (nullable)

2. **Domains**: Stores domains associated with universities
   - id (PK)
   - domain (string)
   - universityId (FK to Universities)

3. **WebPages**: Stores web pages associated with universities
   - id (PK)
   - url (string)
   - universityId (FK to Universities)

The choice of related tables for domains and web_pages instead of arrays/JSON fields was made to:
- Maintain proper relational database normalization
- Enable more flexible querying (e.g., searching by domain)
- Allow for future extensibility

## ETL Process

### Extract
- Fetches data from the API using pagination (limit and offset parameters)
- Implements retry logic for server errors

### Transform
- Validates and normalizes data
- Prepares data for database storage with proper relationships

### Load
- Uses transactions for data integrity
- Implements upsert logic to prevent duplicates
- Maintains relationships between universities and their domains/web_pages

## Data Refresh

- Scheduled to run at midnight UTC every day
- Uses node-cron for scheduling

## CSV Generation

- Dynamically generates CSV files from database records
- Properly formats data to match the original API structure
- Converts related table data back to semicolon-separated values for CSV

## Assumptions

1. **Countries**: The only country concerned in the united states.
2. **API Design**: No filters are required at the moment. Though, the api was designed in a way that allows querying on specific domains, web_pages, name, etc.
3. **Database Selection**: SQLite is sufficient for this application's needs but can be replaced with any SQL database


## Design Decisions

1. **Relational Database**: Chose a normalized relational structure to maintain data integrity and relationships
2. **Transaction Support**: Used transactions to ensure data consistency during ETL operations
3. **Modular Architecture**: Separated concerns into models, services, and controllers for maintainability
5. **Scheduler**: Used node-cron for scheduling daily refreshes

## Future Improvements

1. **Monitoring**: Add monitoring and alerting for ETL job failures
2. **Authentication**: Add API authentication for secure access
3. **Caching**: Implement response caching for better performance
4. **Search API**: Add search functionality to filter universities by various criteria

