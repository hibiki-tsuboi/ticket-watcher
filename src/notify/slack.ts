import axios from 'axios';

export type HitResult = {
  found: boolean;
  query: string;
  url: string;
  notes?: string;
};

export function buildSlackMessage(
  result: HitResult,
  opts?: { mention?: string }
): { text: string; link_names?: 1 } {
  const title = result.found ? '✅ ヒットしました' : '🔎 ヒットなし';
  const body = result.found
    ? `検索クエリ「${result.query}」に一致する結果が見つかりました。\nリンク: ${result.url}`
    : `検索クエリ「${result.query}」ではヒットが見つかりませんでした。`;
  const notes = result.notes ? `\n備考: ${result.notes}` : '';

  const mention = opts?.mention ? `${opts.mention} ` : '';
  const text = `${mention}${title}\n${body}${notes}`;
  // @から始まる表記をSlack側でリンク化（ユーザーID <@UXXXX> の場合は不要だが影響なし）
  const link_names = opts?.mention?.startsWith('@') ? 1 : undefined;
  return link_names ? { text, link_names } : { text };
}

export async function postToSlack(
  webhookUrl: string,
  result: HitResult,
  opts?: { mention?: string }
): Promise<void> {
  const payload = buildSlackMessage(result, opts);
  await axios.post(webhookUrl, payload, { headers: { 'Content-Type': 'application/json' } });
}
