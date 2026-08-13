import { useState } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import AuthPage from './auth/AuthPage.jsx'
import AuthStatus from './auth/AuthStatus.jsx'
import {
  BlogArticlePage,
  BlogListPage,
  BlogManagePage,
} from './blog/index.js'
import Chatbot from './chatbot'
import GameIndexPage from './game.pages/GameIndexPage.jsx'
import GamePage from './game.pages/GamePage.jsx'
import './auth/auth.css'
import './App.css'
import WishlistPurchase from './wishlistandpurchases/wishlist_purchase.jsx'
function Home() {
  const [count, setCount] = useState(0)

  const games = [
    { slug: 'lanyards-attack', title: 'Lanyards Attack', status: 'In development' },
    { slug: 'signal-lost', title: 'Signal Lost', status: 'Available now' },
    { slug: 'ashfall-protocol', title: 'Ashfall Protocol', status: 'Available now' },
  ]
  return (
    <>
   <header className="home-nav">
        <span className="home-brand">Video Forge Studios</span>

        <nav className="home-nav-links">
          <a href="/games">Games</a>
          <a href="/blog">Blog</a>
          <a href="/chat">Chat</a>
        </nav>

        <div className="home-nav-actions">
          <AuthStatus />
          <a href="/login" className="home-button home-button-secondary">
            Log In
          </a>
          <a href="/register" className="home-button home-button-primary">
            Sign Up
          </a>
        </div>
      </header>

      <main className="home-page">
        <section className="home-hero">
          <p className="home-eyebrow">Independent game studio</p>

          <h1 className="home-title">Video Forge Studios</h1>

          <p className="home-description">
            We build small, strange games. Make an account to track your
            wishlist, follow release news, and pick up where you left off.
          </p>

          <div className="home-actions">
            <a href="/games" className="home-button home-button-primary">
              Browse Our Games
            </a>
            <a href="/register" className="home-button home-button-secondary">
              Create an Account
            </a>
          </div>

          <img src={heroImg} alt="" className="home-hero-image" />
        </section>

        <section className="home-games">
          <h2 className="home-games-title">Our games</h2>

          <p className="home-wish-count">
            {count === 0 ? 'Nothing wishlisted yet' : `${count} wishlisted`}
          </p>

          <ul className="home-game-list">
            {games.map((game) => (
              <li key={game.slug} className="home-game-card">
                <h3 className="home-game-name">{game.title}</h3>
                <p className="home-game-status">{game.status}</p>

                <div className="home-game-actions">
                  <a href={`/games/${game.slug}`} className="home-game-link">
                    View details
                  </a>

                  <button
                    type="button"
                    className="home-wish-button"
                    onClick={() => setCount((c) => c + 1)}
                  >
                    ☆ Wishlist
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="home-footer">
        <p>© 2026 Video Forge Studios</p>
        <a href="/blog">Read the devlog</a>
        <span className="home-credits">
          <img src={viteLogo} alt="Vite" width="16" height="16" />
          <img src={reactLogo} alt="React" width="16" height="16" />
        </span>
      </footer>    
    </>
  )
}

function DedicatedGameRoute() {
  const { slug } = useParams()

  return <GamePage slug={slug} />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chatbot />} />
      <Route path="/games" element={<GameIndexPage />} />
      <Route path="/games/:slug" element={<DedicatedGameRoute />} />
      <Route path="/blog" element={<BlogListPage />} />
      <Route path="/blog/manage" element={<BlogManagePage />} />
      <Route path="/blog/:slug" element={<BlogArticlePage />} />
      <Route path="/login" element={<AuthPage key="login" mode="login" />} />
      <Route path='/wishlist' element={<WishlistPurchase/>}/>
      <Route
        path="/register"
        element={<AuthPage key="register" mode="register" />}
      />
    </Routes>
  )
}

export default App
