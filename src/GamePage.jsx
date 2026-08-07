import { games, getGame } from "./games";
import "./game-page.css";

/**
 * Reusable dedicated game page.
 *
 * Required prop:
 *   slug: "lanyards-attack" | "signal-lost" | "ashfall-protocol"
 *
 * Optional props:
 *   homeHref, gamesHref, contactEmail, showStudioHeader
 */
export default function GamePage({
  slug,
  homeHref = "/",
  gamesHref = "/#games",
  contactEmail = "",
  showStudioHeader = true,
}) {
  const game = getGame(slug);

  if (!game) {
    return (
      <main className="vf-game-page vf-not-found">
        <p>Game not found.</p>
        <a href={gamesHref}>View all games</a>
      </main>
    );
  }

  const gameNumber = String(games.indexOf(game) + 1).padStart(2, "0");
  const available = game.status === "Available now";
  const contactHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent(`${game.title} updates`)}`
    : "#vf-updates";

  return (
    <main className={`vf-game-page vf-theme-${game.theme}`}>
      {showStudioHeader && (
        <header className="vf-header vf-shell">
          <a className="vf-brand" href={homeHref} aria-label="Video Forge Studios home">
            <span className="vf-brand-mark" aria-hidden="true">VF</span>
            <span>Video Forge</span>
          </a>
          <nav className="vf-nav" aria-label="Game page navigation">
            <a href={gamesHref}>All games</a>
            <a href="#vf-features">Features</a>
            <a href="#vf-updates">Updates</a>
          </nav>
        </header>
      )}

      <section className="vf-hero vf-shell">
        <div className="vf-hero-copy">
          <p className="vf-kicker">{game.eyebrow}</p>
          <h1>{game.title}</h1>
          <p className="vf-tagline">{game.tagline}</p>
          <p className="vf-description">{game.description}</p>
          <div className="vf-actions">
            <a className="vf-button vf-button-primary" href="#vf-buy">
              {available ? "Get the game" : "Join the waitlist"}
            </a>
            <a className="vf-button vf-button-ghost" href="#vf-features">
              <span className="vf-play-icon" aria-hidden="true" /> Explore gameplay
            </a>
          </div>
        </div>

        <div className="vf-game-art" aria-label={`${game.title} decorative key art`}>
          <span className="vf-art-grid" aria-hidden="true" />
          <span className="vf-art-orbit vf-art-orbit-one" aria-hidden="true" />
          <span className="vf-art-orbit vf-art-orbit-two" aria-hidden="true" />
          <span className="vf-art-core" aria-hidden="true"><i /></span>
          <span className="vf-art-label">VIDEO FORGE / {gameNumber}</span>
          <span className="vf-art-status">{game.status}</span>
        </div>
      </section>

      <section className="vf-facts vf-shell" aria-label="Game details">
        <Fact label="Genre" value={game.genre} />
        <Fact label="Players" value={game.players} />
        <Fact label="Platform" value={game.platform} />
        <Fact label="Release" value={game.release} />
      </section>

      <section className="vf-features vf-shell" id="vf-features">
        <div className="vf-section-heading">
          <p className="vf-kicker">HOW IT PLAYS</p>
          <h2>Think fast.<br />Choose carefully.</h2>
        </div>
        <div className="vf-feature-list">
          {game.features.map(([number, title, body]) => (
            <article className="vf-feature-row" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vf-updates" id="vf-updates">
        <div className="vf-shell">
          <div className="vf-section-heading vf-updates-heading">
            <div><p className="vf-kicker">FROM THE TEAM</p><h2>Development log</h2></div>
          </div>
          <div className="vf-update-grid">
            {game.updates.map(([date, title, body]) => (
              <article className="vf-update-card" key={title}>
                <span>{date}</span><h3>{title}</h3><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="vf-buy vf-shell" id="vf-buy">
        <p className="vf-kicker">READY WHEN YOU ARE</p>
        <h2>{available ? "Start playing." : "Be first through the doors."}</h2>
        <p>{available ? `Available for ${game.platform}.` : "Get playtest invitations and release updates."}</p>
        <a className="vf-button vf-button-primary" href={contactHref}>
          {available ? "Purchase inquiry" : "Join the waitlist"}
        </a>
      </section>

      <nav className="vf-switcher vf-shell" aria-label="Other Video Forge games">
        <span>Explore another world</span>
        {games.filter((item) => item.slug !== game.slug).map((item) => (
          <a href={`/games/${item.slug}`} key={item.slug}>{item.title} <b aria-hidden="true">&rarr;</b></a>
        ))}
      </nav>
    </main>
  );
}

function Fact({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>;
}
