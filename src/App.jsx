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
import {PressKitManagePage, PressKitPage} from './press-kit/index.js'
function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      
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
      <Route path='/press-kit' element={<PressKitPage/>}/>
      <Route path='/press-kit/manage' element={<PressKitManagePage/>}/>
      <Route 
        path="/register"
        element={<AuthPage key="register" mode="register" />}
      />
    </Routes>
  )
}

export default App
