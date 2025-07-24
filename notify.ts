import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Classify the email content using OpenAI
export async function classifyEmail(subject: string, body: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are an AI email classifier. Return a label like Work, Personal, Spam, Notification, or Promotion.',
      },
      {
        role: 'user',
        content: `Subject: ${subject}\nBody: ${body}`,
      },
    ],
  });

  return response.choices[0].message.content?.trim() || 'Uncategorized';
}

// Send a message to Slack
export async function notifySlack(message: string): Promise<void> {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!slackWebhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not set');
    return;
  }

  await axios.post(slackWebhookUrl, {
    text: message,
  });
}

// Send a generic webhook with email data
export async function notifyWebhook(url: string, payload: any): Promise<void> {
  try {
    await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
  }
}
