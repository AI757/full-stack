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
- `/login` — Passport session login
- `/register` — account registration followed by automatic login

Authentication requests use `credentials: "include"` so the browser can send
the backend's HTTP-only session cookie. Passwords and session identifiers are
not stored in frontend state or browser storage.

## Validation

- `npm run lint`
- `npm run build`
