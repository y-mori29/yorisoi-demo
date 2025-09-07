# yorisoi-demo

Demo application for the **yorisoi** project.

The app consists of:

- **backend/** – Express server with WebSocket support, deployed on **Google Cloud Run**.
- **frontend/** – Next.js user interface.

The backend uses **Google Cloud Speech-to-Text** to transcribe audio and **Gemini Flash Lite** (model `gemini-1.5-flash-8b`) to generate summaries.

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
- A Google Cloud project with Speech-to-Text and Gemini APIs enabled

## Environment Variables

| Name | Description |
| ---- | ----------- |
| `GOOGLE_API_KEY` | API key for Gemini Flash Lite. |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google Cloud credentials JSON for Speech-to-Text. |
| `DATABASE_URL` | Connection string for the database. |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL used by the frontend to connect to the backend. |
| `NEXT_PUBLIC_DISCLAIMER_TEXT` | Disclaimer text displayed in the UI. Set after legal review. |
| `ACCESS_LOG_MAX_BYTES` | *(optional)* Maximum size for access log files. |

Copy `.env.example` to `.env` and fill in the required values.

## Local Development

```bash
npm install                # Install dependencies
cp .env.example .env       # Set up environment
npm run dev:backend        # Start backend server
npm run dev:frontend       # Start frontend server
```

## Deploying the Backend to Cloud Run

Build and deploy the backend using the provided Dockerfile:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/yorisoi-backend backend/
gcloud run deploy yorisoi-backend \
  --image gcr.io/PROJECT_ID/yorisoi-backend \
  --region REGION \
  --set-env-vars GOOGLE_API_KEY=YOUR_KEY,DATABASE_URL=YOUR_DB_URL
```

Ensure that the service account used by Cloud Run has access to Speech-to-Text and Gemini APIs and that the credentials JSON is available via `GOOGLE_APPLICATION_CREDENTIALS`.

## Disclaimer

Set `NEXT_PUBLIC_DISCLAIMER_TEXT` after legal review. The text appears in the footer of the summary and share pages.

## 日本語での補足

このプロジェクトは、バックエンドを **Google Cloud Run** 上で動作させ、音声の文字起こしに **Google Cloud Speech-to-Text**、要約生成に **Gemini Flash Lite** を利用します。`.env.example` を参考に環境変数を設定し、上記のコマンドで開発・デプロイを行ってください。
