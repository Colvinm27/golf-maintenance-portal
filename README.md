# Golf Course Maintenance Portal

A web application for reporting maintenance issues at golf courses. This system allows members and guests to report issues with photos, which are then sent to maintenance staff via email.

## Features

- Report maintenance issues with photos
- Automatic email notifications to maintenance staff
- Support for both member and guest reporting
- Simple and intuitive interface

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Gmail account for sending emails (or other SMTP service)

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=4000
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   MAINTENANCE_EMAILS=email1@example.com,email2@example.com
   EMAIL_FROM_NAME=Golf Course Maintenance
   EMAIL_SUBJECT_PREFIX=[Golf Maintenance]
   ```

   Note: For Gmail, you'll need to use an App Password. To create one:
   1. Enable 2-Step Verification in your Google Account
   2. Go to Security → App Passwords
   3. Generate a new app password for "Mail"

4. Create an `uploads` directory in the root folder:
   ```bash
   mkdir uploads
   ```

## Running the Application

Development mode:
```bash
npm start
```

Production mode:
```bash
npm run start:prod
```

The server will start on port 4000 by default (or the port specified in your .env file).

## API Endpoints

- `GET /`: Health check endpoint
- `POST /report`: Submit a maintenance report
  - Required fields: course, hole, location, description, memberType
  - Optional fields: memberNumber, photo

## Security Notes

- The `uploads` directory should be regularly cleaned
- Consider implementing rate limiting for the API
- Ensure proper CORS settings for production
- Keep your .env file secure and never commit it to version control

## Deployment

For production deployment, consider:
1. Using a process manager like PM2
2. Setting up a reverse proxy (nginx/Apache)
3. Implementing SSL/TLS
4. Setting up proper logging
5. Regular backups of the uploads directory

## License

MIT License 