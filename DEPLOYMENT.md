# Golf Course Maintenance Portal - Installation Guide

This guide will help you install the maintenance portal on your golf course's computer.

## System Requirements
- Windows 10 or newer
- Internet connection
- A Gmail account for sending maintenance reports

## Installation Steps

1. **Download and Install Node.js**
   - Go to https://nodejs.org/
   - Download the "LTS" (Long Term Support) version
   - Run the installer and follow the prompts
   - Restart your computer after installation

2. **Download the Application**
   - Create a new folder on your computer (e.g., `C:\GolfMaintenance`)
   - Copy all the application files into this folder

3. **Configure Email Settings**
   - Open the `.env` file in a text editor (like Notepad)
   - Fill in the following information:
     ```
     SMTP_USER=your-golf-course-email@gmail.com
     SMTP_PASS=your-app-password
     MAINTENANCE_EMAILS=staff1@yourcourse.com,staff2@yourcourse.com
     EMAIL_FROM_NAME=Your Golf Course Name
     EMAIL_SUBJECT_PREFIX=[Course Maintenance]
     ```
   - Save the file

4. **Set Up Gmail for Sending Emails**
   - Log into the Gmail account you want to use
   - Go to Google Account Settings → Security
   - Enable "2-Step Verification" if not already enabled
   - Go to "App Passwords"
   - Create a new app password for "Mail"
   - Copy this password and use it as your SMTP_PASS in the .env file

5. **Install the Application**
   - Open Command Prompt as Administrator
   - Navigate to the application folder:
     ```
     cd C:\GolfMaintenance
     ```
   - Run these commands:
     ```
     npm install
     mkdir uploads
     ```

6. **Start the Application**
   - In the same Command Prompt window, run:
     ```
     npm start
     ```
   - The application should now be running

7. **Access the Application**
   - Open a web browser
   - Go to: http://localhost:4000
   - You should see "Golf Maintenance Portal Backend Running"

## Keeping the Application Running

To ensure the application stays running:
1. Keep the Command Prompt window open
2. If the computer restarts, you'll need to:
   - Open Command Prompt
   - Navigate to the application folder
   - Run `npm start`

## Troubleshooting

If you encounter any issues:
1. Make sure Node.js is installed correctly
2. Check that the .env file is configured properly
3. Ensure the Gmail account settings are correct
4. Verify that port 4000 is not being used by another application

## Support

If you need help:
1. Check that all settings in the .env file are correct
2. Make sure the Gmail account is properly configured
3. Contact your IT support or the application developer

## Regular Maintenance

- The application will create an `uploads` folder for photos
- You may want to periodically clear this folder to save space
- Keep Node.js updated to the latest LTS version 