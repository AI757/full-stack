// Loads the CSS file that controls the appearance of the entire page.
import "./simple.css";

// Loads the wishlist and purchase component so App can display it.
import WishlistPurchase from "./wishlist_purchase";

// App is the main component rendered by the React application.
export default function App() {
  // Displays the WishlistPurchase component on the page.
  return <WishlistPurchase />;
}