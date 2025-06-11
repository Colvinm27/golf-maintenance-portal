require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:4000', 'http://127.0.0.1:3000', 'http://127.0.0.1:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Add OPTIONS handler for preflight requests
app.options('*', cors());

// Parse JSON bodies
app.use(express.json());

// Helper function to get maintenance emails
const getMaintenanceEmails = () => {
  const emails = process.env.MAINTENANCE_EMAILS || '';
  return emails.split(',').map(email => email.trim()).filter(email => email);
};

// Helper function to get email configuration
const getEmailConfig = () => ({
  from: {
    name: process.env.EMAIL_FROM_NAME || 'Golf Course Maintenance',
    address: process.env.SMTP_USER
  },
  subjectPrefix: process.env.EMAIL_SUBJECT_PREFIX || '[Golf Maintenance]'
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/report', upload.single('photo'), async (req, res) => {
  console.log('Received report submission request');
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('Request file:', req.file);

  const { course, hole, location, description, memberType, memberNumber } = req.body;
  const photo = req.file;

  // Get maintenance emails
  const maintenanceEmails = getMaintenanceEmails();
  if (maintenanceEmails.length === 0) {
    return res.status(500).json({ 
      success: false, 
      error: 'No maintenance emails configured' 
    });
  }

  // Get email configuration
  const emailConfig = getEmailConfig();

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    debug: true,
    logger: true,
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verify transporter configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.log('SMTP Configuration Error:', error);
    } else {
      console.log('SMTP Server is ready to take our messages');
    }
  });

  // Compose email
  const mailOptions = {
    from: emailConfig.from,
    to: maintenanceEmails,
    subject: `${emailConfig.subjectPrefix} ${course} - Hole ${hole} - ${location}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Maintenance Report</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <p><strong>Course:</strong> ${course}</p>
          <p><strong>Hole:</strong> ${hole}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Reported By:</strong> ${memberType === 'member' ? `Member (${memberNumber})` : 'Guest'}</p>
        </div>
        <p style="color: #7f8c8d; font-size: 12px; margin-top: 20px;">
          This is an automated message from the Golf Course Maintenance System.
        </p>
      </div>
    `,
    text: `A new issue has been reported on the golf course.\n\nCourse: ${course}\nHole: ${hole}\nLocation: ${location}\nDescription: ${description}\nReported By: ${memberType === 'member' ? `Member (${memberNumber})` : 'Guest'}`,
    attachments: photo ? [{
      filename: photo.originalname,
      path: photo.path
    }] : [],
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high'
    }
  };

  try {
    console.log('Attempting to send email with config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      recipients: maintenanceEmails
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    // Clean up uploaded file
    if (photo) fs.unlink(photo.path, () => {});
    res.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    if (photo) fs.unlink(photo.path, () => {});
    res.status(500).json({ success: false, error: error.message });
  }
});

// Serve static files from the frontend build directory AFTER API routes
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Handle all other routes by serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 