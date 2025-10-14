import { chromium } from 'playwright';

export type SearchOutcome = {
  found: boolean;
  url: string;
  note?: string;
  available?: boolean;
  availableCount?: number;
};

const BASE_URL = 'https://ticket.fany.lol/';
const SEARCH_URL = (q: string) => `${BASE_URL}search/event?keywords=${encodeURIComponent(q)}`;

export async function searchFany(query: string): Promise<SearchOutcome> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 検索専用URLに直接アクセス
    await page.goto(SEARCH_URL(query), { waitUntil: 'domcontentloaded' });

    // 結果のロード待機: networkidle か結果要素の出現、最大8秒
    await Promise.race([
      page.waitForLoadState('networkidle').catch(() => {}),
      page.locator('.fany_g-title .fany_g-resultCnt').first().waitFor({ timeout: 8000 }).catch(() => {}),
      page.locator('a[href^="/event/"]').first().waitFor({ timeout: 8000 }).catch(() => {}),
      page.waitForTimeout(8000)
    ]);

    // DOMから件数を優先的に取得: <div class="fany_g-title"><span>検索結果</span><span class="fany_g-resultCnt"><span>1</span>件</span></div>
    const resultCntSpan = page.locator('.fany_g-title .fany_g-resultCnt span').first();
    if (await resultCntSpan.count()) {
      const cntText = (await resultCntSpan.textContent())?.trim() || '';
      const n = parseInt(cntText, 10);
      if (!Number.isNaN(n)) {
        let availableCount = 0;
        if (n > 0) {
          availableCount = await page.locator('ul.fany_icon__sold').count();
        }
        return {
          found: n > 0,
          url: page.url(),
          note: `検索結果 ${n}件` + (n > 0 ? ` / 発売中 ${availableCount}件` : ''),
          available: n > 0 ? availableCount > 0 : false,
          availableCount: n > 0 ? availableCount : 0
        };
      }
    }

    // フォールバック: bodyテキストから「検索結果 n件」を抽出
    const bodyText = await page.evaluate(() => document.body.innerText || '');
    {
      const m = bodyText.match(/検索結果\s*(\d+)件/);
      if (m) {
        const n = parseInt(m[1], 10);
        // 件数が0より大なら、発売中の有無も確認
        let availableCount = 0;
        if (n > 0) {
          availableCount = await page.locator('ul.fany_icon__sold').count();
        }
        return {
          found: n > 0,
          url: page.url(),
          note: `検索結果 ${n}件` + (n > 0 ? ` / 発売中 ${availableCount}件` : ''),
          available: n > 0 ? availableCount > 0 : false,
          availableCount: n > 0 ? availableCount : 0
        };
      }
    }

    // フォールバック: event詳細リンク数で判定（main制限は外す）
    const eventLinks = await page.locator('a[href^="/event/"]').count();
    if (eventLinks > 0) {
      const availableCount = await page.locator('ul.fany_icon__sold').count();
      return {
        found: true,
        url: page.url(),
        note: `eventリンク ${eventLinks}件 / 発売中 ${availableCount}件`,
        available: availableCount > 0,
        availableCount
      };
    }

    return { found: false, url: page.url(), note: '結果テキスト不明・リンクなし' };
  } finally {
    await context.close();
    await browser.close();
  }
}
