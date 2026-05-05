import { ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Home, BookOpen, ListChecks, Timer, Heart } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/journeys', label: 'Journeys', icon: BookOpen },
  { to: '/ladder', label: 'Exposure Ladder', icon: ListChecks },
  { to: '/reset', label: '15-min Reset', icon: Timer },
]

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const hideChrome = location.pathname.startsWith('/welcome')

  return (
    <div className="min-h-screen bg-ivory">
      {!hideChrome && (
        <header className="sticky top-0 z-30 bg-ivory/85 backdrop-blur-md border-b border-rule/60">
          <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-md bg-sage-400 grid place-items-center text-cream font-display italic text-lg leading-none group-hover:bg-sage-500 transition-colors">
                L
              </div>
              <div className="leading-tight">
                <div className="font-display italic text-lg text-ink">Letting Go</div>
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted -mt-0.5">with love</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sage-50 text-sage-600'
                        : 'text-ink-soft hover:text-sage-500 hover:bg-sage-50/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>
      )}

      <main className={hideChrome ? '' : 'pb-28 md:pb-12'}>{children}</main>

      {!hideChrome && (
        <>
          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-ivory/95 backdrop-blur-md border-t border-rule/60 px-2 pb-2 pt-1">
            <div className="flex items-center justify-around">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-medium tracking-wide ${
                      isActive ? 'text-sage-600' : 'text-muted'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </NavLink>
              ))}
            </div>
          </nav>

          <footer className="border-t border-rule/40 mt-16">
            <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-muted">
                <Heart className="w-3.5 h-3.5 text-gold" />
                <span>A gentle workbook by Nichole Gehman &amp; Kate Fish, LMFT</span>
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-muted">
                Organize by Designe™
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
