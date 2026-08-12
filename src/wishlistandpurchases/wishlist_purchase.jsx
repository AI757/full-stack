// Creates and exports the wishlist and purchase section of the website.
//
// The layout is a two-column split rather than a single centred card. The left
// column carries the message and the actions; the right carries the release
// facts. Separating them means a visitor scanning for "is it out yet" does not
// have to read the prose to find out, and the primary button no longer sits at
// the bottom of a tall stack of text.
export default function WishlistPurchase() {
  return (
    <main className="store-page">
      <div className="store-split">
        {/* Left column: the greeting, what this is, and what to do next. */}
        <section className="store-lede">
          {/* The main heading greets visitors arriving on this page. */}
          <h1 className="store-title">Welcome</h1>

          {/* This paragraph briefly explains what visitors can do here. */}
          <p className="store-description">
            Wishlist our upcoming game or visit Steam to purchase our games.
          </p>

          <div className="store-actions">
            {/* This link opens the Steam page for Lanyards Attack in a new tab.
                Warm fill marks it as the primary action — only one element in
                this view gets that treatment. */}
            <a
              className="store-button store-button-primary"
              href="https://store.steampowered.com/app/STEAM_APP_ID"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wishlist Lanyards Attack
            </a>

            {/* This link opens the studio's Steam developer page in a new tab.
                Outline-only, so it reads as the recessive of the two. */}
            <a
              className="store-button store-button-secondary"
              href="https://store.steampowered.com/developer/DEVELOPER_NAME"
              target="_blank"
              rel="noopener noreferrer"
            >
              Purchase on Steam
            </a>
          </div>
        </section>

        {/* Right column: the release facts, pulled out of the prose so they can
            be scanned rather than read. A definition list because each row is a
            label paired with a value, which is exactly what dl/dt/dd describe —
            a table would imply rows and columns that do not exist here. */}
        <aside className="store-facts">
          <h2 className="store-facts-title">Lanyards Attack</h2>

          <dl className="store-fact-list">
            <div className="store-fact">
              <dt>Status</dt>
              {/* The dot is decorative and aria-hidden; "In development" is the
                  text that carries the meaning. */}
              <dd>
                <span className="store-dot" aria-hidden="true"></span>
                In development
              </dd>
            </div>

            <div className="store-fact">
              <dt>Platform</dt>
              <dd>Steam</dd>
            </div>

            <div className="store-fact">
              <dt>Release</dt>
              <dd>To be announced</dd>
            </div>
          </dl>

          <p className="store-note">
            Wishlisting on Steam is what tells us how many people are waiting,
            and it is how you hear first when the store page goes live.
          </p>
        </aside>
      </div>
    </main>
  );
}