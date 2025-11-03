# Email Verification Setup

## Development Mode (No Email Service)

When `RESEND_API_KEY` is not set, verification emails are logged to the console instead:

```
=================================
📧 EMAIL VERIFICATION
=================================
To: user@example.com
Name: John Doe
Verification URL: http://localhost:3000/verify-email?token=abc123...
=================================
```

Simply copy the URL from the console and paste it into your browser to verify.

## Production Setup with Resend (Recommended)

### Why Resend?

- **Free tier**: 100 emails/day, 3000/month
- **No credit card required** for free tier
- **Simple API**: Just one HTTP request
- **Vercel-friendly**: Works perfectly on serverless
- **Professional**: SPF/DKIM configured automatically

### Setup Steps

1. **Sign up for Resend**
   - Go to https://resend.com
   - Sign up with your email
   - Verify your email

2. **Get API Key**
   - Go to API Keys section
   - Create a new API key
   - Copy the key (starts with `re_`)

3. **Add to Environment Variables**

   ```env
   RESEND_API_KEY="re_your_key_here"
   EMAIL_FROM="AlgoLoom <noreply@yourdomain.com>"
   ```

4. **Verify Domain (Optional but Recommended)**
   - In Resend dashboard, go to Domains
   - Add your domain (e.g., `yourdomain.com`)
   - Add the DNS records they provide
   - Once verified, update `EMAIL_FROM`:
     ```env
     EMAIL_FROM="AlgoLoom <noreply@yourdomain.com>"
     ```

5. **Deploy to Vercel**
   - Add environment variables in Vercel dashboard
   - Redeploy your app

### Testing in Production

1. Register a new account with a real email
2. Check your inbox (and spam folder)
3. Click the verification link
4. You should be redirected to `/verify-email` and see success message

## How It Works

### Registration Flow

1. User fills out registration form with name, email, password
2. API creates user with `emailVerified = null`
3. API generates verification token (32-byte hex)
4. Token stored in `VerificationToken` table (expires in 1 hour)
5. Email sent with verification link
6. User redirected to `/register-success` page

### Verification Flow

1. User clicks link in email
2. Link goes to `/verify-email?token=xxx&email=xxx`
3. API validates token:
   - Checks if token exists
   - Checks if token is expired
   - If valid: sets `emailVerified = now()`, deletes token
4. Success page shows, user can now sign in

### Submission Protection

1. User tries to submit solution
2. API checks `emailVerified` field
3. If `null`: returns 403 error with message
4. If set: allows submission

## Email Template

The verification email includes:

- AlgoLoom branding with gradient header
- Personalized greeting with user's name
- Large "Verify Email" button
- Plain text link as fallback
- 1-hour expiration notice
- Mobile-responsive design

## Security Features

- **Token expiration**: Links expire after 1 hour
- **One-time use**: Token deleted after successful verification
- **Secure generation**: Uses `crypto.randomBytes(32)` for tokens
- **Rate limiting**: Submission endpoint already has rate limiting
- **Database cleanup**: Expired tokens automatically cleaned on verification attempts

## Troubleshooting

### Emails going to spam

- Verify your domain with SPF/DKIM records
- Use professional `EMAIL_FROM` address
- Ask users to check spam folder

## Future Enhancements (TODO)

- [ ] Verification reminder after 24 hours
- [ ] Batch cleanup of expired tokens (cron job)
- [ ] Email templates for other actions (password reset, etc.)
