import { Link, NavLink } from 'react-router-dom'

import './blog.css'

function BlogShell({ children }) {
  return (
    <main className="blog-page">
      <header className="blog-header">
        <Link className="blog-brand" to="/blog">
          <span>Video Forge Studios</span>
          <strong>Development Blog</strong>
        </Link>

        <nav className="blog-nav" aria-label="Blog navigation">
          <NavLink to="/blog" end>
            Entries
          </NavLink>
          <NavLink to="/blog/manage">Manage</NavLink>
          <Link to="/">Studio home</Link>
        </nav>
      </header>

      {children}
    </main>
  )
}

export default BlogShell
