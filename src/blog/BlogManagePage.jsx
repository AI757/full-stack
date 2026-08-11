import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import useAuth from '../auth/useAuth.js'
import { ApiError, apiRequest } from '../lib/api.js'
import BlogShell from './BlogShell.jsx'
import MarkdownContent from './MarkdownContent.jsx'
import './blog-manage.css'

const maxMarkdownBytes = 256 * 1_024

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isPublicHttpsImageUrl(value) {
  try {
    const imageUrl = new URL(value)
    const hostname = imageUrl.hostname.toLowerCase().replace(/\.$/, '')
    const isIpLiteral =
      /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname) || hostname.startsWith('[')

    return (
      imageUrl.protocol === 'https:' &&
      !imageUrl.username &&
      !imageUrl.password &&
      (!imageUrl.port || imageUrl.port === '443') &&
      hostname !== 'localhost' &&
      !hostname.endsWith('.localhost') &&
      !hostname.endsWith('.local') &&
      !isIpLiteral
    )
  } catch {
    return false
  }
}

function BlogManagePage() {
  const { isLoading: isAuthLoading, user } = useAuth()
  const fileInputRef = useRef(null)
  const [posts, setPosts] = useState(null)
  const [hasAccess, setHasAccess] = useState(null)
  const [pageError, setPageError] = useState('')
  const [formError, setFormError] = useState('')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isSlugCustomized, setIsSlugCustomized] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [coverPreviewStatus, setCoverPreviewStatus] = useState('empty')
  const [status, setStatus] = useState('draft')
  const [sourceFilename, setSourceFilename] = useState('')
  const [bodyMarkdown, setBodyMarkdown] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyPostId, setBusyPostId] = useState(null)

  useEffect(() => {
    if (!user) return undefined

    let isCurrent = true

    async function loadManagedPosts() {
      try {
        const result = await apiRequest('/api/blog/manage')

        if (isCurrent) {
          setPosts(result.posts)
          setHasAccess(true)
        }
      } catch (requestError) {
        if (!isCurrent) return

        if (requestError instanceof ApiError && requestError.status === 403) {
          setHasAccess(false)
        } else {
          setPageError(requestError.message)
        }
      }
    }

    loadManagedPosts()

    return () => {
      isCurrent = false
    }
  }, [user])

  function handleTitleChange(event) {
    const nextTitle = event.target.value
    setTitle(nextTitle)

    if (!isSlugCustomized) setSlug(slugify(nextTitle))
  }

  function handleSlugChange(event) {
    setSlug(slugify(event.target.value))
    setIsSlugCustomized(true)
  }

  async function handleMarkdownFile(event) {
    const file = event.target.files?.[0]
    setFormError('')

    if (!file) {
      setSourceFilename('')
      setBodyMarkdown('')
      return
    }

    if (!/\.(?:md|markdown)$/i.test(file.name)) {
      setFormError('Choose a .md or .markdown file')
      event.target.value = ''
      return
    }

    if (file.size > maxMarkdownBytes) {
      setFormError('Markdown files must be 256 KiB or smaller')
      event.target.value = ''
      return
    }

    let markdown

    try {
      markdown = await file.text()
    } catch {
      setFormError('The selected Markdown file could not be read')
      event.target.value = ''
      return
    }

    if (!markdown.trim()) {
      setFormError('The Markdown file is empty')
      event.target.value = ''
      return
    }

    setSourceFilename(file.name)
    setBodyMarkdown(markdown)

    if (!title) {
      const filenameTitle = file.name
        .replace(/\.(?:md|markdown)$/i, '')
        .replace(/[-_]+/g, ' ')
      setTitle(filenameTitle)

      if (!isSlugCustomized) setSlug(slugify(filenameTitle))
    }
  }

  function resetUploadForm() {
    setTitle('')
    setSlug('')
    setIsSlugCustomized(false)
    setExcerpt('')
    setCoverImageUrl('')
    setCoverPreviewStatus('empty')
    setStatus('draft')
    setSourceFilename('')
    setBodyMarkdown('')

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!bodyMarkdown || !sourceFilename) {
      setFormError('Choose a Markdown file before uploading')
      return
    }

    if (coverImageUrl && coverPreviewStatus !== 'verified') {
      setFormError('The cover must load successfully from a public HTTPS URL')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await apiRequest('/api/blog/manage', {
        method: 'POST',
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          coverImageUrl,
          status,
          sourceFilename,
          bodyMarkdown,
        }),
      })

      setPosts((currentPosts) => [result.post, ...(currentPosts ?? [])])
      resetUploadForm()
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCoverImageUrlChange(event) {
    const nextUrl = event.target.value
    setCoverImageUrl(nextUrl)

    if (!nextUrl) {
      setCoverPreviewStatus('empty')
    } else {
      setCoverPreviewStatus(
        isPublicHttpsImageUrl(nextUrl) ? 'checking' : 'invalid',
      )
    }
  }

  async function changeStatus(post) {
    const nextStatus = post.status === 'published' ? 'draft' : 'published'
    setPageError('')
    setBusyPostId(post.id)

    try {
      const result = await apiRequest(`/api/blog/manage/${post.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      })

      setPosts((currentPosts) =>
        currentPosts.map((currentPost) =>
          currentPost.id === post.id ? result.post : currentPost,
        ),
      )
    } catch (requestError) {
      setPageError(requestError.message)
    } finally {
      setBusyPostId(null)
    }
  }

  async function deletePost(post) {
    if (!window.confirm(`Delete “${post.title}”? This removes it from the blog.`)) {
      return
    }

    setPageError('')
    setBusyPostId(post.id)

    try {
      await apiRequest(`/api/blog/manage/${post.id}`, { method: 'DELETE' })
      setPosts((currentPosts) =>
        currentPosts.filter((currentPost) => currentPost.id !== post.id),
      )
    } catch (requestError) {
      setPageError(requestError.message)
    } finally {
      setBusyPostId(null)
    }
  }

  if (isAuthLoading) {
    return (
      <BlogShell>
        <p className="blog-loading">Checking management access…</p>
      </BlogShell>
    )
  }

  if (!user) {
    return (
      <BlogShell>
        <section className="blog-notice">
          <h1>Sign in to manage the blog</h1>
          <p>Only studio administrators can upload or moderate entries.</p>
          <Link className="blog-button-link" to="/login">
            Sign in
          </Link>
        </section>
      </BlogShell>
    )
  }

  if (hasAccess === false) {
    return (
      <BlogShell>
        <section className="blog-notice blog-notice-error" role="alert">
          <h1>Administrator access required</h1>
          <p>Your account cannot manage development blog entries.</p>
          <Link className="blog-button-link" to="/blog">
            Return to the blog
          </Link>
        </section>
      </BlogShell>
    )
  }

  if (pageError && hasAccess === null) {
    return (
      <BlogShell>
        <section className="blog-notice blog-notice-error" role="alert">
          <h1>Management panel unavailable</h1>
          <p>{pageError}</p>
        </section>
      </BlogShell>
    )
  }

  if (hasAccess === null) {
    return (
      <BlogShell>
        <p className="blog-loading">Loading management panel…</p>
      </BlogShell>
    )
  }

  return (
    <BlogShell>
      <section className="blog-manage-heading">
        <p className="blog-eyebrow">Administrator tools</p>
        <h1>Manage development notes</h1>
        <p>
          Upload Markdown, review its final rendering, then save it as a draft or
          publish it. There is intentionally no browser-based Markdown editor.
        </p>
      </section>

      <div className="blog-manage-grid">
        <form className="blog-upload-panel" onSubmit={handleSubmit}>
          <div className="blog-panel-heading">
            <h2>Upload an entry</h2>
            <p>Maximum Markdown file size: 256 KiB.</p>
          </div>

          <label className="blog-field">
            <span>Markdown file</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,text/markdown,text/plain"
              onChange={handleMarkdownFile}
              required
            />
          </label>

          <label className="blog-field">
            <span>Title</span>
            <input
              type="text"
              maxLength="200"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </label>

          <label className="blog-field">
            <span>URL slug</span>
            <input
              type="text"
              maxLength="220"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={slug}
              onChange={handleSlugChange}
              required
            />
          </label>

          <label className="blog-field">
            <span>Excerpt</span>
            <textarea
              rows="4"
              maxLength="500"
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              required
            />
          </label>

          <label className="blog-field">
            <span>Cover image URL (optional)</span>
            <input
              type="url"
              maxLength="2048"
              pattern="https://.*"
              placeholder="https://cdn.example.com/cover.jpg"
              value={coverImageUrl}
              onChange={handleCoverImageUrlChange}
            />
            <small>
              Must use a public HTTPS hostname. Inline Markdown images are not
              rendered.
            </small>
            {coverPreviewStatus === 'invalid' && (
              <small className="blog-cover-error">
                Enter a public HTTPS URL, not a local host or IP address.
              </small>
            )}
            {coverPreviewStatus === 'failed' && (
              <small className="blog-cover-error">
                The browser could not load this URL as an image.
              </small>
            )}
            {coverPreviewStatus === 'verified' && (
              <small className="blog-cover-verified">Cover image verified.</small>
            )}
          </label>

          <label className="blog-field">
            <span>Initial status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>

          {formError && (
            <p className="blog-form-error" role="alert">
              {formError}
            </p>
          )}

          <button
            className="blog-primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Uploading…' : 'Upload entry'}
          </button>
        </form>

        <section className="blog-preview-panel" aria-live="polite">
          <div className="blog-panel-heading">
            <h2>Render preview</h2>
            <p>{sourceFilename || 'Choose a Markdown file to preview it.'}</p>
          </div>

          {bodyMarkdown ? (
            <article className="blog-preview">
              {isPublicHttpsImageUrl(coverImageUrl) && (
                <img
                  className="blog-preview-cover"
                  src={coverImageUrl}
                  alt=""
                  onLoad={() => setCoverPreviewStatus('verified')}
                  onError={() => setCoverPreviewStatus('failed')}
                />
              )}
              <h1>{title || 'Untitled entry'}</h1>
              {excerpt && <p className="blog-article-excerpt">{excerpt}</p>}
              <MarkdownContent>{bodyMarkdown}</MarkdownContent>
            </article>
          ) : (
            <div className="blog-preview-empty">
              <p>The rendered article will appear here.</p>
            </div>
          )}
        </section>
      </div>

      <section className="blog-moderation-panel">
        <div className="blog-panel-heading">
          <h2>Existing entries</h2>
          <p>Publish drafts, return entries to draft, or delete them.</p>
        </div>

        {pageError && (
          <p className="blog-form-error" role="alert">
            {pageError}
          </p>
        )}

        {posts.length === 0 ? (
          <p className="blog-empty-row">No entries have been uploaded.</p>
        ) : (
          <div className="blog-management-list">
            {posts.map((post) => (
              <article className="blog-management-row" key={post.id}>
                <div>
                  <div className="blog-management-title">
                    <h3>{post.title}</h3>
                    <span className={`blog-status blog-status-${post.status}`}>
                      {post.status}
                    </span>
                  </div>
                  <p>
                    {post.sourceFilename} · by {post.author.username}
                  </p>
                </div>

                <div className="blog-management-actions">
                  {post.status === 'published' && (
                    <Link to={`/blog/${post.slug}`}>View</Link>
                  )}
                  <button
                    type="button"
                    onClick={() => changeStatus(post)}
                    disabled={busyPostId === post.id}
                  >
                    {post.status === 'published' ? 'Move to draft' : 'Publish'}
                  </button>
                  <button
                    className="blog-delete-button"
                    type="button"
                    onClick={() => deletePost(post)}
                    disabled={busyPostId === post.id}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </BlogShell>
  )
}

export default BlogManagePage
