import { Link } from 'react-router-dom'

import { GameHeader } from './GamePage.jsx'
import { games } from './games.js'

export default function GameIndexPage() {
  return (
    <main className="game-page">
      <GameHeader />

      <section className="game-index">
        <header>
          <p className="game-eyebrow">Video Forge Studios</p>
          <h1>Our games</h1>
          <p>Three games created by our independent studio in Texas.</p>
        </header>

        <div className="game-card-list">
          {games.map((game) => (
            <article className={`game-card game-theme-${game.theme}`} key={game.slug}>
              <p>{game.eyebrow}</p>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <dl>
                <div>
                  <dt>Genre</dt>
                  <dd>{game.genre}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{game.status}</dd>
                </div>
              </dl>
              <Link to={`/games/${game.slug}`}>View game</Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
