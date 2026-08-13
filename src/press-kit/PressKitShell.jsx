import { Link, NavLink } from 'react-router-dom'

import './press-kit.css'

function PressKitShell({ children }) {
  return (
    <main className="press-kit-page">
      <header className="press-kit-header">
        <Link className="press-kit-brand" to="/press-kit">
          <span>Video Forge Studios</span>
          <strong>Press Kit</strong>
        </Link>

        <nav className="press-kit-nav" aria-label="Press Kit navigation">
          <NavLink to="/press-kit" end>
            Q&amp;A
          </NavLink>
          <NavLink to="/press-kit/manage">Manage</NavLink>
          <Link to="/">Studio home</Link>
        </nav>
      </header>

      {children}
    </main>
  )
}

export default PressKitShell
