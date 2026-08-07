// Creates and exports the wishlist and purchase section of the website.
export default function WishlistPurchase() {
  return (
    // The main element contains the primary content of this page.
    <main>
      {/* The main heading tells visitors which studio owns the website. */}
      <h1>Video Forge Studios</h1>

      {/* This paragraph briefly explains what visitors can do here. */}
      <p>
        Wishlist our upcoming game or visit Steam to purchase our games.
      </p>

      {/* This link opens the Steam page for Lanyards Attack in a new tab. */}
      <a
        href="https://store.steampowered.com/app/STEAM_APP_ID/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Wishlist Lanyards Attack
      </a>

      {/* This link opens the studio's Steam developer page in a new tab. */}
      <a
        href="https://store.steampowered.com/developer/DEVELOPER_NAME/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Purchase on Steam
      </a>
    </main>
  );
}