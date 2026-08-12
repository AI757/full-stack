import { Link, useNavigate } from 'react-router-dom'

import { games, getGame } from '../games.js'

export default function GamePage({ slug }) {
  const navigate = useNavigate()
  const game = getGame(slug)

  if (!game) return null

  const gameIndex = games.indexOf(game)
  const nextGame = games[gameIndex + 1]
  const nextLabel = nextGame ? `Next: ${nextGame.title}` : 'Back to all games'

  function continueToNextPage() {
    navigate(nextGame ? `/games/${nextGame.slug}` : '/')
  }

  return (
    <main className={`vf-game-page vf-theme-${game.theme}`}>
      <header className="vf-header vf-shell">
        <Link className="vf-brand" to="/" aria-label="Video Forge Studios home">
          <span className="vf-brand-mark" aria-hidden="true">
            VF
          </span>
          <span>Video Forge</span>
        </Link>

        <nav className="vf-nav" aria-label="Game navigation">
          <Link to="/">All games</Link>
          {games.map((item) => (
            <Link
              className={item.slug === game.slug ? 'vf-current-link' : ''}
              key={item.slug}
              to={`/games/${item.slug}`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </header>

      <section className="vf-hero vf-shell">
        <div className="vf-hero-copy">
          <p className="vf-kicker">
            GAME {String(gameIndex + 1).padStart(2, '0')} / {game.status}
          </p>
          <h1>{game.title}</h1>
          <p className="vf-tagline">{game.tagline}</p>
          <p className="vf-description">{game.description}</p>
        </div>

        <div className="vf-game-art" aria-label={`${game.title} decorative art`}>
          <span className="vf-art-grid" aria-hidden="true" />
          <span className="vf-art-orbit vf-art-orbit-one" aria-hidden="true" />
          <span className="vf-art-orbit vf-art-orbit-two" aria-hidden="true" />
          <span className="vf-art-core" aria-hidden="true">
            <i />
          </span>
          <span className="vf-art-label">VIDEO FORGE / {game.title}</span>
          <span className="vf-art-status">{game.status}</span>
        </div>
      </section>

      <section className="vf-facts vf-shell" aria-label="Game details">
        <Fact label="Genre" value={game.genre} />
        <Fact label="Players" value={game.players} />
        <Fact label="Platform" value={game.platform} />
        <Fact label="Release" value={game.release} />
      </section>

      <section className="vf-summary vf-shell">
        <div>
          <p className="vf-kicker">HOW IT PLAYS</p>
          <h2>{game.features[0][1]}</h2>
          <p>{game.features[0][2]}</p>
        </div>

        <button
          className="vf-button vf-button-primary vf-continue-button"
          type="button"
          value=""
          onClick={continueToNextPage}
        >
          {nextLabel} <span aria-hidden="true">→</span>
        </button>
      </section>

      <footer className="vf-footer vf-shell">
        <span>Video Forge Studios</span>
        <Link to="/">All games</Link>
      </footer>
    </main>
  )
}

function Fact({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
