import { describe, it, expect } from 'vitest';
import { buildSlackMessage } from '../../src/notify/slack.js';

describe('buildSlackMessage', () => {
  it('found=true の文面', () => {
    const msg = buildSlackMessage({ found: true, query: '電池の切れかけた蟹', url: 'https://ticket.fany.lol' });
    expect(msg.text).toContain('✅');
    expect(msg.text).toContain('電池の切れかけた蟹');
    expect(msg.text).toContain('https://ticket.fany.lol');
  });

  it('found=false の文面', () => {
    const msg = buildSlackMessage({ found: false, query: 'テスト', url: 'https://ticket.fany.lol' });
    expect(msg.text).toContain('ヒットなし');
    expect(msg.text).toContain('テスト');
  });
});

