// Test script for sending password reset email
require('dotenv').config();

const { Resend } = require('resend');

// Log environment variables (redacted for security)
console.log('Environment check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL || 'not set');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'not set');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '[PRESENT]' : '[MISSING]');

async function sendPasswordResetEmail(email, resetToken) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  // Create a reset URL
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
  console.log(`Reset URL generated: ${resetUrl}`);

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
      <p>Best regards,<br/>The Team</p>
    </div>
  `;

  console.log('Sending email with settings:');
  console.log('- From:', fromEmail);
  console.log('- To:', email);
  console.log('- Subject: Reset Your Password');

  try {
    console.log('Sending password reset email via Resend...');
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
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    console.log('Password reset email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Exception sending password reset email:', error);
    return { success: false, error };
  }
}

// Run the test with test email and token
const testEmail = 'delivered@resend.dev'; // Resend's test email
const testToken = 'test-reset-token-123';

sendPasswordResetEmail(testEmail, testToken)
  .then(result => {
    console.log('Final result:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });