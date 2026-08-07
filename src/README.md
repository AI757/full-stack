# Video Forge dedicated game pages

These files are plain React JSX and scoped CSS. They do not require Next.js, Tailwind, or an image library.

## Files to copy

- `GamePage.jsx` - reusable page component
- `games.js` - content for every game
- `game-page.css` - responsive, component-scoped styling
- `react-router-example.jsx` - optional route example

Keep `GamePage.jsx`, `games.js`, and `game-page.css` in the same folder unless you update their import paths.

## Simplest use

Render one page anywhere in your existing app:

```jsx
import GamePage from "./components/games/GamePage";

export default function LanyardsAttackPage() {
  return (
    <GamePage
      slug="lanyards-attack"
      contactEmail="your-email@example.com"
    />
  );
}
```

Use `signal-lost` or `ashfall-protocol` for the other pages.

## React Router use

If your site already uses `react-router-dom`, add this route inside your existing `<Routes>`:

```jsx
<Route path="/games/:slug" element={<DedicatedGameRoute />} />
```

Copy the `DedicatedGameRoute` function from `react-router-example.jsx`. Do not add a second `BrowserRouter` if your site already has one.

Your game URLs will be:

- `/games/lanyards-attack`
- `/games/signal-lost`
- `/games/ashfall-protocol`

## Customize

Edit all titles, descriptions, platforms, features, and updates in `games.js`. Replace `your-email@example.com` with the real studio email. To use your existing site header, pass `showStudioHeader={false}`.

The CSS is prefixed with `vf-` and wrapped by `.vf-game-page`, which reduces conflicts with an existing site's styles.
