import axios from 'axios';

export type HitResult = {
  found: boolean;
  query: string;
  url: string;
  notes?: string;
};

export function buildSlackMessage(result: HitResult): { text: string } {
  const title = result.found ? '✅ ヒットしました' : '🔎 ヒットなし';
  const body = result.found
    ? `検索クエリ「${result.query}」に一致する結果が見つかりました。\nリンク: ${result.url}`
    : `検索クエリ「${result.query}」ではヒットが見つかりませんでした。`;
  const notes = result.notes ? `\n備考: ${result.notes}` : '';
  return { text: `${title}\n${body}${notes}` };
}

export async function postToSlack(webhookUrl: string, result: HitResult): Promise<void> {
  const payload = buildSlackMessage(result);
  await axios.post(webhookUrl, payload, { headers: { 'Content-Type': 'application/json' } });
}

