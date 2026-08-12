import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { apiRequest } from '../lib/api.js'
import BlogShell from './BlogShell.jsx'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
})

function BlogListPage() {
  const [posts, setPosts] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadPosts() {
      try {
        const result = await apiRequest('/api/blog')

        if (isCurrent) setPosts(result.posts)
      } catch (requestError) {
        if (isCurrent) setError(requestError.message)
      }
    }

    loadPosts()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <BlogShell>
      <section className="blog-intro">
        <p className="blog-eyebrow">From inside the forge</p>
        <h1>Development notes</h1>
        <p>
          Updates, technical discoveries, and behind-the-scenes stories from our
          games in progress.
        </p>
      </section>

      <section className="blog-list" aria-live="polite">
        {error && (
          <div className="blog-notice blog-notice-error" role="alert">
            <h2>Could not load the blog</h2>
            <p>{error}</p>
          </div>
        )}

        {!error && posts === null && (
          <p className="blog-loading">Loading development notes…</p>
        )}

        {posts?.length === 0 && (
          <div className="blog-notice">
            <h2>No entries yet</h2>
            <p>The first development update is still being forged.</p>
          </div>
        )}

        {posts?.map((post) => (
          <article className="blog-entry-card" key={post.id}>
            {post.coverImageUrl && (
              <Link
                className="blog-entry-cover"
                to={`/blog/${post.slug}`}
                tabIndex="-1"
                aria-hidden="true"
              >
                <img src={post.coverImageUrl} alt="" loading="lazy" />
              </Link>
            )}

            <div className="blog-entry-copy">
              <p className="blog-entry-meta">
                By {post.author.username}
                {post.publishedAt && (
                  <>
                    {' · '}
                    <time dateTime={post.publishedAt}>
                      {dateFormatter.format(new Date(post.publishedAt))}
                    </time>
                  </>
                )}
              </p>
              <h2>
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.excerpt}</p>
              <Link className="blog-read-link" to={`/blog/${post.slug}`}>
                Read entry <span aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
    </BlogShell>
  )
}

export default BlogListPage
