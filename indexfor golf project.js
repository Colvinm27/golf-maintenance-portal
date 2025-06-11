require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.get('/', (req, res) => {
  res.send('Golf Maintenance Portal Backend Running');
});

app.post('/report', upload.single('photo'), async (req, res) => {
  const { course, hole, location, description } = req.body;
  const photo = req.file;

  // Setup Nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Compose email
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.MAINTENANCE_EMAIL,
    subject: `Golf Issue: ${course} - Hole ${hole} - ${location}`,
    text: `A new issue has been reported on the golf course.\n\nCourse: ${course}\nHole: ${hole}\nLocation: ${location}\nDescription: ${description}`,
    attachments: photo ? [{
      filename: photo.originalname,
      path: photo.path
    }] : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    // Clean up uploaded file
    if (photo) fs.unlink(photo.path, () => {});
    res.json({ success: true });
  } catch (error) {
    if (photo) fs.unlink(photo.path, () => {});
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
}); 