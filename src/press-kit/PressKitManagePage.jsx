import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import useAuth from '../auth/useAuth.js'
import { ApiError, apiRequest } from '../lib/api.js'
import PressKitShell from './PressKitShell.jsx'
import './press-kit-manage.css'

const answerMaxLength = 8_000
const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
})
// Keep questions awaiting staff action first. Unknown future statuses sort last
// until the moderation workflow explicitly assigns them a queue position.
const statusOrder = { pending: 0, answered: 1, rejected: 2 }

function sortQuestions(questions) {
  return [...questions].sort((first, second) => {
    const firstStatusOrder = statusOrder[first.status] ?? Number.MAX_SAFE_INTEGER
    const secondStatusOrder = statusOrder[second.status] ?? Number.MAX_SAFE_INTEGER
    const statusDifference = firstStatusOrder - secondStatusOrder

    if (statusDifference !== 0) return statusDifference

    return new Date(second.createdAt) - new Date(first.createdAt)
  })
}

function PressKitManagePage() {
  const { isLoading: isAuthLoading, user } = useAuth()
  const [questions, setQuestions] = useState(null)
  const [answerDrafts, setAnswerDrafts] = useState({})
  const [accessState, setAccessState] = useState({
    error: '',
    hasAccess: null,
    userId: null,
  })
  const [pageError, setPageError] = useState('')
  const [busyQuestionId, setBusyQuestionId] = useState(null)

  useEffect(() => {
    if (!user) return undefined

    let isCurrent = true

    async function loadQuestions() {
      try {
        const result = await apiRequest('/api/press-kit/manage')

        if (isCurrent) {
          setQuestions(result.questions)
          setAnswerDrafts(
            Object.fromEntries(
              result.questions.map((item) => [item.id, item.answer ?? '']),
            ),
          )
          setAccessState({ error: '', hasAccess: true, userId: user.id })
        }
      } catch (requestError) {
        if (!isCurrent) return

        if (requestError instanceof ApiError && requestError.status === 403) {
          setAccessState({ error: '', hasAccess: false, userId: user.id })
        } else {
          setAccessState({
            error: requestError.message,
            hasAccess: null,
            userId: user.id,
          })
        }
      }
    }

    loadQuestions()

    return () => {
      isCurrent = false
    }
  }, [user])

  const currentAccess =
    user && accessState.userId === user.id
      ? accessState
      : { error: '', hasAccess: null }

  function updateQuestion(updatedQuestion) {
    setQuestions((current) =>
      sortQuestions(
        current.map((item) =>
          item.id === updatedQuestion.id ? updatedQuestion : item,
        ),
      ),
    )
  }

  async function publishAnswer(item) {
    setPageError('')
    setBusyQuestionId(item.id)

    try {
      const result = await apiRequest(
        `/api/press-kit/manage/${item.id}/answer`,
        {
          method: 'PATCH',
          body: JSON.stringify({ answer: answerDrafts[item.id] ?? '' }),
        },
      )

      updateQuestion(result.question)
      setAnswerDrafts((current) => ({
        ...current,
        [item.id]: result.question.answer,
      }))
    } catch (requestError) {
      setPageError(requestError.message)
    } finally {
      setBusyQuestionId(null)
    }
  }

  async function changeStatus(item) {
    const status = item.status === 'rejected' ? 'pending' : 'rejected'
    setPageError('')
    setBusyQuestionId(item.id)

    try {
      const result = await apiRequest(
        `/api/press-kit/manage/${item.id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      )

      updateQuestion(result.question)
    } catch (requestError) {
      setPageError(requestError.message)
    } finally {
      setBusyQuestionId(null)
    }
  }

  if (isAuthLoading) {
    return (
      <PressKitShell>
        <div className="press-kit-content">
          <p>Checking management access…</p>
        </div>
      </PressKitShell>
    )
  }

  if (!user) {
    return (
      <PressKitShell>
        <div className="press-kit-content">
          <section className="press-kit-section">
            <h1>Sign in to manage Press Kit Q&amp;A</h1>
            <p>Only studio administrators can answer or moderate questions.</p>
            <Link to="/login">Sign in</Link>
          </section>
        </div>
      </PressKitShell>
    )
  }

  if (currentAccess.hasAccess === false) {
    return (
      <PressKitShell>
        <div className="press-kit-content">
          <section className="press-kit-section" role="alert">
            <h1>Administrator access required</h1>
            <p>Your account cannot manage Press Kit questions.</p>
            <Link to="/press-kit">Return to the Press Kit</Link>
          </section>
        </div>
      </PressKitShell>
    )
  }

  if (currentAccess.error) {
    return (
      <PressKitShell>
        <div className="press-kit-content">
          <section className="press-kit-section" role="alert">
            <h1>Management panel unavailable</h1>
            <p>{currentAccess.error}</p>
          </section>
        </div>
      </PressKitShell>
    )
  }

  if (currentAccess.hasAccess === null) {
    return (
      <PressKitShell>
        <div className="press-kit-content">
          <p>Loading Press Kit questions…</p>
        </div>
      </PressKitShell>
    )
  }

  return (
    <PressKitShell>
      <div className="press-kit-content">
        <section className="press-kit-intro">
          <p className="press-kit-eyebrow">Administrator workflow</p>
          <h1>Manage Press Kit Q&amp;A</h1>
          <p>
            Answering a question publishes it immediately. Published answers
            cannot be moved back into the private moderation queue.
          </p>
        </section>

        {pageError && (
          <p className="press-kit-error" role="alert">
            {pageError}
          </p>
        )}

        <section className="press-kit-management" aria-live="polite">
          {questions?.length === 0 && <p>No questions have been submitted.</p>}

          {questions?.map((item) => (
            <article className="press-kit-management-item" key={item.id}>
              <header>
                <div>
                  <span className="press-kit-status">{item.status}</span>
                  <h2>{item.question}</h2>
                </div>
                <p>
                  {item.journalist.username} ·{' '}
                  <time dateTime={item.createdAt}>
                    {dateFormatter.format(new Date(item.createdAt))}
                  </time>
                </p>
              </header>

              <label htmlFor={`press-kit-answer-${item.id}`}>Official answer</label>
              <textarea
                id={`press-kit-answer-${item.id}`}
                value={answerDrafts[item.id] ?? ''}
                onChange={(event) =>
                  setAnswerDrafts((current) => ({
                    ...current,
                    [item.id]: event.target.value,
                  }))
                }
                maxLength={answerMaxLength}
                rows="7"
              />

              <div className="press-kit-management-actions">
                <span>
                  {(answerDrafts[item.id] ?? '').length}/{answerMaxLength}
                </span>
                <button
                  type="button"
                  onClick={() => publishAnswer(item)}
                  disabled={
                    busyQuestionId !== null ||
                    !(answerDrafts[item.id] ?? '').trim()
                  }
                >
                  {item.status === 'answered'
                    ? 'Update public answer'
                    : 'Answer and publish'}
                </button>
                {item.status !== 'answered' && (
                  <button
                    type="button"
                    onClick={() => changeStatus(item)}
                    disabled={busyQuestionId !== null}
                  >
                    {item.status === 'rejected' ? 'Return to pending' : 'Reject'}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </PressKitShell>
  )
}

export default PressKitManagePage
