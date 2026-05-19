import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize with environment variable or fallback placeholder.
// The user should set RESEND_API_KEY in their .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message, type } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>', // resend.dev domain is used for testing
      to: process.env.NOTIFICATION_EMAIL || 'kazbrekker@example.com', // Replace with the actual email
      subject: '[PORTFOLIO] New Transmission',
      html: `
        <div style="font-family: monospace; padding: 30px; background-color: #0d0d0d; color: #b8b8b8; border: 1px solid #333;">
          <h2 style="color: #5cffa3; font-weight: bold; margin-top: 0; font-size: 20px; text-transform: uppercase;">[ CONTACT_FORM_SUBMISSION ]</h2>
          <div style="margin-top: 20px; padding: 15px; border-left: 2px solid #5cffa3; background-color: rgba(255,255,255,0.05);">
            <p style="margin: 0 0 10px 0; color: #fff;"><strong>SENDER:</strong> ${email}</p>
            <p style="margin: 0 0 10px 0; color: #fff;"><strong>TYPE:</strong> ${type}</p>
            <p style="margin: 0; color: #fff;"><strong>TIMESTAMP:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin-top: 30px;">
            <p style="color: #5cffa3; font-size: 12px; letter-spacing: 2px;">> MESSAGE_CONTENT:</p>
            <div style="margin-top: 10px; padding: 20px; border: 1px solid #333; color: #fff; background-color: #000; white-space: pre-wrap;">${message}</div>
          </div>
          <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; font-size: 10px; color: #555;">
            SYSTEM: PORTFOLIO_V1.0 | STATUS: TRANSMITTED
          </div>
        </div>
      `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
