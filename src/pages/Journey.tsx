import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { journeys } from '@/content/journeys'
import BlockRenderer from '@/components/BlockRenderer'

export default function Journey() {
  const { id } = useParams<{ id: string }>()
  const idx = journeys.findIndex((j) => j.id === id)
  const journey = journeys[idx]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!journey) {
    return (
      <div className="max-w-2xl mx-auto p-10 text-center">
        <p className="font-display italic text-xl text-muted">Journey not found.</p>
        <Link to="/journeys" className="btn-ghost mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to journeys
        </Link>
      </div>
    )
  }

  const prev = journeys[idx - 1]
  const next = journeys[idx + 1]

  return (
    <article className="pb-24">
      {/* HEADER */}
      <header className="bg-gradient-to-br from-sage-500 to-sage-600 text-cream py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
          <div className="text-[11px] tracking-[0.42em] uppercase text-gold-soft mb-5">
            Journey {journey.number}
          </div>
          <h1 className="font-display italic font-light text-5xl md:text-7xl leading-[1.0]">
            {journey.title}
            <br />
            <span className="font-medium text-gold-soft">{journey.titleAccent}</span>
          </h1>
          <div className="accent-rule mx-auto mt-6 bg-gold-soft" />
          <p className="font-display italic text-xl md:text-2xl text-cream/85 mt-6 max-w-2xl mx-auto leading-snug">
            "{journey.quote}"
          </p>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-12 md:pt-16">
        <Link to="/journeys" className="inline-flex items-center gap-2 text-sm text-muted hover:text-sage-500 mb-8">
          <ArrowLeft className="w-4 h-4" /> All journeys
        </Link>

        {journey.blocks.map((block, i) => (
          <BlockRenderer key={i} block={block} journeyId={journey.id} />
        ))}

        {/* PREV / NEXT */}
        <div className="flex items-stretch justify-between gap-3 mt-16 pt-8 border-t border-rule/60">
          {prev ? (
            <Link
              to={`/journey/${prev.id}`}
              className="flex-1 group rounded-xl border border-rule/60 p-4 hover:border-sage-300 hover:bg-cream/40 transition-colors"
            >
              <div className="flex items-center gap-1.5 text-[10px] tracking-[0.22em] uppercase text-muted">
                <ArrowLeft className="w-3 h-3" /> Previous
              </div>
              <div className="font-display italic text-lg text-ink mt-1 leading-snug">
                {prev.title} <span className="text-sage-500">{prev.titleAccent}</span>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next && (
            <Link
              to={`/journey/${next.id}`}
              className="flex-1 group rounded-xl border border-sage-300 bg-sage-50/60 p-4 hover:bg-sage-50 hover:border-sage-400 transition-colors text-right"
            >
              <div className="flex items-center justify-end gap-1.5 text-[10px] tracking-[0.22em] uppercase text-sage-600">
                Next <ArrowRight className="w-3 h-3" />
              </div>
              <div className="font-display italic text-lg text-ink mt-1 leading-snug">
                {next.title} <span className="text-sage-500">{next.titleAccent}</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
