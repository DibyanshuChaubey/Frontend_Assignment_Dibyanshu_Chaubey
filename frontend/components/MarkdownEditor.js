import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

export function MarkdownEditor({ content, onChange, readOnly = false }) {
  const [preview, setPreview] = useState(false)
  const [markdown, setMarkdown] = useState(content)

  useEffect(() => {
    setMarkdown(content)
  }, [content])

  const handleChange = (e) => {
    const value = e.target.value
    setMarkdown(value)
    onChange(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold">Markdown Supported</p>
          <p className="text-xs">**bold** *italic* `code` [link](url) # headers</p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
          >
            {preview ? '✏️ Edit' : '👁️ Preview'}
          </button>
        )}
      </div>

      {preview ? (
        <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 prose prose-sm max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={markdown}
          onChange={handleChange}
          disabled={readOnly}
          className="w-full h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="Write your note in Markdown..."
        />
      )}
    </div>
  )
}
