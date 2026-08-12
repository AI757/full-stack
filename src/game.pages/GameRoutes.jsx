import { Route, Routes, useParams } from 'react-router-dom'

import App from '../App.jsx'
import GameIndexPage from './GameIndexPage.jsx'
import GamePage from './GamePage.jsx'

function DedicatedGameRoute() {
  const { slug } = useParams()

  return <GamePage slug={slug} />
}

export default function GameRoutes() {
  return (
    <Routes>
      <Route path="/games" element={<GameIndexPage />} />
      <Route path="/games/:slug" element={<DedicatedGameRoute />} />
      {/* The existing application owns every route outside this feature. */}
      <Route path="*" element={<App />} />
    </Routes>
  )
}
