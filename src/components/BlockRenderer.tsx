import { Block, traps, realityChecks } from '@/content/journeys'
import { usePersistedState } from '@/lib/hooks'
import { AllAnswers } from '@/lib/storage'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface Props {
  block: Block
  journeyId: string
}

export default function BlockRenderer({ block, journeyId }: Props) {
  switch (block.type) {
    case 'lede':
      return (
        <p className="font-display italic text-2xl md:text-3xl text-sage-600 leading-snug border-l-2 border-gold pl-5 my-7">
          {block.text}
        </p>
      )
    case 'p':
      return <p className="font-display text-xl leading-relaxed text-ink-soft mb-5">{block.text}</p>
    case 'h2':
      return <h2 className="font-display text-4xl text-ink mt-12 mb-4">{block.text}</h2>
    case 'h3':
      return <h3 className="font-display italic text-3xl text-sage-500 mt-9 mb-3">{block.text}</h3>
    case 'pull':
      return (
        <div className="my-12 px-4 md:px-8 text-center">
          <div className="accent-rule mx-auto mb-5" />
          <p className="font-display italic text-3xl md:text-4xl text-sage-600 leading-snug">
            {block.text}
          </p>
          <div className="accent-rule mx-auto mt-5" />
        </div>
      )
    case 'list':
      return (
        <ul className="space-y-3 my-6">
          {block.items.map((item, i) => (
            <li key={i} className="font-display text-xl text-ink-soft pl-7 relative leading-relaxed">
              <span className="absolute left-0 top-1 text-gold text-2xl leading-none">◦</span>
              {item}
            </li>
          ))}
        </ul>
      )
    case 'story':
      return (
        <div className="my-9 bg-sage-50 border-l-4 border-sage-400 rounded-r-lg p-6 md:p-7">
          <div className="text-xs uppercase tracking-[0.22em] text-sage-600 font-semibold mb-4">
            {block.label}
          </div>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="font-display italic text-xl text-ink-soft leading-relaxed mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      )
    case 'note':
      return (
        <div
          className={`my-9 rounded-lg border p-6 md:p-7 relative overflow-hidden ${
            block.author === 'Nichole'
              ? 'bg-sage-50/60 border-sage-200'
              : 'bg-cream border-gold-soft'
          }`}
        >
          <div
            className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${
              block.author === 'Nichole' ? 'bg-sage-400' : 'bg-gold'
            }`}
          />
          <div className="font-script text-3xl text-sage-500 mb-3 leading-none">— {block.author}</div>
          {block.paragraphs.map((p, i) => (
            <p key={i} className="font-display italic text-xl text-ink-soft leading-relaxed mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      )
    case 'softbox':
      return (
        <div className="my-7 bg-sage-50 rounded-lg p-6 md:p-7">
          <div className="text-xs uppercase tracking-[0.22em] text-sage-600 font-semibold mb-4">
            {block.head}
          </div>
          {block.text && <p className="font-display text-xl text-ink-soft leading-relaxed">{block.text}</p>}
          {block.items && (
            <ul className="space-y-3">
              {block.items.map((item, i) => (
                <li key={i} className="font-display text-xl text-ink-soft pl-6 relative leading-relaxed">
                  <span className="absolute left-0 top-1 text-gold text-xl leading-none">◦</span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    case 'flourish':
      return (
        <div className="text-center my-10 text-gold font-display italic text-3xl">
          —&nbsp;&nbsp;✦&nbsp;&nbsp;—
        </div>
      )
    case 'prompt':
      return <PromptInput journeyId={journeyId} fieldId={block.id} label={block.label} placeholder={block.placeholder} />
    case 'reframe':
      return <ReframeTable journeyId={journeyId} />
    case 'trapcards':
      return (
        <div className="space-y-5 my-7">
          {traps.map((t) => (
            <div key={t.n} className="border-l-[3px] border-sage-400 bg-ivory rounded-r-lg p-6 shadow-sm">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-display italic text-gold text-xl">{t.n}.</span>
                <h4 className="font-display italic text-2xl text-sage-600 font-medium">{t.title}</h4>
              </div>
              <div className="border-l-2 border-gold-soft pl-4 mb-4 space-y-1.5">
                {t.examples.map((e, i) => (
                  <div key={i} className="font-display italic text-lg text-ink-soft">
                    {e}
                  </div>
                ))}
              </div>
              <p className="font-display text-lg text-ink-soft leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      )
    case 'realitychecks':
      return (
        <div className="grid md:grid-cols-2 gap-5 my-9">
          {realityChecks.map((rc) => (
            <div key={rc.n} className="bg-gradient-to-b from-cream to-ivory border border-gold-soft rounded-lg p-6">
              <div className="font-display italic text-xl text-gold mb-1">N° {rc.n}</div>
              <h4 className="font-display text-2xl text-ink mb-3 font-medium">{rc.title}</h4>
              <p className="font-display text-lg text-ink-soft leading-relaxed">{rc.body}</p>
            </div>
          ))}
        </div>
      )
    case 'ladder':
      return (
        <div className="my-9 space-y-4">
          {/* Brief preview — full interactive ladder lives at /ladder */}
          <div className="grid md:grid-cols-5 gap-3">
            {[
              { n: 'I', title: 'Neutral Zone' },
              { n: 'II', title: 'Out of Sight' },
              { n: 'III', title: 'Deep Storage' },
              { n: 'IV', title: 'In the Car' },
              { n: 'V', title: 'Release' },
            ].map((step, i) => (
              <div key={i} className="text-center bg-sage-50 rounded-lg p-4">
                <div className="font-display italic text-4xl text-sage-400">{step.n}</div>
                <div className="font-display text-lg text-ink mt-1">{step.title}</div>
              </div>
            ))}
          </div>
          <Link to="/ladder" className="btn-primary mt-3 text-base">
            Open the Exposure Ladder <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )
    case 'steps':
      return (
        <ol className="space-y-5 my-7">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-5">
              <div className="font-display italic text-4xl text-gold leading-none w-12 text-center flex-shrink-0 pt-1">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="font-display text-2xl text-sage-600 font-medium mb-1.5">{item.title}</div>
                <p className="font-display text-xl text-ink-soft leading-relaxed">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      )
    default:
      return null
  }
}

function PromptInput({ journeyId, fieldId, label, placeholder }: { journeyId: string; fieldId: string; label: string; placeholder?: string }) {
  const [answers, setAnswers] = usePersistedState<AllAnswers>('answers', {})
  const value = answers[journeyId]?.[fieldId] ?? ''
  const onChange = (v: string) => {
    setAnswers({
      ...answers,
      [journeyId]: { ...(answers[journeyId] ?? {}), [fieldId]: v },
    })
  }

  return (
    <div className="my-7">
      <label className="block font-display italic text-2xl text-ink mb-3 leading-snug">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="textarea-soft"
      />
      {value && (
        <div className="text-xs tracking-[0.22em] uppercase text-sage-500 mt-2">
          ✓ saved on this device
        </div>
      )}
    </div>
  )
}

function ReframeTable({ journeyId }: { journeyId: string }) {
  const [answers, setAnswers] = usePersistedState<AllAnswers>('answers', {})
  const rows = (() => {
    const a = answers[journeyId] ?? {}
    const out: { trap: string; reframe: string }[] = []
    for (let i = 0; i < 5; i++) {
      out.push({ trap: a[`trap_${i}`] ?? '', reframe: a[`reframe_${i}`] ?? '' })
    }
    return out
  })()

  const update = (i: number, key: 'trap' | 'reframe', v: string) => {
    setAnswers({
      ...answers,
      [journeyId]: {
        ...(answers[journeyId] ?? {}),
        [key === 'trap' ? `trap_${i}` : `reframe_${i}`]: v,
      },
    })
  }

  return (
    <div className="my-7 grid grid-cols-2 gap-4">
      <div className="text-xs uppercase tracking-[0.22em] text-sage-600 font-semibold pb-2 border-b border-sage-300">
        My Thought Trap
      </div>
      <div className="text-xs uppercase tracking-[0.22em] text-sage-600 font-semibold pb-2 border-b border-sage-300">
        My Kinder Reframe
      </div>
      {rows.map((row, i) => (
        <Row key={i}>
          <textarea
            rows={2}
            value={row.trap}
            onChange={(e) => update(i, 'trap', e.target.value)}
            placeholder="A thought that's holding me back…"
            className="textarea-soft text-lg"
          />
          <textarea
            rows={2}
            value={row.reframe}
            onChange={(e) => update(i, 'reframe', e.target.value)}
            placeholder="A kinder way to say it…"
            className="textarea-soft text-lg"
          />
        </Row>
      ))}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
