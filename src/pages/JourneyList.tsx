import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { journeys } from '@/content/journeys'

export default function JourneyList() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 pt-8 md:pt-14 pb-20">
      <div className="eyebrow mb-3">The Workbook</div>
      <h1 className="font-display italic font-light text-5xl md:text-6xl text-ink leading-none">
        Seven Journeys
      </h1>
      <div className="accent-rule mt-5" />
      <p className="font-display italic text-2xl text-muted mt-6 max-w-xl leading-snug">
        Move at your own pace. Linger where you need to. There is no right speed — only the one that's yours.
      </p>

      <div className="mt-10 space-y-3">
        {journeys.map((j) => (
          <Link
            key={j.id}
            to={`/journey/${j.id}`}
            className="block group rounded-2xl border border-rule/60 hover:border-sage-300 bg-ivory hover:bg-cream/40 transition-all p-6 md:p-7"
          >
            <div className="flex items-start gap-5">
              <div className="font-display italic text-5xl text-gold w-14 text-center flex-shrink-0 leading-none pt-1">
                {j.numberRoman}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                  {j.title}{' '}
                  <span className="italic font-medium text-sage-500">{j.titleAccent}</span>
                </h3>
                <p className="font-display italic text-lg md:text-xl text-muted mt-1.5">{j.subtitle}</p>
                <div className="mt-4 font-display italic text-lg text-sage-600 border-l-2 border-gold pl-4">
                  "{j.quote}"
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-muted group-hover:text-sage-500 group-hover:translate-x-1 transition-all flex-shrink-0 self-center" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
