import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import HmyrakAnna from './pages/HmyrakAnna'
import BarsukovRodion from './pages/BarsukovRodion'
import SkripnikDima from './pages/SkripnikDima'
import KoryaginNazar from './pages/KoryaginNazar'
import KhalinIhor from './pages/KhalinIhor'
import ZavaliaievMykhailo from './pages/ZavaliaievMykhailo'
import PahiEduard from './pages/PahiEduard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="hmyrak-anna" element={<HmyrakAnna />} />
        <Route path="barsukov-rodion" element={<BarsukovRodion />} />
        <Route path="skripnik-dima" element={<SkripnikDima />} />
        <Route path="koryagin-nazar" element={<KoryaginNazar />} />
        <Route path="khalin-ihor" element={<KhalinIhor />} />
        <Route path="zavaliaiev-mykhailo" element={<ZavaliaievMykhailo />} />
        <Route path="pahi-eduard" element={<PahiEduard />} />
      </Route>
    </Routes>
  )
}

export default App
