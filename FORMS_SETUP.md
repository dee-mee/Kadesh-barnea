# Form Setup Instructions

This document explains how to set up and run the functional forms for Kadesh Barnea website.

## Overview

The website has three types of forms:
1. **Contact Form** (contact.html) - For general inquiries
2. **Quote Request Form** (quote.html) - For service quotes
3. **Newsletter Signup** (footer, all pages) - For email subscriptions

All forms send confirmation emails to users and notification emails to `kadeshbanear@gmail.com`.

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Gmail account (or compatible SMTP service)

## Setup Instructions

### 1. Configure Email Service

The backend uses Gmail's SMTP server. You'll need to set up an app password:

#### For Gmail:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already done
3. Go to "App passwords" (at the bottom of Security page)
4. Select "Mail" and "Windows Computer" (or your device)
5. Generate a 16-character app password
6. Copy this password

### 2. Update .env File

Edit the `.env` file in the project root with your email credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
RECIPIENT_EMAIL=kadeshbanear@gmail.com
PORT=3000
NODE_ENV=development
```

**Note:** Never commit this file to git - it contains sensitive information!

### 3. Install Dependencies

All dependencies have already been installed via npm. If you need to reinstall:

```bash
npm install
```

### 4. Run the Server

Start the backend server:

```bash
npm start
```

Or for development with auto-reload (requires nodemon):

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 5. Test the Forms

1. Open a browser and navigate to `http://localhost:3000`
2. Fill out and submit any form
3. Check the email inbox for:
   - Submission confirmation email sent to the user
   - Notification email sent to kadeshbanear@gmail.com

## API Endpoints

### Contact Form
- **URL:** `POST /api/contact`
- **Fields:** name, email, subject, message
- **Response:** `{ success: boolean, message: string }`

### Quote Request
- **URL:** `POST /api/quote`
- **Fields:** name, email, service, message
- **Response:** `{ success: boolean, message: string }`

### Newsletter Signup
- **URL:** `POST /api/newsletter`
- **Fields:** email
- **Response:** `{ success: boolean, message: string }`

### Health Check
- **URL:** `GET /api/health`
- **Response:** `{ status: string }`

## Troubleshooting

### "Error: connect ECONNREFUSED" when submitting forms
- Make sure the server is running (`npm start`)
- Check that the API base URL in `js/form-handler.js` matches your server URL

### Gmail authentication failing
- Verify the SMTP_USER and SMTP_PASS are correct
- Make sure 2-Step Verification is enabled on your Google Account
- Verify the app password is correct (16 characters)
- Check that less secure app access is allowed (if not using app password)

### Forms not responding
- Open browser Developer Tools (F12)
- Check the Console tab for JavaScript errors
- Check the Network tab to see if API requests are being made
- Look at the server logs for backend errors

### Emails not being sent
- Check the server logs for detailed error messages
- Verify SMTP credentials are correct
- Ensure RECIPIENT_EMAIL is set correctly
- Check if your email provider blocks the connection

## File Structure

```
Kadesh-barnea/
├── server.js              # Backend Express server
├── package.json           # Project dependencies
├── .env                   # Email configuration (DO NOT COMMIT)
├── .env.example           # Template for .env file
├── js/
│   ├── main.js           # Existing JavaScript (WOW, carousel, etc)
│   └── form-handler.js   # New form handling code
├── contact.html          # Contact form page
├── quote.html            # Quote request page
└── [other pages]         # All have newsletter forms
```

## Security Notes

1. **Never commit .env file** - Add to .gitignore if not already there
2. **Use app passwords** - Don't use your actual Gmail password
3. **CORS Configuration** - Currently allows all origins. For production, restrict to your domain
4. **Input Validation** - All fields are validated on both frontend and backend

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| SMTP_HOST | Email server hostname | smtp.gmail.com |
| SMTP_PORT | Email server port | 587 |
| SMTP_USER | Email sender address | your-email@gmail.com |
| SMTP_PASS | App password for authentication | abcd efgh ijkl mnop |
| RECIPIENT_EMAIL | Company email recipient | kadeshbanear@gmail.com |
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |

## Production Deployment

When deploying to production:

1. Use a proper email service (SendGrid, AWS SES, etc.) instead of Gmail
2. Set `NODE_ENV=production`
3. Use environment variables from your hosting provider
4. Update CORS configuration to restrict origins
5. Use HTTPS for all requests
6. Set up proper error logging and monitoring
7. Add rate limiting to prevent spam
8. Implement CAPTCHA for form protection

## Support

For issues or questions, contact the development team.
