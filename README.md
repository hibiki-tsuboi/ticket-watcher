# ticket-watcher

チケットサイト（FANY）で「電池の切れかけた蟹」のヒット有無を10分おきにチェックし、Slackへ通知します。Playwright + TypeScript で実装し、GitHub Actions で定期実行します。

## 使い方

1) 依存関係のセットアップ

```
make setup
```

2) ローカル実行（.env にWebhook等を設定）

`.env.example` を参考に `.env` を作成し、以下を実行:

```
make run
```

3) GitHub Actions での定期実行

- リポジトリの Secrets に `SLACK_WEBHOOK_URL` を登録してください。
- 既定で 5 分間隔（`*/5 * * * *`）で実行されます。

## 設定項目（環境変数）

- `SLACK_WEBHOOK_URL`（必須）Slack Incoming Webhook URL
- `QUERY`（任意）検索キーワード。既定は「電池の切れかけた蟹」
- `NOTIFY_ALWAYS`（任意）ヒットなしでも通知したい場合は `true`
- `SLACK_MENTION`（任意）通知に含めるメンション。
  - 推奨: `<@UXXXXXXXX>` 形式（SlackのユーザーID）
  - 表示名で指定したい場合は `@Tsuboi` のように記載（Webhook側で `link_names` により可能な範囲でリンク化）

### メンションの付与

- `.env` もしくは GitHub Secrets/Variables で `SLACK_MENTION` を設定します。
- 例:
  - `SLACK_MENTION=<@U12345678>`（確実にメンション）
  - `SLACK_MENTION=@Tsuboi`（可能ならリンク化してメンション）

## 開発コマンド

- `make setup` 依存関係を導入（Playwrightのブラウザ含む）
- `make run` ローカル実行
- `make test` テスト実行（Vitest）
- `make lint` ESLint
- `make format` Prettier

## 注意

- Secrets（Webhook URLなど）はコミットしないでください。GitHub Secretsを利用してください。
