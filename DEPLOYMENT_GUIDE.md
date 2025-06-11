# Heroku Deployment Guide

This guide will help you deploy the Golf Maintenance Portal to Heroku.

## Prerequisites

1. **Install Required Software**
   - [Git](https://git-scm.com/downloads)
   - [Node.js](https://nodejs.org/) (v14 or higher)
   - [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. **Create Accounts**
   - [Heroku Account](https://signup.heroku.com/)
   - Gmail account for sending maintenance reports

## Step 1: Prepare Your Gmail Account

1. Log into your Gmail account
2. Go to Google Account Settings → Security
3. Enable "2-Step Verification" if not already enabled
4. Go to "App Passwords"
5. Create a new app password for "Mail"
6. Copy this password - you'll need it for Heroku configuration

## Step 2: Deploy to Heroku

1. **Open Command Prompt/Terminal**

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create a New Heroku App**
   ```bash
   heroku create your-golf-course-maintenance
   ```
   (Replace "your-golf-course-maintenance" with your preferred name)

4. **Configure Environment Variables**
   ```bash
   heroku config:set SMTP_USER=your-golf-course-email@gmail.com
   heroku config:set SMTP_PASS=your-app-password
   heroku config:set MAINTENANCE_EMAILS=staff1@yourcourse.com,staff2@yourcourse.com
   heroku config:set EMAIL_FROM_NAME="Your Golf Course Name"
   heroku config:set EMAIL_SUBJECT_PREFIX="[Course Maintenance]"
   ```

5. **Initialize Git Repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

6. **Deploy to Heroku**
   ```bash
   git push heroku main
   ```

7. **Open Your Application**
   ```bash
   heroku open
   ```

## Step 3: Verify Deployment

1. Visit your application URL (https://your-golf-course-maintenance.herokuapp.com)
2. Test the maintenance report form
3. Verify that maintenance staff receives the email

## Troubleshooting

If you encounter issues:

1. **Check Logs**
   ```bash
   heroku logs --tail
   ```

2. **Common Issues**:
   - If emails aren't sending: Verify SMTP settings
   - If the app doesn't load: Check build logs
   - If photos aren't uploading: Check Heroku's ephemeral filesystem

3. **Restart the Application**
   ```bash
   heroku restart
   ```

## Updating the Application

To update the application in the future:

1. Make your changes locally
2. Commit the changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
3. Deploy the updates:
   ```bash
   git push heroku main
   ```

## Security Notes

1. Keep your Heroku credentials secure
2. Regularly update your Gmail app password
3. Monitor the application logs for any suspicious activity
4. Consider setting up SSL (Heroku provides this by default)

## Support

If you need help:
1. Check the Heroku [documentation](https://devcenter.heroku.com/)
2. Contact Heroku support
3. Review the application logs for specific errors

## Maintenance

1. **Regular Updates**
   - Keep Node.js dependencies updated
   - Monitor Heroku for any service updates
   - Regularly check application performance

2. **Backup**
   - Heroku automatically backs up your application
   - Keep a local copy of your code
   - Document any custom configurations

3. **Monitoring**
   - Set up Heroku monitoring
   - Check application logs regularly
   - Monitor email delivery success rates 