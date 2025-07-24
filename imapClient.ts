import { Email } from '../types/email';
import { classifyEmail, notifySlack, notifyWebhook } from '../utils/notify';
import { indexEmail } from '../utils/elastic';

export async function handleNewEmail(email: Email) {
  try {
    // Classify the email
    const label = await classifyEmail(email.subject, email.text);
    console.log(`Email classified as: ${label}`);

    // Index email in Elasticsearch
    await indexEmail({ ...email, folder: label });

    // Notify Slack
    await notifySlack(`📬 New [${label}] email from ${email.from}: ${email.subject}`);

    // Notify external webhook (optional)
    if (process.env.WEBHOOK_URL) {
      await notifyWebhook(process.env.WEBHOOK_URL, email);
    }
  } catch (err) {
    console.error('Failed to process email:', err);
  }
}
