import { chromium } from 'playwright';

export type SearchOutcome = {
  found: boolean;
  url: string;
  note?: string;
};

const SITE_URL = 'https://ticket.fany.lol/';

// サイト構造が変わっても耐えるよう、複数の候補セレクタを順に試す
const searchInputSelectors = [
  'input[type="search"]',
  'input[name="keyword"]',
  'input[name="q"]',
  'input[placeholder*="検索"]',
  'input[placeholder*="ｹﾝｻｸ"]',
  'input[placeholder*="Search"]'
];

export async function searchFany(query: string): Promise<SearchOutcome> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(SITE_URL, { waitUntil: 'domcontentloaded' });

    let searchInputFound = false;
    for (const sel of searchInputSelectors) {
      const loc = page.locator(sel);
      if (await loc.first().isVisible().catch(() => false)) {
        await loc.first().fill(query);
        // Enter で検索を発火
        await loc.first().press('Enter');
        searchInputFound = true;
        break;
      }
    }

    if (!searchInputFound) {
      // 直接クエリパラメータでの検索も試す（典型的なパターン）
      const fallbackUrls = [
        `${SITE_URL}?s=${encodeURIComponent(query)}`,
        `${SITE_URL}search?keyword=${encodeURIComponent(query)}`,
        `${SITE_URL}search?q=${encodeURIComponent(query)}`
      ];
      for (const u of fallbackUrls) {
        await page.goto(u, { waitUntil: 'domcontentloaded' });
        if ((await page.content()).toLowerCase().includes(query.toLowerCase())) {
          return { found: true, url: page.url(), note: 'URLベース検索のヒット' };
        }
      }
      return { found: false, url: page.url(), note: '検索入力が見つかりませんでした' };
    }

    // 検索結果の描画完了待ち
    await Promise.race([
      page.waitForLoadState('networkidle').catch(() => {}),
      page.waitForTimeout(3000)
    ]);

    // いくつかの否定パターン（日本語での典型）
    const html = await page.content();
    const lower = html.toLowerCase();
    const noHitHints = ['該当', '見つかりません', 'ありません'];
    const noHit = noHitHints.some((t) => lower.includes(t));

    // クエリ語が結果に含まれている or それらしいカード/リンクが存在するか
    const titleHit = await page.locator(`text=${query}`).count();
    const cardHit = await page
      .locator(
        [
          '[class*="card"]',
          '[class*="result"]',
          '[class*="list"] a',
          'a[href*="event" i]',
          'a[href*="show" i]'
        ].join(', ')
      )
      .count();

    const found = !noHit && (titleHit > 0 || cardHit > 0);
    return { found, url: page.url(), note: found ? 'コンテンツマッチ' : 'ヒットなし推定' };
  } finally {
    await context.close();
    await browser.close();
  }
}

