import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { useMemo } from 'react'

const renderer = new marked.Renderer()

renderer.image = () =>
  '<span class="blog-inline-image-note">Inline image omitted. Use the cover image URL instead.</span>'

function MarkdownContent({ children }) {
  const renderedMarkdown = useMemo(() => {
    const html = marked.parse(children, { gfm: true, renderer })

    // Markdown may contain raw HTML. Sanitize the complete parser output before
    // React inserts it, and forbid images/styles so only the validated cover URL
    // controls article imagery and presentation.
    return DOMPurify.sanitize(html, {
      FORBID_ATTR: ['style'],
      FORBID_TAGS: ['img', 'style'],
      USE_PROFILES: { html: true },
    })
  }, [children])

  return (
    <div
      className="blog-markdown"
      dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
    />
  )
}

export default MarkdownContent
