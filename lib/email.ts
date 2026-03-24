type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

const resendApiUrl = 'https://api.resend.com/emails';

function isPlaceholderValue(value?: string) {
  if (!value) return true;

  return (
    value.includes('xxx') ||
    value.includes('yourdomain.com') ||
    value.includes('127.0.0.1') ||
    value.includes('localhost')
  );
}

function getFromAddress() {
  const fromAddress = process.env.EMAIL_FROM;

  if (isPlaceholderValue(fromAddress)) {
    return 'Fitfluence Pro <no-reply@fitfluencepro.com>';
  }

  return fromAddress || 'Fitfluence Pro <no-reply@fitfluencepro.com>';
}

function getAdminAddress() {
  return process.env.ADMIN_EMAIL || 'coach@fitfluencepro.com';
}

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;

  if (isPlaceholderValue(apiKey)) {
    return { skipped: true, reason: 'RESEND_API_KEY is not configured' };
  }

  const response = await fetch(resendApiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Email send failed: ${body}`);
  }

  return response.json();
}

export async function sendLeadMagnetEmails(input: { email: string; name?: string | null }) {
  const firstName = input.name?.split(' ')[0] || 'there';

  await Promise.all([
    sendEmail({
      to: input.email,
      subject: 'Your Fitfluence Pro starter plan is inside',
      text: `Hi ${firstName}, thanks for joining Fitfluence Pro. Your starter plan is ready: ${process.env.LEAD_MAGNET_URL || 'Add LEAD_MAGNET_URL to send the real download link.'}`,
      html: `<p>Hi ${firstName},</p><p>Thanks for joining Fitfluence Pro.</p><p>Your starter plan is ready: <a href="${process.env.LEAD_MAGNET_URL || '#'}">${process.env.LEAD_MAGNET_URL || 'Add LEAD_MAGNET_URL to send the real download link.'}</a></p><p>You’ll also get practical training tips, launch updates, and premium coaching offers.</p>`
    }),
    sendEmail({
      to: getAdminAddress(),
      subject: 'New lead captured',
      text: `${input.name || 'Unnamed lead'} subscribed with ${input.email}.`,
      html: `<p><strong>${input.name || 'Unnamed lead'}</strong> subscribed with <a href="mailto:${input.email}">${input.email}</a>.</p>`
    })
  ]);
}

export async function sendBookingEmails(input: {
  email: string;
  name: string;
  sessionType: string;
  date: string;
  notes?: string | null;
}) {
  await Promise.all([
    sendEmail({
      to: input.email,
      subject: 'Your coaching request has been received',
      text: `Hi ${input.name}, your ${input.sessionType} session request for ${input.date} is in. We’ll follow up shortly with confirmation details.`,
      html: `<p>Hi ${input.name},</p><p>Your <strong>${input.sessionType}</strong> session request for <strong>${input.date}</strong> is in.</p><p>We’ll follow up shortly with confirmation details.</p>`
    }),
    sendEmail({
      to: getAdminAddress(),
      subject: 'New coaching booking request',
      text: `${input.name} requested ${input.sessionType} on ${input.date}. Notes: ${input.notes || 'None'}`,
      html: `<p><strong>${input.name}</strong> requested <strong>${input.sessionType}</strong> on <strong>${input.date}</strong>.</p><p>Notes: ${input.notes || 'None'}</p><p>Email: <a href="mailto:${input.email}">${input.email}</a></p>`
    })
  ]);
}

export async function sendPurchaseEmails(input: {
  email: string;
  customerName?: string | null;
  programName: string;
  programSlug: string;
}) {
  const programUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/programs/${input.programSlug}`;
  const firstName = input.customerName?.split(' ')[0] || 'there';

  await Promise.all([
    sendEmail({
      to: input.email,
      subject: `You now have access to ${input.programName}`,
      text: `Hi ${firstName}, your payment was successful and ${input.programName} is now unlocked. Open it here: ${programUrl}`,
      html: `<p>Hi ${firstName},</p><p>Your payment was successful and <strong>${input.programName}</strong> is now unlocked.</p><p><a href="${programUrl}">Open your program</a></p><p>You can also log in to your dashboard anytime to view your purchases.</p>`
    }),
    sendEmail({
      to: getAdminAddress(),
      subject: 'New Stripe purchase completed',
      text: `${input.email} purchased ${input.programName}.`,
      html: `<p><a href="mailto:${input.email}">${input.email}</a> purchased <strong>${input.programName}</strong>.</p>`
    })
  ]);
}
