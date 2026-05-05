import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import JourneyList from './pages/JourneyList'
import Journey from './pages/Journey'
import Ladder from './pages/Ladder'
import Reset from './pages/Reset'
import Welcome from './pages/Welcome'
import Notes from './pages/Notes'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/journeys" element={<JourneyList />} />
        <Route path="/journey/:id" element={<Journey />} />
        <Route path="/ladder" element={<Ladder />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  )
}
