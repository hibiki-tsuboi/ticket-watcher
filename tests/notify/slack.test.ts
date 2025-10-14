import { describe, it, expect } from 'vitest';
import { buildSlackMessage } from '../../src/notify/slack.js';

describe('buildSlackMessage', () => {
  it('found=true かつ 発売中あり の文面', () => {
    const msg = buildSlackMessage({
      found: true,
      query: '電池の切れかけた蟹',
      url: 'https://ticket.fany.lol',
      available: true,
      availableCount: 1
    });
    expect(msg.text).toContain('✅ 発売中');
    expect(msg.text).toContain('https://ticket.fany.lol');
  });

  it('found=true だが 発売中なし の文面', () => {
    const msg = buildSlackMessage({
      found: true,
      query: '電池の切れかけた蟹',
      url: 'https://ticket.fany.lol',
      available: false,
      availableCount: 0
    });
    expect(msg.text).toContain(':x: 発売なし');
  });

  it('found=false の文面', () => {
    const msg = buildSlackMessage({ found: false, query: 'テスト', url: 'https://ticket.fany.lol' });
    expect(msg.text).toContain(':x: ヒットなし');
  });
});
