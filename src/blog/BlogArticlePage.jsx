import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { apiRequest } from '../lib/api.js'
import BlogShell from './BlogShell.jsx'
import MarkdownContent from './MarkdownContent.jsx'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'long',
})

function BlogArticlePage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let isCurrent = true

    async function loadPost() {
      try {
        const result = await apiRequest(`/api/blog/${encodeURIComponent(slug)}`)

        if (isCurrent) setPost(result.post)
      } catch (requestError) {
        if (isCurrent) setError(requestError.message)
      }
    }

    loadPost()

    return () => {
      isCurrent = false
    }
  }, [slug])

  return (
    <BlogShell>
      {error && (
        <section className="blog-notice blog-notice-error" role="alert">
          <h1>Entry unavailable</h1>
          <p>{error}</p>
          <Link className="blog-button-link" to="/blog">
            Back to all entries
          </Link>
        </section>
      )}

      {!error && !post && (
        <p className="blog-loading">Loading development note…</p>
      )}

      {post && (
        <article className="blog-article">
          <header className="blog-article-heading">
            <Link className="blog-back-link" to="/blog">
              ← All entries
            </Link>
            <p className="blog-eyebrow">Development note</p>
            <h1>{post.title}</h1>
            <p className="blog-article-excerpt">{post.excerpt}</p>
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
          </header>

          {post.coverImageUrl && (
            <img
              className="blog-article-cover"
              src={post.coverImageUrl}
              alt=""
            />
          )}

          <MarkdownContent>{post.bodyMarkdown}</MarkdownContent>
        </article>
      )}
    </BlogShell>
  )
}

export default BlogArticlePage
