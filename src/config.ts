import 'dotenv/config';

export type AppConfig = {
  slackWebhookUrl: string;
  query: string;
  notifyAlways: boolean;
  slackMention?: string;
};

export function loadConfig(): AppConfig {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL || '';
  if (!slackWebhookUrl) {
    throw new Error('SLACK_WEBHOOK_URL が未設定です');
  }

  const query = process.env.QUERY?.trim() || '電池の切れかけた蟹';
  const notifyAlways = String(process.env.NOTIFY_ALWAYS || '').toLowerCase() === 'true';
  const slackMention = process.env.SLACK_MENTION?.trim();

  return { slackWebhookUrl, query, notifyAlways, slackMention };
}
