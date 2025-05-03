import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender address
// Use onboarding@resend.dev for testing, or a verified domain email for production
const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

// Development mode flag - set to true to log emails instead of sending them
const isDevelopment = process.env.NODE_ENV === 'development';
const hasResendKey = !!process.env.RESEND_API_KEY;

// Test recipient for development
const testRecipient = 'delivered@resend.dev';

// Send welcome email to new users
export async function sendWelcomeEmail(email: string, name?: string) {
  console.log(`[EmailService] Attempting to send welcome email to ${email}`);
  console.log(`[EmailService] Environment: ${process.env.NODE_ENV}, Has Resend API Key: ${hasResendKey}`);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2>Welcome${name ? ` ${name}` : ''}!</h2>
      <p>Thank you for creating an account with us. We're excited to have you on board!</p>
      <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
      <p>Best regards,<br/>The Team</p>
    </div>
  `;

  // If in development mode, log the email
  if (isDevelopment) {
    console.log('\n-------- WELCOME EMAIL --------');
    console.log(`To: ${email}`);
    console.log(`From: ${fromEmail}`);
    console.log('Subject: Welcome to Our Platform!');
    console.log('Body:');
    console.log(html);
    console.log('-----------------------------\n');
  }

  // If no API key, return success but log the issue
  if (!hasResendKey) {
    console.log('[EmailService] No Resend API key found. Email not sent. Add RESEND_API_KEY to your .env.local file.');
    return { success: true, data: { id: 'test-email-id' } };
  }

  try {
    console.log('[EmailService] Sending email via Resend...');
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Welcome to Our Platform!',
      html,
      headers: {
        'X-Entity-Ref-ID': `welcome-${Date.now()}`, // Prevents threading in Gmail
      },
    });

    if (error) {
      console.error('[EmailService] Error sending welcome email:', error);
      return { success: false, error };
    }

    console.log('[EmailService] Welcome email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('[EmailService] Exception sending welcome email:', error);
    return { success: false, error };
  }
}

// Generate a password reset token and send a reset email
export async function sendPasswordResetEmail(email: string, resetToken: string, resetTokenExpiry: Date) {
  console.log(`[EmailService] Attempting to send password reset email to ${email}`);
  console.log(`[EmailService] Environment variables:`);
  console.log(`[EmailService] - NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`[EmailService] - Has Resend API Key: ${hasResendKey}`);
  console.log(`[EmailService] - EMAIL_FROM: ${process.env.EMAIL_FROM || 'not set'}`);
  console.log(`[EmailService] - NEXT_PUBLIC_APP_URL: ${process.env.NEXT_PUBLIC_APP_URL || 'not set'}`);

  // Create a reset URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  console.log(`[EmailService] Reset URL generated: ${resetUrl}`);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2>Reset Your Password</h2>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a
          href="${resetUrl}"
          style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold"
        >
          Reset Password
        </a>
      </p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <p>Best regards,<br/>The Boogle Team</p>
    </div>
  `;

  // If in development mode, log the email
  if (isDevelopment) {
    console.log('\n-------- PASSWORD RESET EMAIL --------');
    console.log(`To: ${email}`);
    console.log(`From: ${fromEmail}`);
    console.log('Subject: Reset Your Password');
    console.log('Body:');
    console.log(html);
    console.log(`Reset Link: ${resetUrl}`);
    console.log('-----------------------------\n');
  }

  // If no API key, return success but log the issue
  if (!hasResendKey) {
    console.log('[EmailService] No Resend API key found. Email not sent. Add RESEND_API_KEY to your .env.local file.');
    return { success: true, data: { id: 'test-email-id' } };
  }

  try {
    console.log('[EmailService] Preparing to send password reset email via Resend...');
    console.log('[EmailService] Email configuration:');
    console.log('[EmailService] - From:', fromEmail);
    console.log('[EmailService] - To:', email);
    console.log('[EmailService] - Subject: Reset Your Password');

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Reset Your Password',
      html,
      headers: {
        'X-Entity-Ref-ID': `password-reset-${Date.now()}`, // Prevents threading in Gmail
      },
    });

    if (error) {
      console.error('[EmailService] Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('[EmailService] Password reset email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('[EmailService] Exception sending password reset email:', error);
    console.error('[EmailService] Error details:', error);
    return { success: false, error };
  }
}