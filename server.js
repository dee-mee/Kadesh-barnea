require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email service is ready');
  }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all fields' 
      });
    }

    // Email to company
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'We received your message - Kadesh Barnea Services',
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${name},</p>
        <p>We have received your message and will get back to you within 24 hours.</p>
        <p><strong>Your Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>Kadesh Barnea Services Ltd.</p>
      `
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationEmail);

    res.json({ 
      success: true, 
      message: 'Your message has been sent successfully! We will contact you soon.' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending message. Please try again.' 
    });
  }
});

// Quote Form Endpoint
app.post('/api/quote', async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    // Validation
    if (!name || !email || !service || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all fields' 
      });
    }

    // Email to company
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Quote Request: ${service}`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message/Requirements:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Confirmation email to user
    const confirmationEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Quote Request Received - Kadesh Barnea Services',
      html: `
        <h2>Thank you for your quote request!</h2>
        <p>Dear ${name},</p>
        <p>We have received your quote request for <strong>${service}</strong> and will respond within 24 hours with a customized quote.</p>
        <p><strong>Your Request:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p>Best regards,<br>Kadesh Barnea Services Ltd.</p>
      `
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationEmail);

    res.json({ 
      success: true, 
      message: 'Your quote request has been sent successfully! We will contact you within 24 hours.' 
    });
  } catch (error) {
    console.error('Quote form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending quote request. Please try again.' 
    });
  }
});

// Newsletter Signup Endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter your email' 
      });
    }

    // Email to company
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'New Newsletter Signup',
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p>User subscribed to newsletter on ${new Date().toLocaleString()}</p>
      `
    };

    // Welcome email to user
    const welcomeEmail = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Welcome to Kadesh Barnea Newsletter!',
      html: `
        <h2>Welcome!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
        <p>You will now receive updates about our services, special offers, and industry insights.</p>
        <hr>
        <p>Best regards,<br>Kadesh Barnea Services Ltd.</p>
      `
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(welcomeEmail);

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter!' 
    });
  } catch (error) {
    console.error('Newsletter signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error subscribing to newsletter. Please try again.' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
