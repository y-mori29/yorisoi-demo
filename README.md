# yorisoi-demo

よりそいのデモです

## Overview

This project demonstrates the yorisoi demo application. It is composed of two main parts:

- `backend/` – an Express server with WebSocket support.
- `frontend/` – a Next.js user interface.

## Directory Structure

```
.
├── backend/         Express + WebSocket server
├── frontend/        Next.js UI
├── .env.example     Sample environment variables
├── package.json     Project scripts and dependencies
└── README.md        Project documentation
```

## Prerequisites

- Node.js
- npm

## Environment Variables

| Name | Description |
| ---- | ----------- |
| `GOOGLE_API_KEY` | API key for Google Gemini. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to the Google Cloud JSON credentials for Speech-to-Text. |
| `DATABASE_URL` | Connection string for the database. |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL used by the frontend to connect to the backend. |
| `NEXT_PUBLIC_DISCLAIMER_TEXT` | Disclaimer text displayed in the UI. Set after legal review. |
| `ACCESS_LOG_MAX_BYTES` | *(optional)* Maximum size for access log files. |

The repository includes an `.env.example` template. Copy it to `.env` and fill in the required values.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```
2. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```
3. Start the backend server:

   ```bash
   npm run dev:backend
   ```
4. Start the frontend development server:

   ```bash
   npm run dev:frontend
   ```

## Disclaimer

Set `NEXT_PUBLIC_DISCLAIMER_TEXT` after legal review.

サマリー画面および共有リンク画面のフッターに免責事項が表示されます。文言は `NEXT_PUBLIC_DISCLAIMER_TEXT` 環境変数で管理しており、法務確認後に設定してください。

## 日本語での補足説明

### プロジェクト概要
このプロジェクトは Express と WebSocket を利用したバックエンドと、Next.js を利用したフロントエンドから構成されています。アプリの動作や構成を理解するためのデモです。

### ディレクトリ構成
- `backend/` - Express と WebSocket を使ったサーバー
- `frontend/` - Next.js を使ったユーザーインターフェース
- `.env.example` - 環境変数のサンプル
- `package.json` - スクリプトと依存関係の定義

### 前提条件
開発を始めるには Node.js と npm が必要です。

### 環境変数
- `GOOGLE_API_KEY`: Gemini API を利用するためのキー
- `GOOGLE_APPLICATION_CREDENTIALS`: Google Cloud Speech-to-Text 用の認証情報へのパス
- `DATABASE_URL`: データベースへの接続文字列
- `NEXT_PUBLIC_WS_URL`: フロントエンドがバックエンドに接続するための WebSocket URL
- `NEXT_PUBLIC_DISCLAIMER_TEXT`: UI に表示する免責事項の文言（法務確認後に設定）
- `ACCESS_LOG_MAX_BYTES`: （任意）アクセスログファイルの最大サイズ

`.env.example` を `.env` にコピーし、必要な値を設定してください。

### 開発の始め方
1. 依存関係をインストールする: `npm install`
2. `.env` を作成する: `cp .env.example .env`
3. バックエンドを起動する: `npm run dev:backend`
4. フロントエンドを起動する: `npm run dev:frontend`

### 免責事項の設定
`NEXT_PUBLIC_DISCLAIMER_TEXT` に設定した文言がサマリー画面と共有リンク画面のフッターに表示されます。必ず法務確認後に設定してください。
