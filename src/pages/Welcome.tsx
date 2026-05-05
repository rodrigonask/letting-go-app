import { useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Welcome() {
  const nav = useNavigate()

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-sage-500 via-sage-400 to-sage-600 text-cream p-6">
      <div className="max-w-xl text-center">
        <div className="text-[11px] tracking-[0.42em] uppercase text-gold-soft mb-6">
          Organize <span className="font-display italic lowercase tracking-normal text-base">by</span> Designe™
        </div>
        <h1 className="font-display italic font-light text-5xl md:text-7xl leading-[0.95]">
          Welcome,
          <br />
          <span className="font-medium text-gold-soft">friend.</span>
        </h1>
        <div className="accent-rule mx-auto mt-6 bg-gold-soft" />
        <p className="font-display italic text-xl md:text-2xl text-cream/85 mt-8 leading-snug">
          You don't have to carry it all.
          <br />
          The weight you feel is not permanent.
        </p>
        <p className="text-sm text-cream/70 mt-8 max-w-md mx-auto">
          This app is your gentle companion. Your notes save automatically on this device. There are no accounts, no logins, no rush.
        </p>
        <button
          onClick={() => nav('/journey/welcome')}
          className="mt-10 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-cream text-sage-600 font-medium tracking-wide hover:bg-gold-soft transition-colors"
        >
          <Sparkles className="w-4 h-4" /> Begin
        </button>
        <button onClick={() => nav('/')} className="block mx-auto mt-4 text-sm text-cream/70 hover:text-cream">
          Skip to home
        </button>
      </div>
    </div>
  )
}
