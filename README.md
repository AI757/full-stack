# Video Forge frontend

React and Vite frontend for the Video Forge Studios website.

## Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` when the backend is not available at the
   default `http://localhost:3000` URL.
3. Run `npm run dev`.

## Routes

- `/` — home page and current authentication status
- `/chat` — game-information chatbot
- `/blog` — published development-blog entries
- `/blog/:slug` — rendered Markdown article
- `/blog/manage` — administrator upload, preview, moderation, and deletion panel
- `/login` — Passport session login
- `/register` — account registration followed by automatic login

Authentication requests use `credentials: "include"` so the browser can send
the backend's HTTP-only session cookie. Passwords and session identifiers are
not stored in frontend state or browser storage.

The management panel accepts `.md` and `.markdown` files up to 256 KiB and shows
their final sanitized rendering without providing an online Markdown editor.
Inline Markdown images and styles are omitted. An optional cover image can be
provided through a public HTTPS URL, which is validated again by the backend.

## Validation

- `npm run lint`
- `npm run build`
