import { loadConfig } from './config.js';
import { searchFany } from './watchers/fany.js';
import { postToSlack } from './notify/slack.js';

async function main() {
  const config = loadConfig();
  const result = await searchFany(config.query);

  if (result.found || config.notifyAlways) {
    await postToSlack(config.slackWebhookUrl, {
      found: result.found,
      query: config.query,
      url: result.url,
      notes: result.note
    });
  }

  // エラーで落ちないように終了コードを明示
  process.exit(0);
}

main().catch((err) => {
  console.error('実行エラー:', err);
  process.exit(1);
});

