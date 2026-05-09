import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingNotificationPayload {
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  quantity: number;
  stayTitle: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  specialRequests?: string;
  totalAmount: number;
  discountAmount: number;
  promoCode?: string;
  airportPickup: boolean;
  airportDropoff: boolean;
  airportPickupPrice: number;
  airportDropoffPrice: number;
}

function buildEmailHtml(data: BookingNotificationPayload): string {
  const transferLines: string[] = [];
  if (data.airportPickup) {
    transferLines.push(`<tr><td style="padding:8px 0;color:#6b7280;">Airport Pickup</td><td style="padding:8px 0;text-align:right;font-weight:600;">$${data.airportPickupPrice.toFixed(2)}</td></tr>`);
  }
  if (data.airportDropoff) {
    transferLines.push(`<tr><td style="padding:8px 0;color:#6b7280;">Airport Drop-off</td><td style="padding:8px 0;text-align:right;font-weight:600;">$${data.airportDropoffPrice.toFixed(2)}</td></tr>`);
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">🏡 New Booking Request</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Mulberry Living · Negombo, Sri Lanka</p>
    </div>

    <!-- Body -->
    <div style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
      
      <!-- Guest Info -->
      <div style="margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">👤 Guest Information</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Name</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.fullName}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${data.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;"><a href="tel:${data.phone}" style="color:#2563eb;text-decoration:none;">${data.phone}</a></td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Guests</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.guests}</td></tr>
        </table>
      </div>

      <!-- Stay Details -->
      <div style="margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">🛏️ Stay Details</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:6px 0;color:#6b7280;width:140px;">Stay</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.stayTitle}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Quantity</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.quantity}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Check-in</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.checkIn}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Check-out</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.checkOut}</td></tr>
          <tr><td style="padding:6px 0;color:#6b7280;">Nights</td><td style="padding:6px 0;font-weight:600;color:#111827;">${data.nights}</td></tr>
        </table>
      </div>

      ${(data.airportPickup || data.airportDropoff) ? `
      <!-- Airport Transfers -->
      <div style="margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">✈️ Airport Transfers</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${transferLines.join('')}
        </table>
      </div>
      ` : ''}

      <!-- Pricing -->
      <div style="margin-bottom:24px;background:#f9fafb;border-radius:12px;padding:16px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#111827;">💰 Price Summary</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${data.promoCode ? `<tr><td style="padding:6px 0;color:#16a34a;">Promo: ${data.promoCode}</td><td style="padding:6px 0;text-align:right;color:#16a34a;font-weight:600;">-$${data.discountAmount.toFixed(2)}</td></tr>` : ''}
          ${data.airportPickup ? `<tr><td style="padding:6px 0;color:#6b7280;">Airport Pickup</td><td style="padding:6px 0;text-align:right;">$${data.airportPickupPrice.toFixed(2)}</td></tr>` : ''}
          ${data.airportDropoff ? `<tr><td style="padding:6px 0;color:#6b7280;">Airport Drop-off</td><td style="padding:6px 0;text-align:right;">$${data.airportDropoffPrice.toFixed(2)}</td></tr>` : ''}
          <tr style="border-top:2px solid #e5e7eb;">
            <td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#111827;">Estimated Total</td>
            <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:16px;color:#111827;">$${data.totalAmount.toFixed(2)}</td>
          </tr>
        </table>
      </div>

      ${data.specialRequests ? `
      <!-- Special Requests -->
      <div style="margin-bottom:24px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:#111827;border-bottom:2px solid #e5e7eb;padding-bottom:8px;">📝 Special Requests</h2>
        <p style="margin:0;color:#4b5563;font-size:14px;background:#f9fafb;padding:12px;border-radius:8px;">${data.specialRequests}</p>
      </div>
      ` : ''}

      <!-- Quick Actions -->
      <div style="text-align:center;padding-top:16px;border-top:2px solid #e5e7eb;">
        <p style="margin:0 0 12px;color:#6b7280;font-size:13px;">Quick Actions</p>
        <a href="mailto:${data.email}?subject=Your%20Booking%20at%20Mulberry%20Living" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;margin:0 4px;">Reply to Guest</a>
        <a href="https://wa.me/${data.phone.replace(/\D/g, '')}" style="display:inline-block;padding:10px 24px;background:#25d366;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;margin:0 4px;">WhatsApp</a>
      </div>
    </div>

    <!-- Footer -->
    <p style="text-align:center;color:#9ca3af;font-size:12px;margin-top:16px;">
      This notification was sent automatically by Mulberry Living's booking system.
    </p>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingNotificationPayload = await request.json();
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!notificationEmail) {
      console.error('NOTIFICATION_EMAIL not configured');
      return NextResponse.json(
        { error: 'Notification email not configured' },
        { status: 500 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Mulberry Living <onboarding@resend.dev>',
      to: [notificationEmail],
      subject: `🏡 New Booking: ${body.fullName} — ${body.stayTitle} (${body.checkIn})`,
      html: buildEmailHtml(body),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, emailId: data?.id });
  } catch (error: any) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
